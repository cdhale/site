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
    <h1 class="text-center">Sell Realm</h1>
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
        <span>#{{ id }}</span>
        <span>{{ realm.name }}</span>
        <RealmRarity class="mb-2" :traits="realm.traits" />
        <p class="flex">
          Seller:
          <span v-if="!loadingStark.realmOwner">{{
            shortenHash(realmOwner)
          }}</span>
          <span v-else><LoadingRings class="w-8 h-8" /></span>
        </p>
      </div>
    </div>
    <div class="flex justify-between mb-4">
      <span class="font-bold">Total:</span>
      <div class="flex flex-col text-right">
        <span>{{ trades[0].price }} $LORDS</span>
        <span class="text-sm"
          >${{ (trades[0].price * lordsPrice).toFixed(2) }}
        </span>
      </div>
    </div>
    <BButton
      v-if="!enoughBalance"
      :loading="loadingStark.mint"
      type="settling"
      class="mb-2 w-full"
      @click="mintToken('100')"
    >
      >Get 100 Lords</BButton
    >
    <BButton
      v-if="lordsAllowances.marketplace < trades[0].price"
      :loading="loading.approve"
      type="settling"
      class="mb-2 w-full"
      @click="setApproveLordsForMarketplace()"
      >Set Lords Approval For Trade
    </BButton>
    <BButton
      :loading="loadingStark.mint"
      type="settling"
      class="mb-2 w-full"
      :disabled="
        !enoughBalance ||
        !realmOwner ||
        lordsAllowances.marketplace < trades[0].price
      "
      @click="executeTrade(id)"
    >
      Confirm Purchase</BButton
    >
    <!-- <BButton
      :loading="loadingStark.mint"
      type="settling"
      class="mb-2 mr-4"
      @click="mintToken('100')"
      >Get 100 Lords</BButton
    >
    <BButton
      v-if="!lordsAllowances.realms"
      :loading="loading.approve"
      type="settling"
      class="mb-2 mr-4"
      @click="setApproveLordsForRealms()"
      >Set Approval Realms to Spend Lords</BButton
    >
    <BButton
      v-if="!isNFTApproved.realms"
      :loading="loading.approve"
      type="settling"
      class="mb-2 mr-4"
      @click="setApproveRealmsForMarketplace()"
      >Set Realms Approval For Trade</BButton
    >
    <BButton
      v-if="!lordsAllowances.marketplace"
      :loading="loading.approve"
      type="settling"
      class="mb-2 mr-4"
      @click="setApproveLordsForMarketplace()"
      >Set Lords Approval For Trade
    </BButton>
    <BButton
      :loading="loadingStark.mint"
      type="settling"
      class="mb-2 mr-4"
      @click="mintRealm()"
      >Mint Realm</BButton
    >-->
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  ref,
  /* reactive, */
  onMounted,
} from '@vue/composition-api'
import { useLordsPrice } from '~/composables'
import { useFormatting } from '~/composables/useFormatting'
import { useMarketplace } from '~/composables/useMarketplace'
import { useStarknet } from '~/composables/useStarknet'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
export default defineComponent({
  components: {
    LoadingRings,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    realm: {
      type: Object,
      required: false,
      default: null,
    },
    trades: {
      type: Array,
      default: null,
    },
  },

  setup(props) {
    const {
      setApproveRealmsForMarketplace,
      setApproveLordsForMarketplace,
      setApproveLordsForRealms,
      getApprovals,
      isNFTApproved,
      loading,
      lordsAllowances,
      executeTrade,
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
    const enoughBalance = computed(() => {
      return starkLordsBalance >= props.trades[0].price
    })
    onMounted(async () => {
      await getApprovals()
      realmOwner.value = await getRealmOwner(props.id)
    })
    return {
      enoughBalance,
      setApproveRealmsForMarketplace,
      setApproveLordsForMarketplace,
      isNFTApproved,
      realmOwner,
      loading,
      lordsAllowances,
      getLordsBalance,
      starkLordsBalance,
      mintToken,
      mintRealm,
      setApproveLordsForRealms,
      lordsPrice,
      loadingStark,
      executeTrade,
      shortenHash,
    }
  },
})
</script>
