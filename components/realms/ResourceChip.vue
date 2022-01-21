<template>
  <span
    v-if="getResource"
    :class="getResource.colourClass"
    class="
      px-4
      py-1
      rounded-lg
      text-sm
      mb-1
      mr-2
      bg-opacity-75
      shadow-2xl
      border-2 border-double
    "
    >{{ getResource.trait }}
    <slot />
  </span>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { resources } from '@/composables/utils/resourceColours'
export default defineComponent({
  props: {
    resourceId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const getResource = computed(() => {
      return resources.find((c) => c.id === props.resourceId)
    })
    return {
      getResource,
    }
  },
})
</script>
