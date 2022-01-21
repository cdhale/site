<template>
  <section>
    <div>
      <Filters
        class="fixed w-80 min-h-screen"
        :filters-open="filtersOpen"
        :type="type"
        :resources="resourcesFilter"
        :orders="ordersFilter"
        @toggleFilter="
          (value) => {
            return (filtersOpen = !filtersOpen)
          }
        "
        @searchFilter="filterEmit"
      />
      <!-- <form class="flex sm:w-1/3" method="POST" @submit.prevent="submitSearch">
        <input
          v-model="search"
          placeholder="insert realm id"
          class="bg-black rounded-2xl px-4 py-2 text-xl w-2/3"
          type="text"
        />
        <BButton class="ml-3" type="primary">find realm</BButton>
      </form> -->

      <div class="flex flex-wrap sm:space-x-3 my-3">
        <BButton
          type="primary"
          class="
            px-2
            py-2
            hover:bg-black
            rounded
            capitalize
            hover:text-red-300
            mb-2
            mr-2
          "
          @click="filtersOpen = !filtersOpen"
          >Open Filters +</BButton
        >
      </div>
      <div class="flex flex-wrap sm:space-x-3 my-3">
        <span class="pr-4 self-center">Filtering By:</span>
        <span
          v-for="(filter, i) in activeFilters.resources"
          :key="i"
          :class="getResource(filter).colourClass"
          class="
            px-4
            py-1
            rounded-full
            text-sm
            mb-1
            mr-2
            bg-opacity-75
            hover:bg-opacity-50
            shadow-2xl
            border
            cursor-pointer
          "
          @click="removeFilter('resources', filter)"
        >
          {{ getResource(filter).trait }}
          <button class="bg-transparent hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              class="ml-4 self-center"
              viewBox="0 0 1792 1792"
            >
              <path
                d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
              ></path>
            </svg>
          </button>
        </span>
        <span
          v-for="(filter, i) in activeFilters.orders"
          :key="'orders-' + i"
          :style="'background: ' + getOrderByName(filter).colour"
          class="
            px-4
            py-1
            rounded-md
            text-sm
            mb-1
            mr-2
            bg-opacity-75
            shadow-2xl
            border-gray-900
            cursor-pointer
          "
          @click="removeFilter('orders', filter)"
        >
          Order of {{ getOrderByName(filter).name }}
          <button class="bg-transparent hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              class="ml-4"
              viewBox="0 0 1792 1792"
            >
              <path
                d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"
              ></path>
            </svg>
          </button>
        </span>
      </div>
      <div class="flex flex-wrap sm:space-x-3 my-3 justify-between">
        <div class="flex flex-grow">
          <span class="pr-4 self-center">Order By:</span>
          <BButton
            v-for="(data, index) in orderByData"
            :key="index"
            :type="data.data === orderBy ? 'primary' : 'outline'"
            :class="{ 'bg-black !text-red-300': data.data === orderBy }"
            class="
              px-2
              py-2
              hover:bg-black
              rounded
              capitalize
              hover:text-red-300
              mb-2
              mr-2
            "
            @click="setOrderBy(data)"
          >
            {{ data.name }}
          </BButton>
        </div>
      </div>

      <div v-if="$fetchState.pending || loading" class="flex flex-wrap mt-6">
        <Loader v-for="(loader, index) in 6" :key="index" class="mr-3 mb-3" />
      </div>
      <div
        v-else-if="displayedRealms && displayedRealms.realms.length"
        class="flex flex-wrap w-full"
      >
        <RealmCard
          v-for="realm in displayedRealms.realms"
          :id="realm.id"
          :key="realm.id"
          :realm="realm"
          class="w-80"
        />
      </div>

      <div>
        <button
          class="bg-black rounded px-4 py-2 hover:bg-gray-700"
          @click="fetchMoreRealms"
        >
          {{ loading ? 'loading' : 'Load More Realms' }}
        </button>
      </div>
    </div>
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
import { useRealms } from '~/composables/useRealms'
import { resources as resourcesList } from '@/composables/utils/resourceColours'
import { gaOrders } from '~/composables/utils/ordersData'

