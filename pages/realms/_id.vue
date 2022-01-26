<template>
  <section>
    <div v-if="!$fetchState.pending" class="flex flex-wrap">
      <div class="sm:w-1/2 sm:p-8">
        <a
          class="pb-1"
          :href="
            'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
            openSeaData.token_id
          "
          target="_blank"
          >View Realm on Open Sea</a
        >
        <RealmRarity
          class="mb-8 text-xl"
          :rarity-score="realm.rarityScore"
          :rarity-rank="realm.rarityRank"
        />
        <h3 class="mt-3">
          👑
          <NuxtLink
            class="hover:underline"
            :to="'/adventurer/' + realm.currentOwner.address"
            >{{ shortenHash(realm.currentOwner.address) }}</NuxtLink
          >
        </h3>
        <h1 class="sm:text-6xl">{{ realm.name }} - #{{ realm.id }}</h1>
        <div v-if="realm.order" class="py-4">
          <OrderChip class="text-xl" :order="realm.order" />
        </div>
        <div v-else>
          <span class="bg-gray-800 px-2 py-1 rounded">
            No Order Discovered yet. Check back soon.
          </span>
        </div>
        <div v-if="realm.wonder" class="my-6 bg-black p-4 sm:p-6 rounded-2xl">
          <h2>Realm Wonder</h2>
          <div
            v-if="realm.wonder"
            class="
              px-8
              text-center text-white
              bg-gradient-to-r
              from-purple-200
              via-pink-200
              to-red-300
              text-red-500
              rounded
              py-1
              mb-2
              text-2xl
            "
          >
            {{ realm.wonder }}
          </div>
        </div>

        <div v-if="resources" class="my-6 bg-black p-4 sm:p-6 rounded-2xl">
          <h2>Realm Resources</h2>
          <div class="flex my-2 flex-wrap">
            <ResourceChip
              v-for="(resource, index) in realm.resourceIds"
              :key="index"
              class="mr-2 my-1"
              :resource-id="resource"
            />
          </div>
        </div>
        <div v-if="cities" class="my-6 bg-black p-4 sm:p-6 rounded-2xl">
          <h2>Realm Traits</h2>
          <Levels
            :cities="realm.cities"
            :harbours="realm.harbours"
            :regions="realm.regions"
            :rivers="realm.rivers"
          />
        </div>
        <div class="my-6 bg-black p-4 sm:p-6 rounded-2xl">
          <h2>Realm Sales: {{ openSeaData.num_sales }}</h2>
        </div>
      </div>
      <div class="sm:w-1/2">
        <b-img
          v-if="realm.id"
          class="
            rounded-xl
            w-full
            h-84
            border-4 border-off-200 border-double
            bg-off-100 bg-blend-screen
          "
          :src="
            'https://d23fdhqc1jb9no.cloudfront.net/_Realms/' + realm.id + '.svg'
          "
        />
        <h4 v-else class="my-5">No image yet</h4>
      </div>
    </div>
    <div v-else>
      <Loader />
    </div>
  </section>
</template>
<script>
import {
  computed,
  defineComponent,
  ref,
  useFetch,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { useFormatting } from '~/composables/useFormatting'
import { useRealms } from '~/composables/useRealms'
export default defineComponent({
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { id } = context.root.$route.params
    const adventurer = ref(null)
    const { getRealm, realm } = useRealms()
    useFetch(async () => {
      await getRealm(id.toString())
      const response = await axios.get(
        'https://api.opensea.io/api/v1/asset/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          id +
          '/?force_update=true',
        {
          headers: {
            'X-API-KEY': process.env.OPENSEA,
          },
        }
      )
      openSeaData.value = response.data
    })

    const openSeaData = ref()
    const loading = ref()

    const resources = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.filter(
            (resource) => resource.trait_type === 'Resource'
          )
        : null
    })
    const cities = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Cities'
          )
        : null
    })
    const harbours = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Harbors'
          )
        : null
    })
    const regions = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Regions'
          )
        : null
    })
    const rivers = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Rivers'
          )
        : null
    })
    const wonder = (traits) => {
      return traits.find(
        (resource) => resource.trait_type === 'Wonder (translated)'
      )
    }
    const order = (traits) => {
      return traits.find((resource) => resource.trait_type === 'Order')
    }
    return {
      realm,
      adventurer,
      shortenHash,
      openSeaData,
      loading,
      resources,
      cities,
      harbours,
      regions,
      rivers,
      wonder,
      order,
    }
  },
})
</script>
