import { onMounted, ref, watch } from '@nuxtjs/composition-api'
import { useArgent } from './useArgent'

export function useStarkConnect() {
  const { activate, active, account } = useArgent()
  const tried = ref(false)

  onMounted(async () => {
    if (!active.value) {
      await activate().catch(() => {
        tried.value = true
      })
    } else {
      tried.value = true
    }
  })

  // if the connection worked, wait until we get confirmation of that to flip the flag
  watch([tried, active], () => {
    if (!tried.value && active.value) {
      tried.value = true
    }
  })

  return {
    tried,
  }
}