export default defineComponent({
  name: 'FilteredRealms',
  fetchOnServer: false,
  props: {
    type: {
      type: String,
      default: 'all',
    },
  },
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { userRealms, realms, loading, getRealms, getWalletRealms } =
      useRealms()

    const adventurer = ref(null)
    const usersGold = ref(null)
    const search = ref()
    const openSeaData = ref()

    const displayedRealms = ref()
    const filtersOpen = ref(false)
    const first = ref(8)
    const orderBy = ref('tokenId')
    const skip = ref(0)
    const resourcesFilter = ref()
    const ordersFilter = ref()
    const orderDirection = ref()
    const orderByData = [
      {
        data: 'tokenId',
        name: 'Token ID',
      },
      {
        data: 'rarityRank',
        name: 'rarity',
      },
    ]
    const filterByData = [
      {
        data: 'sale_date',
        name: 'resource',
      },
      {
        data: 'sale_price',
        name: 'wonder',
      },
    ]
    const getResource = (id) => {
      console.log(id)
      return resourcesList.find((c) => c.id === id)
    }
    const getOrderById = (id) => {
      console.log(id)
      return gaOrders.find((a) => id === a.id)
    }
    const getOrderByName = (name) => {
      return gaOrders.find((a) => name === a.name)
    }
    const filters = computed(() => {
      return {
        first: first.value,
        skip: skip.value,
        orderBy: orderBy.value,
        resources: resourcesFilter.value,
        orders: ordersFilter.value,
        orderDirection: orderDirection.value,
      }
    })
    const activeFilters = computed(() => {
      return {
        resources: resourcesFilter.value,
        orders: ordersFilter.value,
      }
    })

    const filterEmit = async (checked) => {
      console.log(checked)
      ordersFilter.value = checked.orders
      resourcesFilter.value = checked.resources
      console.log(checked)
      await fetch()
    }
    const removeFilter = async (type, filter) => {
      console.log(filter)
      if (type === 'resources') {
        resourcesFilter.value = resourcesFilter.value.filter((value) => {
          return value !== filter
        })
      } else {
        ordersFilter.value = ordersFilter.value.filter((value) => {
          return value !== filter
        })
      }
      await fetch()
    }
    const setOrderBy = async (data) => {
      console.log(data.data)
      skip.value = 0
      orderBy.value = data.data
      if (['rarityScore', 'raidAttacks'].includes(data.data)) {
        orderDirection.value = 'desc'
      }
      await fetch()
    }

    const { fetch } = useFetch(async () => {
      console.log('fetching')
      if (props.type === 'all') {
        await getRealms(filters.value)
        displayedRealms.value = realms.value
      } else {
        await getWalletRealms(filters.value)
        displayedRealms.value = userRealms.value
      }
    })

    const submitSearch = async () => {
      if (search.value > 0 && search.value <= 8000) {
        await getRealms(filters.value)
      }
    }

    const fetchMoreRealms = async () => {
      first.value = 8
      skip.value = skip.value + 8
      try {
        if (props.type === 'all') {
          await getRealms(filters.value)
          displayedRealms.value = displayedRealms.value.concat(realms.value)
        } else {
          await getWalletRealms(filters.value)
          displayedRealms.value = displayedRealms.value.concat(userRealms.value)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const flipAll = ref(false)

    return {
      getOrderByName,
      flipAll,
      getWalletRealms,
      activeFilters,
      removeFilter,
      resourcesFilter,
      ordersFilter,
      adventurer,
      filters,
      filterEmit,
      shortenHash,
      usersGold,
      openSeaData,
      loading,
      getResource,
      getOrderById,
      submitSearch,
      search,
      displayedRealms,
      fetchMoreRealms,
      orderByData,
      setOrderBy,
      filterByData,
      orderBy,
      realms,
      filtersOpen,
    }
  },
})
</script>
