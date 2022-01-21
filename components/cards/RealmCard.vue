<template>
  <BaseCard class="hover:bg-off-200 hover:border-black">
    <div v-if="realm.order" class="flex text-center p-1">
      <OrderChip class="w-full rounded-lg" :order="realm.order" />
    </div>
    <div class="relative px-1">
      <img
        v-if="realm.image_url"
        class="
          rounded-xl
          w-full
          border-4 border-off-200 border-double
          bg-off-100 bg-blend-screen
        "
        :src="realm.image_url"
      />
      <div
        v-else
        class="
          bg-gray-100
          text-black
          p-2
          rounded
          flex
          self-center
          h-48
          w-full
          justify-between
        "
      >
        no image yet
      </div>
      <RealmRarity
        class="absolute top-10 right-10"
        :rarityScore="realm.rarityScore"
        :rarityRank="realm.rarityRank"
      />
    </div>
    <div class="p-4">
      <div
        v-if="realm.wonder"
        class="
          text-center text-white
          bg-gradient-to-r
          from-purple-200
          via-pink-200
          to-red-300
          text-red-500
          rounded
          py-1
          mb-2
        "
      >
        {{ realm.wonder }}
      </div>
      <div class="flex justify-between">
        <h2>{{ realm.name }}</h2>
        <h3>#{{ realm.id }}</h3>
      </div>

      <!-- <h6 class="text-off-200 group-hover:text-off-100">
        Realm sales: {{ realm.num_sales }}
      </h6>
      <h6 v-if="realm.last_sale" class="text-off-200">
        Last sale price:
        {{ intRoundFloor(realm.last_sale.total_price) / 10 ** 18 }} ETH
      </h6>-->
    </div>
    <div class="p-2 flex flex-wrap text-xs">
      <ResourceChip
        v-for="(resource, index) in realm.resourceIds"
        :key="index"
        class="mr-2 my-1"
        :resource-id="resource"
      />
    </div>

    <div v-if="!stake" class="mt-auto p-4 flex justify-between">
      <span
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          cursor-pointer
          underline
        "
        @click="navigate"
      >
        See on Opensea
      </span>
      <NuxtLink
        :to="'/realms/' + id"
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          underline
        "
      >
        See detail
      </NuxtLink>
    </div>
    <div v-else class="mt-auto">
      <div class="p-2 mt-auto">
        <BButton class="w-full" type="primary" @click="stakeRealmPop(id)">
          <span v-if="loading.stake">Settling....</span>
          <span v-else>Settle Realm</span>
        </BButton>
      </div>
    </div>
  </BaseCard>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useBigNumber } from '~/composables/useBigNumber'
import { useStaking } from '~/composables/useStaking'
export default defineComponent({
  props: {
    realm: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    stake: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { intRoundFloor } = useBigNumber()
    const { loading, stakeRealms } = useStaking()
    const navigate = () => {
      window.open(
        'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          props.id,
        '_blank'
      )
    }

    const stakeRealmPop = async (id) => {
      try {
        await stakeRealms([id])
      } catch (e) {
        console.log(e)
      } finally {
        context.emit('realmSettled', id)
      }
    }
    return {
      loading,
      stakeRealmPop,
      shortenHash,
      navigate,
      intRoundFloor,
    }
  },
})
</script>
