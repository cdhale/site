/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  ssrRef,
} from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { buildSRealmsWhere } from './graphql/helpers/search'
import { useNetwork, activeNetwork } from './useNetwork'
import { getRealms } from './graphql/queries'
import { useWeb3Modal } from '~/composables/useWeb3Modal'
import { useGraph } from '~/composables/useGraph'
export enum Layers {
  l1,
  l2,
}
const userRealms = reactive({
  l1: null,
  l2: null,
})

export function useRealms() {
  const loading = ref(false)
  const error = reactive({
    getWalletRealms: null,
  })
  const { account } = useWeb3()
  const { gqlRequest } = useGraph()
  const { useL1Network, useL2Network } = useNetwork()
  const { open } = useWeb3Modal()

  const userSRealms = ref([])
  const sRealms = ref()

  const fetchUserRealms = async (account, layer) => {
    const network = useL1Network.value.id
    const { wallet, realms, bridgedRealms } = await gqlRequest(
      getRealms,
      { address: account.toLowerCase() },
      network
    )
    return { wallet, realms, bridgedRealms }
  }

  const getWalletRealms = async (address?: null, layer?: Layers) => {
    try {
      error.getWalletRealms = null
      loading.value = true

      const userAddress = address || account.value

      userRealms.l1 = await fetchUserRealms(userAddress, 'l1')
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const defaultVariables = (params?) => {
    console.log(params)
    return {
      address: params?.value?.address?.toLowerCase() || '',
      resources: params?.value?.resources || [],
      orders: params?.value?.orders?.length
        ? params?.value?.orders
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      first: params?.value?.first || 12,
      skip: params?.value?.skip || 0,
      orderBy: params?.value?.orderBy || null,
      orderDirection: params?.value?.orderDirection || 'asc',
    }
  }

  return {
    getWalletRealms,
    error,
    loading,
    userRealms: computed(() => userRealms),
    sRealms,
  }
}
