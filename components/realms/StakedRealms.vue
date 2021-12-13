<template>
  <div class="container">
    <div>
      <h2>Staked Realms ({{ bridgedRealms }})</h2>
    </div>
    <InfiniteScroll
      v-if="!realmsLoading"
      class="flex flex-wrap w-full"
      :content-change-key="metaData.length"
      @fetchNextBlock="fetchMoreRealms"
    >
      <div v-for="realm in metaData" :key="realm.id" class="w-80">
        <RealmCard :id="realm.token_id" :realm="realm" />
      </div>
      <template v-if="realmsLoading">
        <Loader
          v-for="(loader, index) in 4"
          :key="'dummy' + index"
          class="mr-3 mb-3"
        />
      </template>
    </InfiniteScroll>
    <div v-else>
      <Loader />
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
import axios from 'axios'
import { useRealms } from '~/composables/useRealms'
import { useNetwork } from '~/composables/useNetwork'
export default defineComponent({
  setup(props, context) {
    const { address } = context.root.$route.params
    const { getWalletRealms, userRealms, loading: realmsLoading } = useRealms()
    const { activeNetworkId } = useNetwork()
    const loading = ref(false)
    const metaData = ref([])
    const start = ref(0)
    onMounted(async () => {
      try {
        await getWalletRealms(address, 'l1')
      } catch (e) {
        console.log(e)
      } finally {
        if (userRealms.value.l1?.bridgedRealms?.length) {
          const response = await getOSData(
            userRealms.value.l1.bridgedRealms.slice(
              start.value,
              start.value + 21
            )
          )
          metaData.value = response.data.assets
        }
      }
    })
    const fetchMoreRealms = async () => {
      loading.value = true
      if (start.value + 30 > userRealms.value.l1.wallet.bridgedRealmsHeld) {
        return
      }
      start.value = start.value + 30
      try {
        const realms = userRealms.value.l1.bridgedRealms.slice(
          start.value,
          start.value + 30
        )
        const response = await getOSData(realms)
        const newRealms = response.data.assets
        metaData.value = metaData.value.concat(newRealms)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }
    const bridgedRealms = computed(() => {
      return userRealms.value.l1?.wallet.bridgedRealmsHeld
    })
    const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&'

    const getOSData = async (ids) => {
      const mapped = ids
        .map((bag) => {
          return 'token_ids=' + bag.id + '&'
        })
        .join('')
        .slice(0, -1)

      return await axios.get(baseAssetAddress + mapped, {
        headers: {
          'X-API-KEY': process.env.OPENSEA,
        },
      })
    }

    return {
      userRealms,
      start,
      fetchMoreRealms,
      bridgedRealms,
      activeNetworkId,
      realmsLoading,
      metaData,
    }
  },
})
</script>
