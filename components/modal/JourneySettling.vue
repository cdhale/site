<template>
  <div
    class="
      inline-block
      max-w-sm
      px-4
      py-6
      overflow-hidden
      text-xl text-left
      align-bottom
      transition-all
      transform
      bg-white
      border-4 border-double
      rounded-lg
      shadow-xl
      w-96
      dark:bg-dark-400
      text-off-200
      sm:my-8 sm:align-middle sm:p-6
      border-off-200
    "
  >
    <h1 class="text-center">
      Select Realms to {{ type === 'stake' ? 'Stake' : 'Unstake' }}
    </h1>
    <LoadingRings
      v-if="loading.approve"
      class="w-32 mx-auto stroke-current fill-none text-off-200"
    />
    <div v-else-if="!isApproved" class="content-center mx-auto">
      <p>Approve your account to stake your Realms</p>
      <BButton class="mt-5" type="settling" @click="approve">Approve</BButton>
    </div>
    <div v-else-if="!loading.stake && userRealmIds && userRealmIds.length">
      <div class="flex flex-wrap">
        <button
          v-for="(id, index) in userRealmIds"
          :key="index"
          :class="{
            'bg-gray-500 text-off-100': multiMintIds.find((a) => a === id),
          }"
          class="
            px-2
            py-1
            mx-2
            my-2
            text-xl
            hover:bg-gray-500 hover:text-off-100
            rounded-xl
          "
          @click="addIds(id)"
        >
          {{ id }}
        </button>
      </div>
      <div v-if="type === 'stake'" class="flex space-x-4">
        <BButton
          class="mt-5"
          type="settling"
          :disabled="!multiMintIds.length"
          @click="stakeSelectedUserRealms"
          >Stake Selected</BButton
        >
        <BButton class="mt-5" type="settling" @click="stakeUserRealms"
          >Stake All Realms</BButton
        >
      </div>
      <div v-else>
        <div class="font-semibold">
          NOTE: Any unclaimed LORDS will be claimed when unstaking. Click
          <span class="underline cursor-pointer" @click="isLordsAdded"
            >here</span
          >
          to add LORDS to metamask.
        </div>
        <div class="flex space-x-4">
          <BButton
            :disabled="!multiMintIds.length"
            class="mt-5"
            type="settling"
            @click="unstakeSelectedUserRealms"
            >Unstake Selected</BButton
          >
          <BButton class="mt-5" type="settling" @click="unstakeUserRealms"
            >Unstake All Realms</BButton
          >
        </div>
      </div>
    </div>
    <div v-else-if="!userRealmIds.length">No Realms Available</div>
    <div v-else>
      <LoadingRings
        class="w-32 mx-auto stroke-current fill-none text-off-200"
      />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  ref,
  reactive,
  onMounted,
} from '@vue/composition-api'
import { useStaking } from '~/composables/useStaking'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import { useRealms } from '~/composables/useRealms'

export default defineComponent({
  components: {
    LoadingRings,
  },
  props: {
    type: {
      type: String,
      default: 'stake',
    },
    version: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    const multiMintIds = ref([])
    const {
      stakeRealms,
      loading,
      unstake,
      isApproved,
      getApproved,
      approve,
      isLordsAdded,
    } = useStaking()
    const { userRealms, userRealmsl1 } = useRealms()
    const step = reactive({
      chooseRealms: true,
      approve: false,
      stake: false,
    })
    const userRealmIds = computed(() => {
      if (props.type === 'stake') {
        return userRealms.value.l1?.realms.map((a) => a.id) || null
      } else if (props.version === 'v2') {
        return userRealms.value.l1?.bridgedV2Realms.map((a) => a.id) || null
      } else {
        return userRealms.value.l1?.bridgedRealms.map((a) => a.id) || null
      }
    })
    const stakeUserRealms = async () => {
      await stakeRealms(props.version, userRealmIds.value)
    }
    const stakeSelectedUserRealms = async () => {
      await stakeRealms(props.version, multiMintIds.value)
      multiMintIds.value = []
    }
    const unstakeUserRealms = async () => {
      await unstake(props.version, userRealmIds.value)
    }
    const unstakeSelectedUserRealms = async () => {
      await unstake(props.version, multiMintIds.value)
      multiMintIds.value = []
    }
    const addIds = (id) => {
      const index = multiMintIds.value.indexOf(id)
      if (index > -1) {
        multiMintIds.value.splice(index, 1)
      } else {
        multiMintIds.value.push(id)
      }
    }
    onMounted(async () => {
      await getApproved()
    })
    return {
      step,
      approve,
      stakeUserRealms,
      stakeSelectedUserRealms,
      unstakeUserRealms,
      unstakeSelectedUserRealms,
      addIds,
      isLordsAdded,
      userRealms,
      userRealmsl1,
      userRealmIds,
      multiMintIds,
      loading,
      isApproved,
    }
  },
})
</script>
