import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import BigNumber from 'bignumber.js'
import { activeNetwork, useNetwork } from './useNetwork'
import { useRealms } from './useRealms'
import { useNotification } from '~/composables/useNotification'
import uniSwapV3PoolAbi from '~/abi/uniSwapV3Pool.json'

import { useModal } from '~/composables/useModal'
import contractAddresses from '~/constant/contractAddresses'

import { EncodedIncentiveKey } from '~/composables/encoders/encoders'

const isApproved = ref(false)
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

  const getIncentive = async () => {
    try {
      rewardInfo.value = await getRewardInfo(activeNetwork.value)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  return { getIncentive, rewardInfo }
}

async function getRewardInfo(network) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const uniswapV3Pool = contractAddresses[network.id].uniswapV3Pool
  const poolContract = new ethers.Contract(
    uniswapV3Pool,
    uniSwapV3PoolAbi,
    provider
  )
  const r = await poolContract.getRewardInfo(
    {
      rewardToken: '0x6781dbb93c6bac8b91be1c6e3c99dfd98a7b5b88',
      pool: '0x32daf96f9e40ac7f0e2ccc7bd8f2eac47d3cb985',
      startTime: 1639766563,
      endTime: 1640630563,
      refundee: '0xF3a8b033c2572A2887c507aa92eD134B29620245',
    },
    11645
  )

  return ethers.utils.formatEther(r[0])
}
