<template>
  <BaseCard class="p-4" @click.native="navigate">
    <div class="mb-4 flex justify-between">
      <div class="flex flex-col">
        <span class="text-2xl">GA: #{{ loot.id }}</span>
      </div>
      <hr />
    </div>
    <div class="my-3">
      <div
        class="px-3 py-1 w-full rounded text-xl"
        :style="'background:' + loot.orderColor"
      >
        Order of {{ loot.order }}
      </div>
    </div>
    <div class="text-xl">
      <span :style="'color:' + rarityColor(loot.weapon)">{{
        loot.weapon
      }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.chest)">{{ loot.chest }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.head)">{{ loot.head }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.waist)">{{ loot.waist }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.foot)">{{ loot.foot }}</span
      ><br />
      <span :style="'color:' + rarityColor(loot.hand)">{{ loot.hand }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.neck)">{{ loot.neck }}</span>
      <br />

      <span :style="'color:' + rarityColor(loot.ring)">{{ loot.ring }}</span>
      <br />
    </div>

    <div class="mt-auto">
      <span
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          underline
        "
      >
        See on Opensea
      </span>
    </div>
  </BaseCard>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useLootRarity } from '~/composables/useLootRarity'
import { gaOrders } from '~/composables/utils/ordersData'
export default defineComponent({
  props: {
    loot: {
      type: Object,
      required: true,
    },
    isOG: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const { rarityColor } = useLootRarity()
    const { shortenHash } = useFormatting()

    const navigate = () => {
      window.open(
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/' +
          props.loot.id,
        '_blank'
      )
    }
    const orderGA = computed(() => {
      return gaOrders[props.loot.order - 1]
    })
    return {
      shortenHash,
      navigate,
      rarityColor,
      orderGA,
    }
  },
})
</script>
