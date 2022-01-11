import Vue from 'vue'
import VueCompositionAPI, { reactive, computed } from '@vue/composition-api'

// We need to register it again because of Vue instance instantiation issues
Vue.use(VueCompositionAPI)

const state = reactive({
  sideBarOpen: false,
  walletSideBarOpen: false,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useUiState = () => {
  const sideBarOpen = computed(() => state.sideBarOpen)
  const toggleSideBar = () => {
    state.sideBarOpen = !state.sideBarOpen
  }

  const walletSideBarOpen = computed(() => state.walletSideBarOpen)
  const toggleWalletSideBar = () => {
    state.walletSideBarOpen = !state.walletSideBarOpen
  }

  return {
    sideBarOpen,
    toggleSideBar,
    walletSideBarOpen,
    toggleWalletSideBar,
  }
}

export default useUiState
