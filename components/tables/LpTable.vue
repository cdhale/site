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
      {{ status }}
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
        v-if="!deposited"
        :loading="loading.deposit"
        type="settling"
        @click="deposit(position.tokenId)"
        >Deposit & Stake</BButton
      >
      <BButton
        v-if="position.staked"
        :loading="loading.stake"
        type="settling"
        @click="unstake(position.tokenId)"
        >Unstake / Claim</BButton
      >
      <BButton
        v-if="deposited & !position.staked"
        :loading="loading.stake"
        type="settling"
        @click="stake(position.tokenId)"
        >Stake</BButton
      >
      <BButton
        v-if="deposited && !position.staked"
        :loading="loading.stake"
        type="settling"
        @click="withdraw(position.tokenId)"
        >Withdraw</BButton
      >
    </td>
  </tr>
</template>
<script>
import { defineComponent, onMounted, computed } from '@vue/composition-api'
import { useIncentive } from '~/composables/useIncentive'
import { useNetwork } from '~/composables/useNetwork'
import contractAddresses from '~/constant/contractAddresses'

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
    const { useL1Network } = useNetwork()
    const lordsToken = contractAddresses[useL1Network.value.id].uniswapV3Pool

    const deposited = computed(
      () =>
        props.position.owner === lordsToken.toLowerCase() ||
        props.position.owner === lordsToken ||
        props.position.owner === '0x0000000000000000000000000000000000000000'
    )

    const status = computed(() => {
      if (props.position.staked) {
        return 'staked'
      } else if (deposited.value) {
        return 'deposited'
      } else {
        return 'held'
      }
    })

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
      deposited,
      unstake,
      stake,
      withdraw,
      loading,
      deposit,
      status,
    }
  },
})
</script>
