<template>
  <div class="pt-2 pr-2">
    <div
      :class="getColour"
      class="
        bg-white
        flex
        hover-trigger
        rounded-xl
        px-3
        py-1
        border-4 border-double
      "
    >
      <span class="score">Rarity: {{ rarityScore }}</span>
      <span class="rank">Rank: {{ rarityRank }} /8000</span>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useRarity } from '~/composables'
export default defineComponent({
  props: {
    rarityRank: {
      type: String,
      default: null,
      required: false,
    },
    rarityScore: {
      type: String,
      default: null,
      required: false,
    },
  },
  setup(props) {
    const { checkRealmRarity } = useRarity()

    const getColour = computed(() => {
      if (props.rarityScore > 8000) {
        return 'bg-gradient-to-r from-purple-200 via-pink-400 to-red-400'
      } else if (props.rarityScore > 200) {
        return 'bg-red-800 text-white'
      } else if (props.rarityScore > 100) {
        return 'bg-red-600 text-white'
      } else if (props.rarityScore > 50) {
        return 'bg-red-400 text-white'
      } else if (props.rarityScore > 25) {
        return 'bg-red-200 text-white text-gray-700'
      } else if (props.rarityScore > 10) {
        return 'bg-red-50 text-gray-700'
      } else {
        return 'text-black'
      }
    })
    return {
      checkRealmRarity,
      getColour,
    }
  },
})
</script>

<style>
.rank {
  display: none;
}

.hover-trigger:hover .rank {
  display: block;
}
.hover-trigger:hover .score {
  display: none;
}
</style>
