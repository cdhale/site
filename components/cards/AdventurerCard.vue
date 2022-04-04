<template>
  <BaseCard class="p-4 h-80" @click.native="navigate">
    <div>
      <h3>{{ shortenHash(adventurer.address) }}</h3>
      <div class="text-xl">
        <span>Loot Bags: {{ adventurer.bagsHeld ? adventurer.bagsHeld : 0 }}</span>
        <br>
        <span>Genesis Adventurers:
          {{
            adventurer.gAdventurersHeld ? adventurer.gAdventurersHeld : 0
          }}</span>
        <br>
        <span>Realms:
          {{
            adventurer.realmsHeld || adventurer.bridgedRealmsHeld
              ? +adventurer.realmsHeld + +adventurer.bridgedRealmsHeld
              : 0
          }}</span>
        <br>
        <span>Mana: {{ adventurer.manasHeld ? adventurer.manasHeld : 0 }}</span>
        <br>
        <span>mLoot: {{ adventurer.mLootsHeld ? adventurer.mLootsHeld : 0 }}</span>
      </div>
    </div>
    <div class="mt-auto flex text-gray-300">
      Visit Adventurers Profile <ArrowRight class="ml-4 w-4 h-4 self-center" />
    </div>
  </BaseCard>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
export default defineComponent({
  components: {
    ArrowRight
  },
  props: {
    adventurer: {
      type: Object,
      required: true
    }
  },
  setup (props, context) {
    const { shortenHash /* , returnEns */, ensName } = useFormatting()
    const navigate = () => {
      context.root.$router.push(`/adventurer/${props.adventurer.address}`)
    }

    onMounted(async () => {
      // await returnEns(props.adventurer.address)
    })
    return {
      shortenHash,
      navigate,
      ensName
    }
  }
})
</script>
