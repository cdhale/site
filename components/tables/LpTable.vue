<template>
  <tr class="border-4 border-double border-off-200">
    <td
      class="
        w-1/3
        text-xl
        p-2
        font-semibold
        border-4 border-double border-off-200
      "
    >
      {{ position.tokenId }}
    </td>
    <td
      class="
        w-1/3
        text-xl
        p-2
        font-semibold
        border-4 border-double border-off-200
      "
    >
      <span>{{ rewardInfo ? rewardInfo : 0 }}</span>
    </td>
    <td class="w-full flex space-x-4 justify-center p-2">
      <BButton
        v-if="!position.incentivePositions.length"
        :loading="loading.deposit"
        type="settling"
        @click="deposit(position.tokenId)"
        >Deposit</BButton
      >
      <BButton
        v-if="position.staked"
        :loading="loading.stake"
        type="settling"
        @click="unstake(position.tokenId)"
        >Unstake / Claim</BButton
      >
      <BButton
        v-else
        :loading="loading.stake"
        type="settling"
        @click="stake(position.tokenId)"
        >Stake</BButton
      >
      <BButton
        :loading="loading.stake"
        type="settling"
        @click="withdraw(position.tokenId)"
        >Withdraw</BButton
      >
    </td>
  </tr>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import { useIncentive } from '~/composables/useIncentive'
export default defineComponent({
  props: {
    position: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const {
      getRewardsByToken,
      rewardInfo,
      unstake,
      stake,
      withdraw,
      loading,
      deposit,
    } = useIncentive()

    onMounted(async () => {
      if (props.position.staked) {
        await getRewardsByToken(props.position.tokenId)
        window.setInterval(async () => {
          await getRewardsByToken(props.position.tokenId)
        }, 20000)
      }
    })

    return {
      rewardInfo,
      unstake,
      stake,
      withdraw,
      loading,
      deposit,
    }
  },
})
</script>
