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
          <div
            v-for="(loot, index) in adventurer.l1.bags"
            :key="index"
            class="w-80"
          >
            <LootCard is-o-g :loot="loot" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.gAdventurers.length" id="loot">
        <h3 class="mt-8">
          Genesis Adventurer: {{ adventurer.l1.gAdventurers.length }}
        </h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(loot, index) in adventurer.l1.gAdventurers"
            :key="index"
            class="w-80"
          >
            <GACard :loot="loot" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.realms.length" id="realms">
        <div v-if="openSeaData.length">
          <h3 class="mt-8">Realms: {{ adventurer.l1.realmsHeld }}</h3>
          <div class="flex flex-wrap w-full">
            <div v-for="realm in sortedRealms" :key="realm.id" class="w-80">
              <RealmCard :id="realm.token_id" :realm="realm" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-wrap mt-4">
          <Loader v-for="(loader, index) in 4" :key="index" class="mr-3 mb-3" />
        </div>
      </div>
      <div v-if="adventurer.l1.bridgedRealms.length" id="realms">
        <div v-if="openSeaBridgedData.length">
          <h3 class="mt-8">
            Staked Realms: {{ adventurer.l1.bridgedRealmsHeld }}
          </h3>
          <div class="flex flex-wrap w-full">
            <div
              v-for="realm in sortedBridgedRealms"
              :key="realm.id"
              class="w-80"
            >
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
          <div
            v-for="(mana, index) in adventurer.l1.manas"
            :key="index"
            class="w-80"
          >
            <ManaCard :mana="mana" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.mLoot.length" id="mloot">
        <hr />
        <h3 class="mt-8">mLoot: {{ adventurer.l1.mLootsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="loot in adventurer.l1.mLoot" :key="loot.id" class="w-80">
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
import axios from 'axios'

import { useFormatting } from '~/composables/useFormatting'
import { useAdventurer } from '~/composables/useAdventurer'
import { useNetwork } from '~/composables/useNetwork'
import { useRarity } from '~/composables'
export default defineComponent({
  setup(props, context) {
    const { checkRealmRarity } = useRarity()
    const { shortenHash } = useFormatting()
    const { address } = context.root.$route.params
    const { useL1Network } = useNetwork()
    const { getAdventurer, adventurer } = useAdventurer()

    useFetch(async () => {
      await getAdventurer(address, 'l1')
      await openSeaFetch()
      console.log(adventurer)
      console.log('here')
      await getOSData(adventurer.value.l1.bridgedRealms.slice(0, 30))
    })

    const openSeaData = ref([])
    const openSeaBridgedData = ref([])
    const loading = ref()
    const offset = ref(0)
    const openSeaFetch = async (off) => {
      loading.value = true
      const numPages = Math.ceil(adventurer.value.l1.realmsHeld / 50)

      for (let page = 0; page < numPages; page++) {
        try {
          const response = await axios.get(
            'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50&owner=' +
              address +
              '&offset=' +
              page * 50,
            {
              headers: {
                'X-API-KEY': process.env.OPENSEA,
              },
            }
          )
          openSeaData.value = openSeaData.value.concat(response.data.assets)
        } catch (e) {
          console.log(e)
        } finally {
          loading.value = false
        }
      }
    }
    const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&'

    const getOSData = async (ids) => {
      const mapped = ids
        .map((bag) => {
          return 'token_ids=' + bag.id + '&'
        })
        .join('')
        .slice(0, -1)

      const response = await axios.get(baseAssetAddress + mapped, {
        headers: {
          'X-API-KEY': process.env.OPENSEA,
        },
      })
      openSeaBridgedData.value = openSeaBridgedData.value.concat(
        response.data.assets
      )
    }
    const realmOpenSea = (id) => {
      return openSeaData.value.find((realm) => realm.token_id === id)
    }

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
      openSeaBridgedData,
      sortedBridgedRealms,
      adventurer,
      address,
      shortenHash,
      openSeaData,
      loading,
      realmOpenSea,
      rariety,
      lootRariety,
      sortedRealms,
      offset,
    }
  },
})
</script>
