<template>
  <div class="container">
    <div>
      <h2>Unstaked Realms ({{ numberRealms }})</h2>
      <p>
        Stake your realms at
        <nuxt-link to="/settling" class="font-semibold text-off-200"
          >Settling</nuxt-link
        >
      </p>
    </div>
    <div v-if="!realmsLoading && realms" class="flex flex-wrap">
      <RealmCard
        v-for="realm in realms.l1.realms"
        :id="realm.tokenId"
        :key="realm.id"
        :realm="realm"
        class="w-80"
        @realmSettled="popFromArray"
      />
    </div>
    <div v-else>
      <Loader />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  useFetch,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { useRealms } from '~/composables/useRealms'
import { useNetwork } from '~/composables/useNetwork'
export default defineComponent({
  setup(props, context) {
    const { address } = context.root.$route.params
    const { getRealms, realms, loading: realmsLoading } = useRealms()
    const { activeNetworkId } = useNetwork()

    const metaData = ref()

    const { fetch } = useFetch(async () => {
      await getRealms({ address })
    })

    onMounted(async () => {
      try {
        fetch()
      } catch (e) {
        console.log(e)
      } finally {
        if (realms.value && realms.value.l1?.realms) {
          const realmsData = realms.value.l1.realms.slice(0, 30)
          const response = await getOSData(realmsData)
          metaData.value = response.data.assets
        }
      }
    })
    const numberRealms = computed(() => {
      return realms.value.l1?.wallet?.realmsHeld
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

      console.log(mapped)

      return await axios.get(baseAssetAddress + mapped, {
        headers: {
          'X-API-KEY': process.env.OPENSEA,
        },
      })
    }

    const popFromArray = (value) => {
      const index = metaData.value.map((e) => e.token_id).indexOf(value)
      metaData.value.splice(index, 1)
    }

    return {
      realms,
      activeNetworkId,
      realmsLoading,
      metaData,
      popFromArray,
      numberRealms,
    }
  },
})
</script>
