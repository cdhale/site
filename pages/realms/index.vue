<template>
  <section>
    <div>
      <h1>Realms</h1>

      <form
        class="flex space-x-4 flex-wrap"
        method="POST"
        @submit.prevent="submitSearch"
      >
        <input
          v-model="search"
          placeholder="insert realm id"
          class="
            bg-black
            rounded-2xl
            px-4
            py-2
            text-xl
            border-4 border-double border-off-200
            w-full
            sm:w-auto
          "
          type="text"
        />
        <div class="w-full sm:w-auto self-center">
          <BButton class="mt-2 sm:mt-0 sm:px-4 w-full" type="primary"
            >find realm</BButton
          >
        </div>
      </form>

      <div class="flex flex-wrap sm:space-x-3 my-3">
        <span class="pr-4 self-center">Order By:</span>
        <BButton
          v-for="(data, index) in orderByData"
          :key="index"
          type="primary"
          :class="{ 'bg-black ': data.data === orderBy }"
          class="px-2 py-2 mb-2 mr-2 text-sm"
          @click="setOrderBy(data)"
        >
          {{ data.name }}
        </BButton>
      </div>

      <InfiniteScroll
        v-if="!$fetchState.pending"
        class="flex flex-wrap w-full"
        :content-change-key="openSeaData.length"
        @fetchNextBlock="fetchMoreRealms"
      >
        <div v-for="realm in openSeaData" :key="realm.id" class="w-80">
          <RealmCard :id="realm.token_id" :realm="realm" />
        </div>
        <template v-if="loading">
          <Loader
            v-for="(loader, index) in 4"
            :key="'dummy' + index"
            class="mr-3 mb-3"
          />
        </template>
      </InfiniteScroll>
      <div v-else class="flex flex-wrap mt-6">
        <Loader v-for="(loader, index) in 6" :key="index" class="mr-3 mb-3" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import axios from 'axios'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  setup(props, context) {
    const { shortenHash } = useFormatting()

    const adventurer = ref(null)
    const usersGold = ref(null)
    const search = ref()
    const openSeaData = ref([])
    const loading = ref()
    const orderBy = ref()
    const offset = ref(0)

    const orderByData = [
      {
        data: 'sale_date',
        name: 'sale date',
      },
      {
        data: 'sale_count',
        name: 'sale count',
      },
      {
        data: 'sale_price',
        name: 'sale price',
      },
    ]

    const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50'

    const getOSData = async () => {
      if (orderBy.value) {
        return await axios.get(
          baseAssetAddress +
            '&offset=' +
            offset.value +
            '&order_by=' +
            orderBy.value,
          {
            headers: {
              'X-API-KEY': process.env.OPENSEA,
            },
          }
        )
      } else {
        return await axios.get(baseAssetAddress + '&offset=' + offset.value, {
          headers: {
            'X-API-KEY': process.env.OPENSEA,
          },
        })
      }
    }

    const { fetch } = useFetch(async () => {
      const response = await getOSData()
      openSeaData.value = response.data.assets
    })

    const setOrderBy = async (data) => {
      offset.value = 0
      orderBy.value = data.data
      await fetch()
    }

    const submitSearch = () => {
      if (search.value > 0 && search.value <= 8000) {
        context.root.$router.push(`/realms/${search.value}`)
      }
    }

    const fetchMoreRealms = async () => {
      loading.value = true
      offset.value = offset.value + 50
      try {
        const response = await getOSData()
        const newRealms = response.data.assets
        openSeaData.value = openSeaData.value.concat(newRealms)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    return {
      adventurer,
      shortenHash,
      usersGold,
      openSeaData,
      loading,
      submitSearch,
      search,
      fetchMoreRealms,
      orderByData,
      setOrderBy,
      orderBy,
    }
  },
})
</script>
