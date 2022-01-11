<template>
  <div
    class="
      inline-block
      w-128
      max-w-sm
      px-2
      py-6
      overflow-hidden
      text-left
      align-bottom
      transition-all
      transform
      bg-off-200
      rounded-lg
      text-xl
      shadow-xl
      dark:bg-dark-400
      text-off-100
      sm:my-8 sm:align-middle sm:p-6
      border-double border-4 border-off-100
    "
  >
    <h1 class="text-center">List Realm</h1>
    <div class="flex mb-6">
      <img
        v-if="realm.image_url"
        class="
          rounded-xl
          h-32
          w-32
          mr-2
          border-4 border-off-200 border-double
          bg-off-100 bg-blend-screen
        "
        :src="realm.image_url"
      />
      <div class="flex flex-col">
        <span>#{{ realm.token_id }}</span>
        <span>{{ realm.name }}</span>
        <RealmRarity class="mb-2" :traits="realm.traits" />
      </div>
    </div>
    <div v-if="type == 'edit'">
      Update Price:
      <input
        id="mintId"
        v-model="editTradePrice"
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
      ${{ (editTradePrice * lordsPrice).toFixed(2) }}
      <BButton
        :disabled="editTradePrice == trade.price || editTradePrice == ''"
        type="settling"
        class="mb-4 w-full"
        @click="updateTrade(trade.id, editTradePrice)"
        >Update Trade
      </BButton>
      <BButton
        type="settling"
        class="mb-2 w-full"
        @click="cancelTrade(trade.id)"
        >Cancel Listing
      </BButton>
    </div>
    <div v-else>
      <div class="flex justify-between mb-4">
        <span class="font-bold">List Price:</span>
        <div class="flex flex-col text-right">
          <span>{{ sellPrice }} $LORDS</span>
          <span class="text-sm"
            >${{ (sellPrice * lordsPrice).toFixed(2) }}
          </span>
        </div>
      </div>

      <BButton
        v-if="!isNFTApproved.realms"
        :loading="loading.approve"
        type="settling"
        class="mb-2 w-full"
        @click="setApproveRealmsForMarketplace()"
        >Approve Realms For Trade
      </BButton>
      <BButton
        :loading="loadingStark.mint"
        type="settling"
        class="mb-2 w-full"
        :disabled="!realmOwner || !isNFTApproved.realms"
        @click="openTrade(realm.token_id, sellPrice)"
      >
        Confirm Listing</BButton
      >
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  /* reactive, */
  onMounted,
} from '@vue/composition-api'
import { useLordsPrice } from '~/composables'
import { useFormatting } from '~/composables/useFormatting'
import { useMarketplace } from '~/composables/useMarketplace'
import { useStarknet } from '~/composables/useStarknet'
// import LoadingRings from '~/assets/img/loadingRings.svg?inline'
export default defineComponent({
  components: {
    // LoadingRings,
  },
  props: {
    sellPrice: {
      type: String,
      default: null,
    },
    realm: {
      type: Object,
      required: false,
      default: null,
    },
    trade: {
      type: Array,
      default: null,
    },
    type: {
      type: String,
      required: false,
      default: null,
    },
  },

  setup(props) {
    const {
      setApproveRealmsForMarketplace,
      getApprovals,
      isNFTApproved,
      loading,
      openTrade,
      updateTrade,
      cancelTrade,
    } = useMarketplace()
    const { lordsPrice } = useLordsPrice()
    const { shortenHash } = useFormatting()
    const {
      getLordsBalance,
      starkLordsBalance,
      mintToken,
      mintRealm,
      getRealmOwner,
      loading: loadingStark,
    } = useStarknet()
    const realmOwner = ref()
    const editTradePrice = ref()

    if (props.trade) {
      editTradePrice.value = props.trade.price
    }

    onMounted(async () => {
      if (!isNFTApproved.realms) {
        await getApprovals()
      }
      realmOwner.value = await getRealmOwner(props.id)
    })
    return {
      setApproveRealmsForMarketplace,
      openTrade,
      updateTrade,
      cancelTrade,
      isNFTApproved,
      realmOwner,
      loading,
      getLordsBalance,
      starkLordsBalance,
      mintToken,
      mintRealm,
      lordsPrice,
      loadingStark,
      shortenHash,
      editTradePrice,
    }
  },
})
</script>
