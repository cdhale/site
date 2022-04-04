<template>
  <div class="w-full">
    <div>
      <h2>Unstaked Realms ({{ numberRealms || 0 }})</h2>
      <p>
        Stake your realms at
        <nuxt-link
          to="/settling"
          class="font-semibold text-off-200"
        >
          Settling
        </nuxt-link>
      </p>
    </div>
    <FilteredRealms type="user" />
  </div>
</template>
<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useRealms } from '~/composables/useRealms'
export default defineComponent({
  setup (props, context) {
    const { userRealms } = useRealms()

    const numberRealms = computed(() => {
      return userRealms.value.l1?.wallet?.realmsHeld
    })

    return {
      numberRealms
    }
  }
})
</script>
