<template>
  <div
    class="
      bg-gray-900
      min-h-screen
      flex flex-wrap
      sm:flex-nowrap
      border-4 border-off-200 border-double
    "
  >
    <div class="sm:hidden w-full mt-12 flex justify-between px-10">
      <div>
        <button class="text-xl" @click="toggleSideBar">Menu</button>
      </div>

      <NuxtLink to="/"><Book class="w-12 h-12 mx-auto" /></NuxtLink>
    </div>
    <NotificationBar />
    <SideBar class="fixed sm:relative w-80 min-h-screen" />

    <div class="w-full">
      <!-- <AccountButton /> -->
      <StarkAccountButton />
      <Modal />

      <Nuxt keep-alive class="p-3 sm:p-8" />
    </div>
    <WalletSideBar class="fixed w-80 min-h-screen" />
  </div>
</template>
<script>
import { defineComponent, watch } from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { useUiState } from '~/composables'
import { useConnect } from '~/composables/useConnect'
import Book from '~/assets/img/book-open.svg?inline'
import StarkAccountButton from '~/components/web3/StarkAccountButton.vue'

export default defineComponent({
  components: {
    Book,
    StarkAccountButton,
  },
  fetchOnServer: false,
  setup() {
    const { account } = useWeb3()
    const { toggleSideBar, sideBarOpen } = useUiState()
    useConnect()

    watch(account, () => {
      console.log('fetching logged in user resources')
    })

    return {
      toggleSideBar,
      sideBarOpen,
    }
  },
})
</script>
