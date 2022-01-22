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
            text-xs
            sm:text-base
          "
          @click="filtersOpen = !filtersOpen"
          >Open Filters +</BButton
        >
      </div>
      <div
        v-if="
          (activeFilters.resources && activeFilters.resources.length) ||
          (activeFilters.orders && activeFilters.orders.length)
        "
        class="flex flex-wrap sm:space-x-3 my-3"
      >
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
            text-xs
            sm:text-sm
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
      <div v-else></div>
      <div class="flex flex-wrap sm:space-x-3 my-3 justify-between">
        <div class="flex flex-wrap">
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
              mr-2
              mb-1
              sm:mb-0
            "
            @click="setOrderBy(data)"
          >
            {{ data.name }}
          </BButton>
          <div
            v-if="orderDirection === 'asc'"
            @click="
              orderDirection = 'desc'
              fetch()
            "
          >
            <SortAscending class="w-8 h-8 ml-4 mt-1 cursor-pointer" />
          </div>
          <div
            v-else
            @click="
              orderDirection = 'asc'
              fetch()
            "
          >
            <SortDescending class="w-8 h-8 ml-4 mt-1 cursor-pointer" />
          </div>
        </div>
      </div>
      <InfiniteScroll
        v-if="!$fetchState.pending && displayedRealms && displayedRealms.length"
        class="flex flex-wrap w-full"
        :content-change-key="displayedRealms.length"
        @fetchNextBlock="fetchMoreRealms"
      >
        <RealmCard
          v-for="realm in displayedRealms"
          :id="realm.id"
          :key="realm.id"
          :realm="realm"
          class="w-80"
        />
        <template v-if="loading">
          <Loader
            v-for="(loader, index) in 4"
            :key="'dummy' + index"
            class="w-80 mr-3 mb-3"
          />
        </template>
      </InfiniteScroll>

      <div v-else class="flex flex-wrap mt-6">
        <Loader
          v-for="(loader, index) in 6"
          :key="index"
          class="w-80 mr-3 mb-3"
        />
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
import SortAscending from '~/assets/img/sort-ascending.svg?inline'
import SortDescending from '~/assets/img/sort-descending.svg?inline'

export default defineComponent({
  name: 'FilteredRealms',
  fetchOnServer: false,
  components: {
    SortAscending,
    SortDescending,
  },
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
    const { address } = context.root.$route.params
    const adventurer = ref(null)
    const usersGold = ref(null)
    const filterAddress = ref(address)
    const openSeaData = ref()
    const displayedRealms = ref()
    const filtersOpen = ref(false)
    const first = ref(16)
    const orderBy = ref('tokenId')
    const skip = ref(0)
    const resourcesFilter = ref()
    const ordersFilter = ref()
    const orderDirection = ref('asc')
    const orderByData = [
      {
        data: 'tokenId',
        name: 'Token ID',
      },
      {
        data: 'rarityRank',
        name: 'rarity',
      },
      {
        data: 'regions',
        name: 'Regions',
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
      return resourcesList.find((c) => c.id === id)
    }
    const getOrderById = (id) => {
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
        address: filterAddress.value,
      }
    })
    const activeFilters = computed(() => {
      return {
        resources: resourcesFilter.value,
        orders: ordersFilter.value,
      }
    })
    // const realmOsData = compu
    const filterEmit = async (checked) => {
      ordersFilter.value = checked.orders
      resourcesFilter.value = checked.resources
      await fetch()
    }
    const removeFilter = async (type, filter) => {
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
      skip.value = 0
      orderBy.value = data.data
      if (['rarityScore', 'raidAttacks'].includes(data.data)) {
        orderDirection.value = 'desc'
      }
      await fetch()
    }

    const { fetch } = useFetch(async () => {
      if (props.type === 'user') {
        await getWalletRealms(filters.value)
        displayedRealms.value = userRealms.value.l1.realms
      }
      if (props.type === 'staked') {
        await getWalletRealms(filters.value)
        displayedRealms.value = userRealms.value.l1.bridgedRealms
      }
      if (props.type === 'all') {
        await getRealms(filters.value)
        displayedRealms.value = realms.value.l1.realms
      }
    })

    /* const metaData = ref([])
    const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&'

    const getOSData = async (ids) => {
      const mapped = ids
        .map((bag) => {
          return 'token_ids=' + bag.id + '&'
        })
        .join('')
        .slice(0, -1)

      return await axios.get(baseAssetAddress + mapped + '&limit=50', {
        headers: {
          'X-API-KEY': process.env.OPENSEA,
        },
      })
    }

    onMounted(async () => {
     try {
        await fetch()
        if (displayedRealms.value.realms) {
          const response = await getOSData(displayedRealms.value.realms)
          metaData.value = response.data.assets
        }
      } catch (e) {
        console.log(e)
      }
    }) */

    const fetchMoreRealms = async () => {
      first.value = 16
      skip.value = skip.value + first.value
      try {
        if (props.type === 'user') {
          await getWalletRealms(filters.value)
          displayedRealms.value = displayedRealms.value.concat(
            userRealms.value.l1.realms
          )
        }
        if (props.type === 'staked') {
          displayedRealms.value = displayedRealms.value.concat(
            userRealms.value.l1.bridgedRealms
          )
        }
        if (props.type === 'all') {
          await getRealms(filters.value)
          displayedRealms.value = displayedRealms.value.concat(
            realms.value.l1.realms
          )
          /* const response = await getOSData(
            displayedRealms.value.realms.slice(
              skip.value,
              skip.value + first.value
            )
          )
          metaData.value = metaData.value.concat(response.data.assets) */
        }
      } catch (e) {
        console.log(e)
      }
    }

    const flipAll = ref(false)

    return {
      userRealms,
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
      fetch,
      orderDirection,
      loading,
      getResource,
      getOrderById,
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
