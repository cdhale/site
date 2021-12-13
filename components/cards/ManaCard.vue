<template>
  <BaseCard class="p-4 h-60" @click="navigate">
    <span class="text-2xl"> #{{ mana.id }} </span>
    <span
      :style="'color:' + rarityColor(mana.itemName)"
      class="text-2xl mt-4"
      >{{ mana.itemName }}</span
    >
    <div class="mt-auto">
      <div
        class="px-3 py-1 w-full rounded text-xl"
        :style="'background:' + orderGA.colour"
      >
        of {{ orderGA.name }}
      </div>
    </div>
  </BaseCard>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useLootRarity } from '~/composables/useLootRarity'
import { gaOrders, suffixArray } from '~/composables/utils/ordersData'

export default defineComponent({
  props: {
    mana: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const { rarityColor } = useLootRarity()
    const { shortenHash } = useFormatting()
    const navigate = () => {
      const url = '0xf4b6040a4b1b30f1d1691699a8f3bf957b03e463'
      window.open(
        'https://opensea.io/assets/' + url + '/' + props.mana.id,
        '_blank'
      )
    }

    const orderGA = computed(() => {
      return gaOrders[props.mana.suffixId - 1]
    })

    return {
      shortenHash,
      navigate,
      rarityColor,
      suffixArray,
      orderGA,
    }
  },
})
</script>
