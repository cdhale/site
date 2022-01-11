<template>
  <div>
    <div class="flex justify-around">
      <div>&nbsp;</div>
      <h1 class="text-center pb-4">The StarkNet NFT Bazaar</h1>
      <BButton type="settling" class="mb-2 mr-4" @click="showMarketplaceSetup()"
        >Show Marketplace Setup</BButton
      >
    </div>

    <div
      class="
        rounded
        border-4 border-double border-off-200
        sm:w-1/2
        mx-auto
        text-center
        flex
        justify-center
        space-x-4
        font-display
        text-xl
      "
    >
      <div
        class="
          p-4
          border-r-4 border-double border-off-200
          sm:w-1/2
          flex
          justify-center
        "
      >
        Trades: {{ tradeCounter }}
      </div>
      <div class="p-4 sm:w-1/2 flex justify-center">Volume: 10000 $LORDS</div>
    </div>

    <div>
      <div class="flex flex-wrap w-full">
        <div v-for="(realm, i) in realmsWithOpenTrades" :key="i" class="w-80">
          <MarketplaceRealmCard :id="realm" :trades="tradesByRealm(realm)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  computed,
  watch,
} from '@vue/composition-api'
import { useMarketplace } from '~/composables/useMarketplace'
// import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import MarketplaceRealmCard from '~/components/cards/MarketplaceRealmCard.vue'
import { useModal } from '~/composables/useModal'
import MarketplaceSetup from '~/components/modal/MarketplaceSetup.vue'
import { useArgent } from '~/composables/useArgent'

export default defineComponent({
  components: {
    // LoadingRings,
    MarketplaceRealmCard,
  },
  setup() {
    const { showComponent } = useModal()
    const { account } = useArgent()
    const {
      trades,
      getTrade,
      setApproveRealmsForMarketplace,
      setApproveLordsForMarketplace,
      isApproved,
      loading,
      getTradeCounter,
      tradeCounter,
      lordsAllowances,
    } = useMarketplace()
    onMounted(async () => {
      await fetchMarketplaceData()
    })

    const fetchMarketplaceData = async () => {
      if (account.value.length) {
        console.log(account.value)
        console.log('getting market data')
        await getTradeCounter()
        trades.value = []
        for (
          let tradeIdx = parseInt(tradeCounter.value);
          tradeIdx > 0;
          tradeIdx--
        ) {
          getTrade(tradeIdx)
        }
      }
    }
    const showMarketplaceSetup = () => {
      showComponent(MarketplaceSetup)
    }

    const tradesByRealm = (item) => {
      return trades.value.filter((trade) => {
        return trade.item === item
      })
    }
    const realmsWithOpenTrades = computed(() => {
      if (trades.value?.length) {
        return trades.value
          .map((trade) => {
            return trade.item
          })
          .filter((item, index, arr) => {
            return arr.indexOf(item) === index
          })
      }
      return null
    })
    watch(account, () => {
      console.log('fetching logged in user resources')
      if (!trades.value?.length) {
        fetchMarketplaceData()
      }
    })
    return {
      tradesByRealm,
      lordsAllowances,
      showMarketplaceSetup,
      setApproveRealmsForMarketplace,
      realmsWithOpenTrades,
      tradeCounter,
      trades,
      loading,
      isApproved,
      setApproveLordsForMarketplace,
    }
  },
})
</script>
