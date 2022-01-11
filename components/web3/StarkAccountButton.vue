<template>
  <div class="hidden sm:flex justify-end px-4 py-4">
    <div v-if="active" class="flex w-full">
      <div class="px-4 self-center mr-auto">
        <NuxtLink
          :class="
            type === 'settling'
              ? 'border-off-200 text-off-200'
              : 'border-off-200 text-off-200'
          "
          :to="'/stark/account'"
          class="w-full items-center flex font-display"
        >
          <Helm class="w-10 h-10 stroke-current fill-current self-center" /> My
          StarkNet Account
        </NuxtLink>
      </div>
      <div class="flex">
        <StarkTransactions class="mr-4" />
        <BButton
          v-if="!show"
          type="button"
          class="
            border-double border-4
            rounded
            pl-3
            py-2
            px-10
            mr-4
            text-center
            hover:bg-off-200 hover:text-off-100
          "
          :class="
            type === 'settling'
              ? 'border-off-100 bg-off-200 text-off-100'
              : 'border-off-200 text-off-200'
          "
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          @click="show = !show"
        >
          <span class="flex">
            <StarkNet class="mr-2" />
            {{ shortenHash(account[0]) }}
          </span>
        </BButton>
        <BButton
          v-else
          type="button"
          class="
            border
            rounded
            pl-3
            py-2
            px-10
            text-center
            hover:bg-gray-800
            mr-4
          "
          :class="
            type === 'settling'
              ? 'border-off-200 bg-off-200'
              : 'border-black bg-black'
          "
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span> disconnect? </span>
        </BButton>
      </div>
    </div>

    <BButton
      v-else
      :type="type === 'settling' ? 'settling' : 'primary'"
      @click="activateStarknet"
    >
      Connect to StarkNet
    </BButton>
    <StarkWallet v-if="active" />
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import StarkTransactions from './StarkTransactions.vue'
import { useFormatting } from '~/composables/useFormatting'
import Helm from '~/assets/img/helm.svg?inline'
import { useArgent } from '~/composables/useArgent'
import StarkNet from '~/assets/icons/starknet.svg?inline'
import { useStarknet } from '~/composables/useStarknet'
import { useMarketplace } from '~/composables/useMarketplace'

export default defineComponent({
  components: {
    Helm,
    StarkNet,
    StarkTransactions,
  },
  props: {
    type: {
      default: null,
      type: String,
    },
  },
  setup() {
    const { account, active, activate, deactivate, starknet } = useArgent()
    const { getApprovals } = useMarketplace()

    const { shortenHash } = useFormatting()
    const show = ref(false)
    const {
      getLordsTotalSupply,
      getLordsBalance,
      getOwnersTokens,
      getRealmsBalance,
    } = useStarknet()

    const hide = () => {
      show.value = false
    }
    const activateStarknet = async () => {
      await activate()
      fetchLordsBalance()
    }
    const fetchLordsBalance = () => {
      getOwnersTokens()
      getRealmsBalance()
      getLordsBalance()
      getLordsTotalSupply()
      getApprovals()
    }
    return {
      show,
      hide,
      account,
      activateStarknet,
      starknet,
      deactivate,
      active,
      /* deactivate, */
      shortenHash,
    }
  },
})
</script>
