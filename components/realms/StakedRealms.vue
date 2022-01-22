<template>
  <div>
    <div>
      <h2>Staked Realms ({{ bridgedRealms || 0 }})</h2>
    </div>
    <FilteredRealms type="staked" />

    <!--<InfiniteScroll
      v-if="!realmsLoading"
      class="flex flex-wrap w-full"
      :content-change-key="metaData.length"
      @fetchNextBlock="fetchMoreRealms"
    >
      <div
        v-for="realm in realms.l1.bridgedRealms"
        :key="realm.id"
        class="w-80"
      >
        <RealmCard :id="realm.tokenId" :realm="realm" />
      </div>
      <template v-if="realmsLoading || loading">
        <Loader
          v-for="(loader, index) in 4"
          :key="'dummy' + index"
          class="mr-3 mb-3"
        />
      </template>
    </InfiniteScroll>
    <div v-else>
      <Loader />
    </div>-->
  </div>
</template>
<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useRealms } from '~/composables/useRealms'
export default defineComponent({
  setup(props, context) {
    const { userRealms } = useRealms()

    const bridgedRealms = computed(() => {
      return userRealms.value.l1?.wallet?.bridgedRealmsHeld
    })

    return {
      bridgedRealms,
    }
  },
})
</script>
