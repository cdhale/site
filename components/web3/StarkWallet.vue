<template>
  <BButton
    class="
      border-double border-4
      rounded
      py-2
      px-2
      text-center
      hover:bg-off-200 hover:text-off-100
      border-off-200
      text-off-200
    "
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-labelledby="listbox-label"
    @click="toggleWalletSideBar()"
  >
    <MoneyBag class="w-6 h-6 stroke-current fill-current self-center" />
  </BButton>
</template>
<script>
import MoneyBag from '~/assets/img/money-bag.svg?inline'
import { useUiState } from '~/composables'
export default {
  components: {
    MoneyBag,
  },
  setup() {
    const { toggleWalletSideBar } = useUiState()

    return {
      toggleWalletSideBar,
    }
  },
}
</script>
