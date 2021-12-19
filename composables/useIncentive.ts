import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import BigNumber from 'bignumber.js'
import { activeNetwork, useNetwork } from './useNetwork'
import { useRealms } from './useRealms'
import { lpPositionQuery } from './graphql/queries'
import { useNotification } from '~/composables/useNotification'
import uniSwapV3PoolAbi from '~/abi/uniSwapV3Pool.json'
import uniSwapV3PositionManagerAbi from '~/abi/uniswapV3PositionManager.json'
import { useModal } from '~/composables/useModal'
import contractAddresses from '~/constant/contractAddresses'
import { useGraph } from '~/composables/useGraph'
import { EncodedIncentiveKey } from '~/composables/encoders/encoders'
const isApproved = ref(false)
const lpPositions = ref()
const userRewards = ref()
const userPositions = ref()
export function useIncentive() {
  const { close } = useModal()
  const { account } = useWeb3()
  const { getWalletRealms, userRealms } = useRealms()
  const { useL1Network } = useNetwork()
  const error = reactive({
    stake: null,
  })
  const { showError, showSuccess } = useNotification()
  const loading = reactive({
    stake: false,
    lords: false,
    approve: false,
  })
  const rewardInfo = ref()

  const getRewardsByToken = async (tokenId) => {
    try {
      rewardInfo.value = await getRewardInfo(activeNetwork.value, tokenId)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const deposit = async (tokenId) => {
    try {
      await depositLp(activeNetwork.value, account, tokenId)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const getLp = async () => {
    try {
      lpPositions.value = await getLPPositions(activeNetwork.value, account)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const stake = async (tokenId) => {
    try {
      return await stakeToken(activeNetwork.value, tokenId)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const unstake = async (tokenId) => {
    try {
      return await unstakeToken(activeNetwork.value, tokenId)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
      await getRewards()
    }
  }
  const claim = async () => {
    try {
      return await claimReward(activeNetwork.value, account)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      await getRewards()
      loading.stake = false
    }
  }
  const withdraw = async (tokenId) => {
    try {
      return await withdrawToken(activeNetwork.value, account.value, tokenId)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  const getRewards = async () => {
    try {
      userRewards.value = await rewards(activeNetwork.value, account.value)
    } catch (e) {
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const { gqlRequest } = useGraph()

  const fetchUserPositions = async () => {
    try {
      const positions = await gqlRequest(
        lpPositionQuery,
        { address: account.value },
        'mainnetStaking'
      )
      userPositions.value = positions.positions
    } catch (e) {
      console.log(e)
    }
    return {}
  }

  return {
    getRewardsByToken,
    rewardInfo,
    deposit,
    lpPositions,
    getLp,
    withdraw,
    unstake,
    getRewards,
    userRewards,
    claim,
    stake,
    fetchUserPositions,
    userPositions,
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

  const deposit = await positionManager[
    'safeTransferFrom(address,address,uint256,bytes)'
  ](
    account.value,
    '0xe34139463ba50bd61336e0c446bd8c0867c6fe65',
    tokenId,
    EncodedIncentiveKey()
  )

  await deposit.wait()

  return deposit
}

async function getLPPositions(network, account) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniSwapV3PositionManager =
    contractAddresses[network.id].uniswapV3PositionManager
  const positionManager = new ethers.Contract(
    uniSwapV3PositionManager,
    uniSwapV3PositionManagerAbi,
    provider
  )

  const balance = await positionManager.balanceOf(account.value)

  const tokenIds = await positionManager.tokenOfOwnerByIndex(account.value, 0)

  return tokenIds
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

  const unstake = await poolContract.unstakeToken(getTuple(network), tokenId)

  return await unstake.wait()
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

  const unstake = await poolContract.stakeToken(getTuple(network), tokenId)

  return await unstake.wait()
}
async function claimReward(network, account) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const lordsToken = contractAddresses[network.id].lordsTokenAddress
  const signer = provider.getSigner()
  console.log(signer)
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    signer
  )

  const claim = await poolContract.claimReward(lordsToken, account.value, 0)

  return await claim.wait()
}

async function withdrawToken(network, account, tokenId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    provider
  )

  const withdraw = await poolContract.withdrawToken(
    tokenId,
    account.value,
    '0x'
  )
  await withdraw.wait()

  return withdraw
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
