/* eslint-disable max-depth */
import { computed, reactive, ref } from '@nuxtjs/composition-api'
import { getl1Adventurer, getl2Adventurer } from './graphql/queries'
import { useNetwork } from '~/composables/useNetwork'
import { useWeb3Modal } from '~/composables/useWeb3Modal'
import { useGraph } from '~/composables/useGraph'
export enum Layers {
  l1,
  l2,
}

export function useAdventurer() {
  const loading = ref(false)
  const error = reactive({
    getAdventurer: null,
  })
  const { gqlRequest } = useGraph()
  const { useL1Network } = useNetwork()
  const adventurer = reactive({
    l1: null,
    l2: null,
  })
  const fetchAdventurer = async (address, layer) => {
    const { wallet } = await gqlRequest(
      getl1Adventurer,
      { address },
      useL1Network.value.id
    )
    adventurer.l1 = wallet
  }

  const getAdventurer = async (account?, layer?: Layers) => {
    try {
      error.getAdventurer = null
      loading.value = true
      const address = account.toLowerCase()
      if (!layer) {
        Promise.all([
          await fetchAdventurer(address, 'l1'),
          await fetchAdventurer(address, 'l2'),
        ])
      } else {
        await fetchAdventurer(address, layer)
      }
    } catch (e) {
      error.getAdventurer = e
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  return {
    getAdventurer,
    adventurer: computed(() => adventurer),
    error,
    loading,
  }
}
