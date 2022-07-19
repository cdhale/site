<template>
  <div class="justify-end hidden px-4 py-4 sm:flex">
    <div v-if="active" v-click-outside="hide" class="flex w-full">
      <!--<NuxtLink
          :class="
            type === 'settling'
              ? 'border-off-200 text-off-200'
              : 'border-off-200 text-off-200'
          "
          :to="'/adventurer/' + account"
          class="flex items-center w-full font-display"
        >
          <Helm class="self-center w-10 h-10 fill-current stroke-current" /> My
          Adventure
        </NuxtLink>
      </div>-->
      <NetworkSwitcher v-if="type != 'settling'" />
      <BButton
        v-if="!show"
        type="button"
        class="px-10 py-2 pl-3 text-center border-4 border-double rounded  hover:bg-off-200 hover:text-off-100"
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
        class="px-10 py-2 pl-3 text-center border rounded hover:bg-gray-800"
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
