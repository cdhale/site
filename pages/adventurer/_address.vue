<template>
  <div>
    <h3 class="text-gray-400">
      <span v-if="ensName">{{ ensName }}</span>
      <span v-else>{{ shortenHash(address) }}</span>
    </h3>
    <h1 v-if="isAddressPage" class="mb-8">My Lord, your vast empire</h1>
    <h1 v-else class="mb-8">Adventurer's Empire</h1>
    <div class="flex">
      <nav class="space-x-4 mb-6 bg-gray-900 px-3 py-5 rounded-2xl">
        <NuxtLink
          v-for="(link, index) in menuLinks"
          :key="index"
          class="
            text-xl
            rounded-xl
            px-6
            py-3
            font-display
            hover:bg-off-200 hover:text-off-100 hover:border-black
            uppercase
            border-b-4 border-t-4 border-double border-off-200
            text-off-200
          "
          :to="'/adventurer/' + address + '/' + link.slug"
          >{{ link.title }}</NuxtLink
        >
      </nav>
    </div>

    <NuxtChild keep-alive />
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useConnect } from '~/composables/useConnect'
export default defineComponent({
  setup(props, context) {
    const { shortenHash, returnEns, ensName } = useFormatting()
    const { isAddressPage } = useConnect()
    const { address } = context.root.$route.params
    // const variables = ref({ slug: slug.toLowerCase() })

    const menuLinks = ref([
      {
        title: 'Assets',
        slug: '',
      },
      {
        title: 'Realms',
        slug: 'realms',
      },
    ])
    /* const displayedLinks = computed(() => {
       if (isAddressPage.value) {
        return menuLinks.value.concat({
          title: 'Realms available to Settle',
          slug: 'settling',
        })
      } else  return menuLinks.value
    })

    if (isAddressPage) {
      menuLinks.value.push()
    } */
    onMounted(async () => {
      await returnEns(address)
    })
    return {
      address,
      menuLinks,
      ensName,
      shortenHash,
      isAddressPage,
    }
  },
})
</script>
