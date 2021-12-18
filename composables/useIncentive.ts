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
  console.log(uniSwapV3PoolAbi)
  const r = await poolContract.getRewardInfo(EncodedIncentiveKey, 11587)
  console.log(r)
  return await poolContract.getRewardInfo(EncodedIncentiveKey, 11587)
}
