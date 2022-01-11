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
        <tr v-for="transaction in transactions" :key="transaction.hash">
          <td class="p-2">{{ transaction.status }}</td>
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
import { defineComponent } from '@vue/composition-api'
import { useStarkTransactions } from '~/composables/useStarkTransactions'
import { useArgent } from '~/composables/useArgent'
import { useFormatting } from '~/composables/useFormatting'
export default defineComponent({
  setup() {
    const { transactions } = useStarkTransactions()
    const { shortenHash } = useFormatting()
    const { getExplorerUrlBase } = useArgent()

    return {
      transactions,
      shortenHash,
      getExplorerUrlBase,
    }
  },
})
</script>
