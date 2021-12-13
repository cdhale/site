<template>
  <div>
    <div class="flex">
      <nav class="space-x-4 mb-8 px-2 py-3 rounded-2xl">
        <BButton
          v-for="(link, index) in menuLinks"
          :key="index"
          class="
            px-6
            py-2
            font-display
            border-4 border-double
            tracking-wide
            uppercase
            hover:border-black hover:bg-off-200 hover:text-off-100
          "
          :class="[
            activeTab === link.slug
              ? ' bg-off-200 text-off-100 border-black'
              : ' border-transparent text-off-200 border-off-200',
          ]"
          @click.native="currentTab(link.slug)"
          >{{ link.title }}</BButton
        >
      </nav>
    </div>
    <StakedRealms v-if="activeTab === 'srealms'" type="user" />
    <Settling v-else />
  </div>
</template>
<script>
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { useConnect } from '~/composables/useConnect'
import { useRealms } from '~/composables/useRealms'
export default defineComponent({
  setup() {
    const { account } = useWeb3()
    const { isAddressPage } = useConnect()
    const { getWalletRealms, userRealms } = useRealms()

    const menuLinks = ref([
      {
        title: 'Staked Realms',
        slug: 'srealms',
      },
      {
        title: 'Unstaked Realms',
        slug: 'realms',
      },
    ])
    const activeTab = ref('srealms')
    const currentTab = (tab) => {
      activeTab.value = tab
    }
    useFetch(async () => {
      if (account.value) {
        await getWalletRealms()
      }
    })
    return {
      menuLinks,
      currentTab,
      activeTab,
      userRealms,
      isAddressPage,
    }
  },
})
</script>
