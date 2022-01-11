<template>
  <BaseCard
    v-if="displayedRealm && displayedRealm.traits"
    class="hover:bg-off-200 hover:border-black"
  >
    <div v-if="order(displayedRealm.traits)" class="flex text-center p-1">
      <OrderChip
        class="w-full rounded-lg"
        :order="order(displayedRealm.traits).value"
      />
    </div>
    <div class="relative px-1">
      <img
        v-if="displayedRealm.image_url"
        class="
          rounded-xl
          w-full
          border-4 border-off-200 border-double
          bg-off-100 bg-blend-screen
        "
        :src="displayedRealm.image_url"
      />
      <div
        v-else
        class="
          bg-gray-100
          text-black
          p-2
          rounded
          flex
          self-center
          h-48
          w-full
          justify-between
        "
      >
        no image yet
      </div>
      <RealmRarity
        class="absolute top-10 right-10"
        :traits="displayedRealm.traits"
      />
    </div>
    <div class="px-4 pt-4">
      <div
        v-if="wonder(displayedRealm.traits)"
        class="
          text-center text-white
          bg-gradient-to-r
          from-purple-200
          via-pink-200
          to-red-300
          text-red-500
          rounded
          py-1
          mb-2
        "
      >
        {{ wonder(displayedRealm.traits).value }}
      </div>
      <div class="flex justify-between">
        <h2>{{ displayedRealm.name }}</h2>
        <h3>#{{ id }}</h3>
      </div>
    </div>
    <div class="px-4 flex flex-wrap text-xs">
      <ResourceChip
        v-for="(resource, index) in resources(displayedRealm.traits)"
        :key="index"
        class="mr-2 my-1"
        :resource="resource"
      />
    </div>
    <div v-if="type === 'sell'" class="px-4">
      <h6 class="text-off-200 group-hover:text-off-100">
        Realm sales: {{ displayedRealm.num_sales }}
      </h6>
      <h6 v-if="displayedRealm.last_sale" class="text-off-200">
        Last sale price:
        {{ intRoundFloor(displayedRealm.last_sale.total_price) / 10 ** 18 }} ETH
      </h6>
    </div>

    <div v-else-if="trades.length" class="px-4">
      <!-- <p>Seller: {{ shortenHash(tradesSortedByPrice[0].poster) }}</p> -->
      <p class="text-xl">{{ tradesSortedByPrice[0].price }} $LORDS</p>
    </div>

    <div class="p-4">
      <div v-if="type === 'sell'" class="mt-auto">
        <div v-if="realmHasOpenTrade" class="mt-auto">
          <p class="text-lg mb-2">Listed For: {{ tradePrice || 0 }} $LORDS</p>
          <BButton
            :loading="loadingMarket.trade"
            class="w-full"
            type="primary"
            @click="editRealmTrade()"
          >
            <span>Edit Listing</span>
          </BButton>
        </div>
        <div v-else class="mt-auto">
          <input
            id="mintId"
            v-model="sellPrice"
            min="1"
            class="
              text-center
              appearance-none
              rounded-md
              shadow-sm
              text-white
              mb-1
              leading-tight
              focus:ring-primary focus:border-primary
              w-full
              px-4
              py-4
              text-lg
              transition-all
              duration-150
              font-semibold
              tracking-wide
              bg-gray-900
            "
            type="number"
            label="Sale Price in LORDS"
            placeholder="Sale Price in $LORDS"
          />
          <BButton
            :loading="loadingMarket.trade"
            class="w-full"
            type="primary"
            @click="sellRealm()"
          >
            <span>Sell Realm</span>
          </BButton>
        </div>
      </div>
      <div v-else>
        <BButton
          :loading="loadingMarket.trade"
          class="w-full"
          type="primary"
          @click="buyRealm(tradesSortedByPrice[0].id)"
        >
          <span>Buy Realm</span>
        </BButton>
      </div>
    </div>
  </BaseCard>
</template>
<script>
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
import axios from 'axios'
import MarketplacePurchase from '../modal/MarketplacePurchase.vue'
import MarketplaceSale from '../modal/MarketplaceSale.vue'
import { useFormatting } from '~/composables/useFormatting'
import { useBigNumber } from '~/composables/useBigNumber'
import { useMarketplace } from '~/composables/useMarketplace'
import { useModal } from '~/composables/useModal'
export default defineComponent({
  props: {
    realm: {
      type: Object,
      required: false,
      default: null,
    },
    id: {
      type: [Object, String],
      required: true,
    },
    stake: {
      type: Boolean,
      required: false,
      default: false,
    },
    type: {
      type: String,
      default: 'buy',
    },
    trades: {
      type: Array,
      default: null,
    },
  },
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { intRoundFloor } = useBigNumber()
    const {
      openTrade,
      loading: loadingMarket,
      getTradeByToken,
      tokenTrades,
    } = useMarketplace()
    const { showComponent } = useModal()
    const tradeSetup = ref()
    const sellPrice = ref()
    const realmResponse = ref()
    const navigate = () => {
      window.open(
        'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          props.id,
        '_blank'
      )
    }
    const displayedRealm = computed(() => {
      return props.realm || realmResponse.value
    })
    const buyRealm = () => {
      showComponent(MarketplacePurchase, {
        id: props.id,
        realm: displayedRealm.value,
        trades: props.trades,
      })
    }
    const sellRealm = () => {
      showComponent(MarketplaceSale, {
        sellPrice: sellPrice.value,
        realm: displayedRealm.value,
        trades: props.trades,
      })
    }
    const editRealmTrade = () => {
      showComponent(MarketplaceSale, {
        type: 'edit',
        realm: displayedRealm.value,
        trade: tokenTrades.value[props.id],
      })
    }

    onMounted(async () => {
      // Not sure why this has to be await and first .. but doesnt work otherwise
      await getTradeByToken(props.id)

      if (!props.realm) {
        try {
          const { data } = await axios.get(
            'https://api.opensea.io/api/v1/asset/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
              props.id +
              '/?force_update=true'
          )
          realmResponse.value = data
        } catch (e) {
          console.log('OpenSea result not found')
        }
      }
    })
    const resources = (traits) => {
      return traits?.filter((resource) => resource.trait_type === 'Resource')
    }
    const wonder = (traits) => {
      return traits?.find(
        (resource) => resource.trait_type === 'Wonder (translated)'
      )
    }
    const order = (traits) => {
      return traits?.find((resource) => resource.trait_type === 'Order')
    }

    const realmHasOpenTrade = computed(() => {
      return (
        tokenTrades.value[props.id] && tokenTrades.value[props.id]?.id !== '0'
      )
    })
    const tradePrice = computed(() => {
      return tokenTrades.value[props.id].price
    })

    const tradesSortedByPrice = computed(() => {
      const tradesSorted = props.trades
      return tradesSorted?.sort(function (a, b) {
        return parseInt(a.price - b.price)
      })
    })
    return {
      tokenTrades,
      realmHasOpenTrade,
      editRealmTrade,
      tradesSortedByPrice,
      openTrade,
      sellRealm,
      buyRealm,
      sellPrice,
      tradePrice,
      tradeSetup,
      displayedRealm,
      realmResponse,
      shortenHash,
      navigate,
      resources,
      wonder,
      order,
      intRoundFloor,
      loadingMarket,
    }
  },
})
</script>
