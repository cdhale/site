<template>
  <div
    class="
      inline-block
      w-96
      max-w-sm
      px-4
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
    <h1 class="text-center">Marketplace Setup</h1>
    <BButton
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
  </div>
</template>
<script>
import {
  defineComponent,
  /* computed,
  ref,
  reactive, */
} from '@vue/composition-api'
import { useMarketplace } from '~/composables/useMarketplace'
import { useStarknet } from '~/composables/useStarknet'
export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'stake',
    },
  },

  setup(props) {
    const {
      setApproveRealmsForMarketplace,
      setApproveLordsForMarketplace,
      setApproveLordsForRealms,
      isNFTApproved,
      loading,
      lordsAllowances,
    } = useMarketplace()

    const {
      getLordsBalance,
      starkLordsBalance,
      mintToken,
      mintRealm,
      loading: loadingStark,
    } = useStarknet()

    return {
      setApproveRealmsForMarketplace,
      setApproveLordsForMarketplace,
      isNFTApproved,
      loading,
      lordsAllowances,
      getLordsBalance,
      starkLordsBalance,
      mintToken,
      mintRealm,
      setApproveLordsForRealms,
      loadingStark,
    }
  },
})
</script>
