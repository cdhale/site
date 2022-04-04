<template>
  <div class="w-full border-2 border-off-200 my-2 border-double">
    <div
      class="
        text-2xl
        px-4
        py-3
        font-display font-semibold
        flex
        justify-between
        bg-off-100
        cursor-pointer
        hover:bg-off-200 hover:text-off-100
        duration-200
        transition
      "
      :class="{ ' hover:text-off-200 hover:bg-off-100': open }"
      @click="open = !open"
    >
      <slot name="header" />
      <button class="hover:text-black">
        {{ open ? 'close' : 'open' }}
      </button>
    </div>
    <div v-if="open" class="p-4 text-2xl bg-off-200 text-off-100">
      <slot name="body" />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup () {
    const open = ref(false)
    return {
      open
    }
  }
})
</script>
