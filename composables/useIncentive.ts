import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import { activeNetwork, useNetwork } from './useNetwork'
import { lpIncentivesQuery, lpPositionQuery } from './graphql/queries'
import { useNotification } from '~/composables/useNotification'
import uniSwapV3PoolAbi from '~/abi/uniSwapV3Pool.json'
import uniSwapV3PositionManagerAbi from '~/abi/uniswapV3PositionManager.json'
import contractAddresses from '~/constant/contractAddresses'
import { useGraph } from '~/composables/useGraph'
import {
  EncodedIncentiveKey,
  getTuple,
  getV2Tuple,
  V2EncodedIncentiveKey,
} from '~/composables/encoders/encoders'

const lpPositions = ref()
const userRewards = ref()
const userPositions = ref()

export function useIncentive() {
  const loading = reactive({
    claim: false,
    deposit: false,
    stake: false,
    rewards: false,
  })
  const { account } = useWeb3()
  const error = reactive({
    stake: null,
  })
  const { showError, showSuccess } = useNotification()
  const { useL1Network } = useNetwork()
  const rewardInfo = ref()
  const poolIncentives = ref([])

  const getRewardsByToken = async (tokenId, v2) => {
    try {
      rewardInfo.value = await getRewardInfo(activeNetwork.value, tokenId, v2)
    } catch (e) {
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const getIncentivesForPool = async () => {
    try {
      const { incentives } = await gqlRequest(
        lpIncentivesQuery,
        { address: contractAddresses[useL1Network.value.id].lordsPool },
        'staker'
      )
      poolIncentives.value = incentives
    } catch (e) {
      console.log(e)
    }
  }

  const deposit = async (tokenId) => {
    loading.deposit = true
    try {
      const tx = await depositLp(activeNetwork.value, account, tokenId)
      updateUserPosition(tokenId, tx)
    } catch (e) {
      await showError(e.message)
      error.stake = e.message
    } finally {
      loading.deposit = false
    }
  }

  const stake = async (tokenId, v2) => {
    loading.stake = true
    try {
      const tx = await stakeToken(activeNetwork.value, tokenId, v2)
      updateUserPosition(tokenId, tx)
    } catch (e) {
      await showError(e.message)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const unstake = async (tokenId, v2) => {
    loading.stake = true
    try {
      const tx = await unstakeToken(activeNetwork.value, tokenId, v2)
      updateUserPosition(tokenId, tx)
    } catch (e) {
      await showError(e.message)
    } finally {
      rewardInfo.value = 0
      await getRewards()

      loading.stake = false
    }
  }
  const claim = async () => {
    loading.claim = true
    try {
      return await claimReward(activeNetwork.value, account)
    } catch (e) {
      await showError(e.message)
    } finally {
      await getRewards()
    }
  }
  const withdraw = async (tokenId) => {
    loading.stake = true
    try {
      const tx = await withdrawToken(
        activeNetwork.value,
        account.value,
        tokenId
      )
      updateUserPosition(tokenId, tx)
    } catch (e) {
      await showError(e.message)
    } finally {
      loading.stake = false
    }
  }
  const getRewards = async () => {
    loading.rewards = true
    try {
      userRewards.value = await rewards(activeNetwork.value, account.value)
    } catch (e) {
      // await showError(e)
    } finally {
      loading.rewards = false
      loading.claim = false
    }
  }

  const { gqlRequest } = useGraph()

  const fetchUserPositions = async () => {
    try {
      const positions = await gqlRequest(
        lpPositionQuery,
        { address: account.value },
        'staker'
      )
      console.log(positions)
      userPositions.value = [
        ...positions?.positions,
        ...positions?.depositedPositions,
      ]
    } catch (e) {
      console.log(e)
    }
  }

  const updateUserPosition = (tokenId, tx) => {
    const position = userPositions.value.find(
      (position) => position.tokenId === tokenId
    )
    tx.events.forEach((event) => {
      if (event.event === 'Transfer') {
        position.oldOwner = event.args[0]
        position.owner = event.args[1]

        if (
          event.args[1] ===
          contractAddresses[useL1Network.value.id].uniswapV3Pool
        ) {
          position.staked = true
        }
      }
      if (event.event === 'TokenStaked') {
        position.staked = true
      }
      if (event.event === 'TokenUnstaked') {
        position.staked = false
      }
      if (event.event === 'DepositTransferred') {
        if (event.args[2] === '0x0000000000000000000000000000000000000000') {
          position.owner = event.args[1]
        }
      }
    })
  }

  return {
    getIncentivesForPool,
    getRewardsByToken,
    rewardInfo,
    deposit,
    lpPositions,
    withdraw,
    unstake,
    getRewards,
    userRewards,
    claim,
    stake,
    fetchUserPositions,
    userPositions,
    loading,
    poolIncentives,
  }
}

async function getRewardInfo(network, tokenId, v2) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    provider
  )
  let r
  if (v2) {
    r = await poolContract.getRewardInfo(getV2Tuple(network), tokenId)
  } else {
    r = await poolContract.getRewardInfo(getTuple(network), tokenId)
  }

  return ethers.utils.formatEther(r[0])
}

async function depositLp(network, account, tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const uniSwapV3PositionManager =
    contractAddresses[network.id].uniswapV3PositionManager

  const positionManager = new ethers.Contract(
    uniSwapV3PositionManager,
    uniSwapV3PositionManagerAbi,
    signer
  )

  const tx = await positionManager[
    'safeTransferFrom(address,address,uint256,bytes)'
  ](
    account.value,
    contractAddresses[network.id].uniswapV3Pool,
    tokenId,
    V2EncodedIncentiveKey(network)
  )
  const receipt = await tx.wait()

  return receipt
}

async function unstakeToken(network, tokenId, v2) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const signer = provider.getSigner()
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )
  let tx

  if (v2) {
    tx = await poolContract.unstakeToken(getV2Tuple(network), tokenId)
  } else {
    tx = await poolContract.unstakeToken(getTuple(network), tokenId)
  }
  const receipt = await tx.wait()

  return receipt
}

async function stakeToken(network, tokenId, v2) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const signer = provider.getSigner()
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )
  console.log(getV2Tuple(network))
  let tx
  if (v2) {
    tx = await poolContract.stakeToken(getV2Tuple(network), tokenId)
  } else {
    tx = await poolContract.stakeToken(getTuple(network), tokenId)
  }

  const receipt = await tx.wait()
  return receipt
}
async function claimReward(network, account) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const lordsToken = contractAddresses[network.id].lordsTokenAddress
  const signer = provider.getSigner()
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )

  const tx = await poolContract.claimReward(lordsToken, account.value, 0)
  const receipt = await tx.wait()
  return receipt
}

async function withdrawToken(network, account, tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const signer = provider.getSigner()
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )

  const tx = await poolContract.withdrawToken(tokenId, account, '0x')
  const receipt = await tx.wait()
  return receipt
}

async function rewards(network, account) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool

  const lordsToken = contractAddresses[network.id].lordsTokenAddress

  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    provider
  )

  return ethers.utils.formatEther(
    await poolContract.rewards(lordsToken, account)
  )
}
