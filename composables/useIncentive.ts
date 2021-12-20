import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import { activeNetwork, useNetwork } from './useNetwork'
import { lpPositionQuery } from './graphql/queries'
import { useNotification } from '~/composables/useNotification'
import uniSwapV3PoolAbi from '~/abi/uniSwapV3Pool.json'
import uniSwapV3PositionManagerAbi from '~/abi/uniswapV3PositionManager.json'
import contractAddresses from '~/constant/contractAddresses'
import { useGraph } from '~/composables/useGraph'
import { EncodedIncentiveKey } from '~/composables/encoders/encoders'

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
<<<<<<< HEAD
  const { showError } = useNotification()

=======
  const { showError, showSuccess } = useNotification()
  const { useL1Network } = useNetwork()
>>>>>>> 6541e4e48... update staker address + graph fixes
  const rewardInfo = ref()

  const getRewardsByToken = async (tokenId) => {
    try {
      rewardInfo.value = await getRewardInfo(activeNetwork.value, tokenId)
    } catch (e) {
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const deposit = async (tokenId) => {
    loading.deposit = true
    try {
      await depositLp(activeNetwork.value, account, tokenId)
    } catch (e) {
      await showError(e.message)
      error.stake = e.message
    } finally {
      setTimeout(async () => {
        await fetchUserPositions()
      }, 4500)
      loading.deposit = false
    }
  }

  const stake = async (tokenId) => {
    loading.stake = true
    try {
      return await stakeToken(activeNetwork.value, tokenId)
    } catch (e) {
      await showError(e.message)
      error.stake = e.message
    } finally {
      setTimeout(async () => {
        await fetchUserPositions()
      }, 4500)
      loading.stake = false
    }
  }

  const unstake = async (tokenId) => {
    loading.stake = true
    try {
      return await unstakeToken(activeNetwork.value, tokenId)
    } catch (e) {
      await showError(e.message)
    } finally {
      rewardInfo.value = 0
      await getRewards()
      setTimeout(async () => {
        await fetchUserPositions()
      }, 4500)
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
      return await withdrawToken(activeNetwork.value, account.value, tokenId)
    } catch (e) {
      await showError(e.message)
    } finally {
      setTimeout(async () => {
        await fetchUserPositions()
      }, 4500)
      loading.stake = false
    }
  }
  const getRewards = async () => {
    console.log('rewards')
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
    const stakerUrl = useL1Network.value.id + 'Staker'
    try {
      const positions = await gqlRequest(
        lpPositionQuery,
        { address: account.value },
        stakerUrl
      )
      userPositions.value = positions
    } catch (e) {
      console.log(e)
    }
  }

  return {
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
  }
}

const getTuple = (network) => {
  return {
    rewardToken: contractAddresses[network.id].lordsTokenAddress,
    pool: contractAddresses[network.id].lordsPool,
    startTime: 1639766563,
    endTime: 1640630563,
    refundee: contractAddresses[network.id].treasury,
  }
}

async function getRewardInfo(network, tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    provider
  )
  const r = await poolContract.getRewardInfo(getTuple(network), tokenId)

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
    EncodedIncentiveKey()
  )
  await tx.wait()

  return tx
}

async function unstakeToken(network, tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const signer = provider.getSigner()
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )

  const tx = await poolContract.unstakeToken(getTuple(network), tokenId)
  await tx.wait()

  return tx
}

async function stakeToken(network, tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const signer = provider.getSigner()
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )
  const tx = await poolContract.stakeToken(getTuple(network), tokenId)
  await tx.wait()
  return tx
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
  await tx.wait()
  return tx
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
  await tx.wait()
  return tx
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
