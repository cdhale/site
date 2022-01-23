<template>
  <div>
    <div>
      <h2>Staked Realms ({{ bridgedRealms || 0 }})</h2>
    </div>
    <FilteredRealms type="staked" />
  </div>
</template>
<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useRealms } from '~/composables/useRealms'
export default defineComponent({
  setup() {
    const { userRealms } = useRealms()

    const bridgedRealms = computed(() => {
      return userRealms.value.l1?.wallet?.bridgedRealmsHeld
    })

    return {
      bridgedRealms,
    }
  },
})
</script>
