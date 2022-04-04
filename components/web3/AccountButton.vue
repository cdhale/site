<template>
  <div class="hidden sm:flex justify-end px-4 py-4">
    <div v-if="active" v-click-outside="hide" class="flex w-full">
      <div class="px-4 self-center mr-auto">
        <NuxtLink
          :class="
            type === 'settling'
              ? 'border-off-200 text-off-200'
              : 'border-off-200 text-off-200'
          "
          :to="'/adventurer/' + account"
          class="w-full items-center flex font-display"
        >
          <Helm class="w-10 h-10 stroke-current fill-current self-center" /> My
          Adventure
        </NuxtLink>
      </div>
      <NetworkSwitcher v-if="type != 'settling'" />
      <BButton
        v-if="!show"
        type="button"
        class="
          border-double border-4
          rounded
          pl-3
          py-2
          px-10
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
        <span>
          {{ shortenHash(account) }}
        </span>
      </BButton>
      <BButton
        v-else
        type="button"
        class="border rounded pl-3 py-2 px-10 text-center hover:bg-gray-800"
        :class="
          type === 'settling'
            ? 'border-off-200 bg-off-200'
            : 'border-black bg-black'
        "
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="deactivate"
      >
        <span> disconnect? </span>
      </BButton>
    </div>
    <BButton
      v-else
      :type="type === 'settling' ? 'settling' : 'primary'"
      @click="open"
    >
      Connect to the LootVerse
    </BButton>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { useFormatting } from '~/composables/useFormatting'
import Helm from '~/assets/img/helm.svg?inline'
import { useWeb3Modal } from '~/composables/useWeb3Modal'
export default defineComponent({
  components: {
    Helm
  },
  props: {
    type: {
      default: null,
      type: String
    }
  },
  setup () {
    const { account, active, deactivate } = useWeb3()
    const { shortenHash } = useFormatting()
    const { open } = useWeb3Modal()
    const show = ref(false)

    const hide = () => {
      show.value = false
    }

    return {
      hide,
      show,
      account,
      open,
      active,
      deactivate,
      shortenHash
    }
  }
})
</script>
