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
import { getRealmsQuery } from './graphql/queries'
import { useWeb3Modal } from '~/composables/useWeb3Modal'
import { useGraph } from '~/composables/useGraph'
export enum Layers {
  l1,
  l2,
}
const userRealms = reactive({
  l1: null,
})

export function useRealms() {
  const loading = ref(false)
  const error = reactive({
    getWalletRealms: null,
  })
  const { account } = useWeb3()
  const { gqlRequest } = useGraph()
  const { useL1Network } = useNetwork()
  const { open } = useWeb3Modal()

  const realms = ref()

  const fetchRealms = async (params) => {
    const { wallet, realms, bridgedRealms } = await gqlRequest(
      getRealmsQuery,
      defaultVariables(params),
      'realms'
    )
    return { wallet, realms, bridgedRealms }
  }

  const getRealms = async (params?: null) => {
    try {
      error.getWalletRealms = null
      loading.value = true

      realms.value = await fetchRealms(params)
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const getWalletRealms = async (address?: null) => {
    try {
      error.getWalletRealms = null
      loading.value = true

      const userAddress = address || account.value

      userRealms.l1 = await fetchRealms({ address })
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const defaultVariables = (params?) => {
    console.log(params)
    return {
      address: params?.address?.toLowerCase() || '',
      resources: params?.resources || [],
      orders: params?.orders?.length
        ? params?.orders
        : [
            'Power',
            'Giants',
            'Titans',
            'Skill',
            'Perfection',
            'Brilliance',
            'Enlightenment',
            'Protection',
            'Anger',
            'Rage',
            'Fury',
            'Vitriol',
            'the Fox',
            'Detection',
            'Reflection',
            'the Twins',
          ],
      first: params?.first || 12,
      skip: params?.skip || 0,
      orderBy: params?.orderBy || 'tokenId',
      orderDirection: params?.orderDirection || 'asc',
    }
  }

  return {
    getRealms,
    getWalletRealms,
    error,
    loading,
    userRealms: computed(() => userRealms),
    realms,
  }
}
