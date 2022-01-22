<template>
  <BaseCard class="hover:bg-off-200 hover:border-black">
    <div v-if="realm.order" class="flex text-center p-1">
      <OrderChip class="w-full rounded-lg" :order="realm.order" />
    </div>
    <div class="relative px-1">
      <div class="flex self-center h-84">
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
      </div>
      <RealmRarity
        class="absolute top-10 right-10"
        :rarityScore="realm.rarityScore"
        :rarityRank="realm.rarityRank"
      />
    </div>
    <div class="p-4 pb-0">
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
    </div>
    <div class="p-2 flex flex-wrap text-xs">
      <ResourceChip
        v-for="(resource, index) in realm.resourceIds"
        :key="index"
        class="mr-2 my-1"
        :resource-id="resource"
      />
    </div>
    <div class="flex flex-col w-full px-4 text-sm">
      <span>Regions</span>
      <div class="w-full bg-gray-200 rounded">
        <div
          class="bg-amber-500 h-1"
          :style="'width: ' + (realm.regions / 7) * 100 + '%'"
        ></div>
      </div>
      <span class="pt-1 text-sm">Cities</span>
      <div class="w-full bg-gray-200 rounded">
        <div
          class="bg-amber-800 h-1"
          :style="'width: ' + (realm.cities / 21) * 100 + '%'"
        ></div>
      </div>
      <span class="pt-1">Harbors</span>
      <div class="w-full bg-gray-200 rounded">
        <div
          class="bg-blue-600 h-1"
          :style="'width: ' + (realm.harbours / 35) * 100 + '%'"
        ></div>
      </div>
      <span class="pt-1">Rivers</span>
      <div class="w-full bg-gray-200 rounded">
        <div
          class="bg-blue-400 h-1"
          :style="'width: ' + (realm.rivers / 60) * 100 + '%'"
        ></div>
      </div>
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
<style scoped>
.v-lazy-image {
  opacity: 0;
  transition: opacity 1s;
}
.v-lazy-image-loaded {
  opacity: 1;
}
</style>
