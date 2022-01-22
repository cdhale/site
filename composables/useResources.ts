import { reactive, ref, Ref, computed } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import { useNetwork, activeNetwork } from './useNetwork'
import { getResourceListQuery } from './graphql/queries'
import { useNotification } from '~/composables/useNotification'
// ABI

// ADDRESS CONSTS

import { useGraph } from '~/composables/useGraph'
import { resources } from '~/composables/utils/resourceColours'

const allUsersResources = reactive({ resources, lords: null })
export function useResources() {
  const { provider, library, account, active } = useWeb3()
  const { partnerNetwork, useL1Network } = useNetwork()
  const { gqlRequest } = useGraph()
  const { showError } = useNotification()
  const error = reactive({
    resources: null,
    balances: null,
  })

  const loading = reactive({
    resources: false,
    fetchingResources: false,
    fetchUsersBalance: false,
  })

  const result = reactive({ resources: null })
  const output = ref()
  const resourceList = ref([])

  const getResourceList = async () => {
    try {
      error.resources = null
      // loading.resources = true
      const { resources } = await gqlRequest(
        getResourceListQuery,
        null,
        'realms'
      )
      resourceList.value = resources
    } catch (e) {
      console.log(e)
      await showError(e.message)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const resourceListOrdered = computed(() => {
    return resourceList.value.sort((a, b) => {
      return b.totalRealms - a.totalRealms
    })
  })

  const NumberFormatter = (value, decimal) => {
    return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
      'en-US',
      {
        useGrouping: true,
      }
    )
  }
  return {
    resourceList,
    resourceListOrdered,
    getResourceList,
    error,
    loading,
    result,
    output,
    allUsersResources,
    NumberFormatter,
  }
}
