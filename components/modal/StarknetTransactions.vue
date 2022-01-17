<template>
  <div
    class="
      inline-block
      w-full
      max-w-3xl
      px-4
      py-6
      overflow-hidden
      text-left
      align-bottom
      transition-all
      transform
      bg-black
      rounded-lg
      shadow-xl
      dark:bg-dark-400
      sm:my-8 sm:align-middle sm:p-6
    "
  >
    <h3>Transactions</h3>

    <table class="table-auto w-full text-center border border-off-200 p-4">
      <thead class="bg-gray-800">
        <tr>
          <th class="p-2">status</th>
          <th class="p-2">Hash</th>
          <th class="p-2">Key</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in displayedTransactions"
          :key="transaction.hash"
        >
          <td class="p-2 pl-4">
            <div
              class="flex justify-center"
              v-if="transaction.status === 'PENDING'"
            >
              <LoadingRings class="w-7 h-7 mr-2" />
              {{ transaction.status }}
            </div>
            <span v-else>{{ transaction.status }}</span>
          </td>
          <td class="p-2">
            <a
              target="blank_"
              class="hover:bg-gracy-700"
              :href="getExplorerUrlBase + 'tx/' + transaction.hash"
              >{{ shortenHash(transaction.hash) }}</a
            >
          </td>
          <td class="p-2">{{ transaction.keyword }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useStarkTransactions } from '~/composables/useStarkTransactions'
import { useArgent } from '~/composables/useArgent'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  components: {
    LoadingRings,
  },
  setup() {
    const { transactions } = useStarkTransactions()
    const { shortenHash } = useFormatting()
    const { getExplorerUrlBase } = useArgent()

    const displayedTransactions = computed(() => {
      return [...transactions.value].reverse()
    })
    return {
      transactions,
      displayedTransactions,
      shortenHash,
      getExplorerUrlBase,
    }
  },
})
</script>
