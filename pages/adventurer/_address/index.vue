<template>
  <section>
    <div v-if="useL1Network.id !== 'mainnet'">
      Assets not available on Testnets
    </div>
    <div v-else-if="!$fetchState.pending && !adventurer.l1">
      No Loot or Derivatives for this adventurer... yet.
    </div>

    <div v-else-if="!$fetchState.pending && adventurer.l1">
      <h4 class="mb-3">Ethereum Assets</h4>
      <div
        class="
          bg-black
          sticky
          top-10
          z-10
          rounded
          px-4
          py-2
          space-x-6
          border-off-200 border-4 border-double
          w-auto
          shadow
        "
      >
        <a
          v-if="adventurer.l1.bagsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#loot"
          >Loot: {{ adventurer.l1.bagsHeld }}
        </a>
        <a
          v-if="adventurer.l1.gAdventurersHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#loot"
          >GAs: {{ adventurer.l1.gAdventurersHeld }}
        </a>
        <a
          v-if="adventurer.l1.realmsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#realms"
          >Realms: {{ adventurer.l1.realmsHeld }}</a
        >
        <a
          v-if="adventurer.l1.bridgedRealmsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#realms"
          >Staked Realms: {{ adventurer.l1.bridgedRealmsHeld }}</a
        >
        <a
          v-if="adventurer.l1.manasHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mana"
          >mana: {{ adventurer.l1.manasHeld }}</a
        >
        <a
          v-if="adventurer.l1.mLootsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mloot"
          >mLoot: {{ adventurer.l1.mLootsHeld }}</a
        >
      </div>

      <div v-if="adventurer.l1.bags.length" id="loot">
        <h3 class="mt-8">Loot: {{ adventurer.l1.bagsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="(loot, index) in adventurer.l1.bags" :key="index">
            <LootCard is-o-g :loot="loot" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.gAdventurers.length" id="loot">
        <h3 class="mt-8">
          Genesis Adventurer: {{ adventurer.l1.gAdventurers.length }}
        </h3>
        <div class="flex flex-wrap w-full">
          <div v-for="(loot, index) in adventurer.l1.gAdventurers" :key="index">
            <GACard :loot="loot" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.realms.length" id="realms">
        <div v-if="realms.l1.realms.length">
          <h3 class="mt-8">Realms: {{ adventurer.l1.realmsHeld }}</h3>
          <div class="flex flex-wrap w-full">
            <div v-for="realm in realms.l1.realms" :key="realm.id">
              <RealmCard :id="realm.token_id" :realm="realm" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-wrap mt-4">
          <Loader v-for="(loader, index) in 4" :key="index" class="mr-3 mb-3" />
        </div>
      </div>
      <div v-if="adventurer.l1.bridgedRealms.length" id="realms">
        <div v-if="realms.l1.bridgedRealms.length">
          <h3 class="mt-8">
            Staked Realms: {{ adventurer.l1.bridgedRealmsHeld }}
          </h3>
          <div class="flex flex-wrap w-full">
            <div v-for="realm in realms.l1.bridgedRealms" :key="realm.id">
              <RealmCard :id="realm.token_id" :realm="realm" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-wrap mt-4">
          <Loader v-for="(loader, index) in 4" :key="index" class="mr-3 mb-3" />
        </div>
      </div>
      <div v-if="adventurer.l1.manas.length" id="mana">
        <hr />
        <h3 class="mt-8">Mana: {{ adventurer.l1.manas.length }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="(mana, index) in adventurer.l1.manas" :key="index">
            <ManaCard :mana="mana" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.mLoot.length" id="mloot">
        <hr />
        <h3 class="mt-8">mLoot: {{ adventurer.l1.mLootsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="loot in adventurer.l1.mLoot" :key="loot.id">
            <LootCard :loot="loot" />
          </div>
        </div>
      </div>
    </div>
    <Loader v-else />
  </section>
</template>

<script>
import {
  defineComponent,
  ref,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'

import { useFormatting } from '~/composables/useFormatting'
import { useAdventurer } from '~/composables/useAdventurer'
import { useNetwork } from '~/composables/useNetwork'
import { useRarity } from '~/composables'
import { useRealms } from '~/composables/useRealms'
export default defineComponent({
  setup(props, context) {
    const { checkRealmRarity } = useRarity()
    const { shortenHash } = useFormatting()
    const { address } = context.root.$route.params
    const { useL1Network } = useNetwork()
    const { getAdventurer, adventurer } = useAdventurer()
    const { getRealms, realms } = useRealms()
    useFetch(async () => {
      await getAdventurer(address, 'l1')
      await getRealms({ address, first: 1000, orderBy: 'rarityRank' })
    })

    const openSeaData = ref([])
    const openSeaBridgedData = ref([])
    const loading = ref()
    const offset = ref(0)

    const rariety = ref(null)

    const lootRariety = (id) => {
      return rariety.value.find((loot) => loot.id.toString() === id)
    }

    const sortedRealms = computed(() => {
      return openSeaData.value
        ? openSeaData.value.sort((a, b) => {
            return checkRealmRarity(b.traits) - checkRealmRarity(a.traits)
          })
        : null
    })
    const sortedBridgedRealms = computed(() => {
      return openSeaBridgedData.value
        ? openSeaBridgedData.value.sort((a, b) => {
            return checkRealmRarity(b.traits) - checkRealmRarity(a.traits)
          })
        : null
    })
    return {
      useL1Network,
      realms,
      openSeaBridgedData,
      sortedBridgedRealms,
      adventurer,
      address,
      shortenHash,
      openSeaData,
      loading,
      rariety,
      lootRariety,
      sortedRealms,
      offset,
    }
  },
})
</script>
