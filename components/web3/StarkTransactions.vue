<template>
  <div>
    <BButton
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
        pendingTransactions.length
          ? 'border-off-100 bg-off-200 text-off-100'
          : 'border-off-200 text-off-200'
      "
      @click="showStarknetTransactions()"
      >{{ pendingTransactions.length }} Pending</BButton
    >
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useStarkTransactions } from '~/composables/useStarkTransactions'
import StarknetTransactions from '~/components/modal/StarknetTransactions.vue'
import { useModal } from '~/composables/useModal'

export default defineComponent({
  setup() {
    const { pendingTransactions } = useStarkTransactions()
    const { showComponent } = useModal()

    const showStarknetTransactions = () => {
      showComponent(StarknetTransactions)
    }

    return {
      pendingTransactions,
      showStarknetTransactions,
    }
  },
})
</script>
