<template>
  <div class="w-full"></div>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useFetch } from '@nuxtjs/composition-api'
import { useNetwork } from '~/composables/useNetwork'
import { useAdventurer } from '~/composables/useAdventurer'
import { useConnect } from '~/composables/useConnect'

// import { useWeb3Modal } from '~/composables/useWeb3Modal'
export default defineComponent({
  fetchOnServer: false,
  setup(props, context) {
    const { address } = context.root.$route.params
    const { adventurer, loading: loadingSRealms } = useAdventurer()
    const { isAddressPage } = useConnect()

    const { activeNetworkId } = useNetwork()
    // const { open } = useWeb3Modal()

    const sRealms = computed(() => {
      return adventurer.l2?.srealms || []
    })

    useFetch(async () => {})

    const popFromArray = (value) => {
      const index = adventurer.l2.srealms.map((e) => e.id).indexOf(value)
      adventurer.l2.srealms.splice(index, 1)
    }

    return {
      adventurer,
      address,
      activeNetworkId,
      popFromArray,

      sRealms,
      loadingSRealms,
      isAddressPage,
    }
  },
})
</script>
