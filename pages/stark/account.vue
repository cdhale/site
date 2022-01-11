<template>
  <div>
    <h1 class="border-b-4 pb-4 border-double border-off-200">
      Sir, Your StarkNet Account
    </h1>

    <h2 class="mt-4">Your Realms ({{ numberOfRealms }})</h2>
    <div class="flex flex-wrap w-full">
      <div v-for="realm in starkRealms" :key="realm.id" class="w-80">
        <MarketplaceRealmCard :id="realm.low.toString()" type="sell" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import { useMarketplace } from '~/composables/useMarketplace'
import { useStarknet } from '~/composables/useStarknet'
// import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import { useStarkTransactions } from '~/composables/useStarkTransactions'

export default defineComponent({
  // components: {
  //   LoadingRings,
  // },
  setup() {
    const {
      getLordsTotalSupply,
      getLordsBalance,
      starkLordsBalance,
      lordsSupply,
      mintToken,
      mintRealm,
      getOwnersTokens,
      numberOfRealms,
      getRealmsBalance,
      starkRealms,
    } = useStarknet()

    const { setApproveLordsForRealms, lordsAllowances } = useMarketplace()

    const { transactions } = useStarkTransactions()
    onMounted(async () => {
      await getOwnersTokens()
    })
    const random = (max) => {
      return Math.floor(Math.random() * max)
    }

    const mintRealms = async () => {
      const id = random(8000)
      await mintRealm(id)
    }

    const fetchLordsBalance = () => {
      getOwnersTokens()
      getRealmsBalance()
      getLordsBalance()
      getLordsTotalSupply()
    }

    return {
      transactions,
      mintRealms,
      lordsAllowances,
      setApproveLordsForRealms,
      lordsSupply,
      starkLordsBalance,
      starkRealms,
      mintToken,
      numberOfRealms,
      fetchLordsBalance,
      getOwnersTokens,
    }
  },
})
</script>
