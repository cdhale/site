import { ref, computed, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { compileCalldata, number, stark, uint256 } from 'starknet'
import { utils } from 'ethers'
import { useArgent } from './useArgent'
import starknetAddresses from '~/constant/starknetAddresses'
import { useBigNumber } from '~/composables/useBigNumber'

const transactions = ref([])
const polling = ref()

type TxStatus = 'UNKNOWN' | 'PENDING' | 'ERROR' | 'ACCEPTED'

export class Transaction {
  status: TxStatus = 'UNKNOWN'
  hash: string
  keyword: string
  metadata: any
  refreshing: boolean

  constructor(
    hash: string,
    keyword: string,
    metadata?: any,
    status?: TxStatus
  ) {
    this.hash = hash
    this.keyword = keyword
    this.metadata = metadata
    if (status) this.status = status
  }
}

export function useStarkTransactions() {
  const { starknet, account, networkId, waitForTransaction } = useArgent()

  const add = (tx: Transaction) => {
    console.log(tx)
    transactions.value = [...transactions.value, tx]
    transactions.value
      .filter((transaction) =>
        ['PENDING', 'UNKNOWN'].includes(transaction.status)
      )
      .forEach((transaction) => getStatus(transaction))
  }

  const getStatus = async (transaction) => {
    if (transaction.refreshing || !starknet.value?.provider) return
    transaction.refreshing = true
    const tx = await waitForTransaction(transaction.hash)
    console.log(tx)
    if (
      status === 'PENDING' ||
      status === 'RECEIVED' ||
      status === 'NOT_RECEIVED'
    )
      transaction.status = 'PENDING'
    else if (status === 'REJECTED') transaction.status = 'ERROR'
    else if (status === 'ACCEPTED_ON_L2' || status === 'ACCEPTED_ON_L1')
      transaction.status = 'ACCEPTED'
    else transaction.status = 'ERROR'
    transaction.refreshing = false

    setLocalStorage()
  }

  const isAccepted = (tx) => {
    return tx.status === 'ACCEPTED'
  }
  const isPending = (tx) => {
    return tx.status === 'PENDING' || tx.status === 'UNKNOWN'
  }

  const pendingTransactions = computed(() => {
    return transactions.value.filter(
      (transaction) => transaction.status === 'PENDING'
    )
  })

  const setLocalStorage = () => {
    console.log(transactions.value)
    window.localStorage.setItem(
      'transactions',
      JSON.stringify({
        txs: transactions.value.map((x) => [
          x.hash,
          x.keyword,
          x.metadata,
          x.status,
        ]),
      })
    )
  }
  const getLocalStorage = () => {
    if (transactions.value.length) {
      return
    }
    const localTransactions = localStorage.getItem('transactions')
    console.log(JSON.parse(localTransactions))
    if (localTransactions) {
      for (const txdata of JSON.parse(localTransactions).txs) {
        const data: [string, string, string, TxStatus] = txdata
        /* eslint-disable no-new */
        add(new Transaction(...data))
      }
    }
  }
  const pollPendingTransactions = () => {
    console.log('polling')
    polling.value = setInterval(() => {
      transactions.value
        .filter((transaction) =>
          ['PENDING', 'UNKNOWN'].includes(transaction.status)
        )
        .forEach((transaction) => getStatus(transaction))
    }, 5000)
  }
  onUnmounted(() => {
    clearInterval(polling.value)
  })
  onMounted(() => {
    getLocalStorage()
    pollPendingTransactions()
  })
  return {
    transactions: computed(() => transactions.value),
    pendingTransactions,
    isAccepted,
    isPending,
    add,
    getStatus,
  }
}
