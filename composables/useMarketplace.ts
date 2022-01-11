import { ref, reactive, computed } from '@nuxtjs/composition-api'
import { compileCalldata, number, stark, uint256 } from 'starknet'
import { useArgent } from './useArgent'
import starknetAddresses from '~/constant/starknetAddresses'
import { useBigNumber } from '~/composables/useBigNumber'
import {
  Transaction,
  useStarkTransactions,
} from '~/composables/useStarkTransactions'
function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: 'struct' as const, ...uint256.bnToUint256(bn) }
}

const trades = ref([])
const tokenTrades = ref({})
const isNFTApproved = reactive({
  realms: false,
})
const lordsAllowances = reactive({
  realms: null,
  marketplace: null,
})
const marketplaceAllowance = ref()
const tradeCounter = ref()

export function useMarketplace() {
  const { starknet, account, networkId } = useArgent()
  const { add } = useStarkTransactions()
  const { toBN } = useBigNumber()

  const loading = reactive({
    approved: false,
    counter: false,
    trade: false,
    getBook: false,
    realmOwner: false,
    tokenTrade: false,
  })
  const getApprovals = () => {
    getlordsAllowance()
    getRealmsAllowance()
    getRealmsApprovedForMarketplace()
  }

  const getRealmsApprovedForMarketplace = async () => {
    loading.approved = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address
    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address

    // checks that enable succeeded
    if (starknet.value?.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      console.log('realm approve')
      const { result } = await starknet.value.provider.callContract({
        contract_address: realmsTokenAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('isApprovedForAll'), // selector (mint)
        calldata: compileCalldata({
          owner: number.toBN(account.value[0]).toString(),
          operator: number.toBN(marketplaceAddress).toString(),
        }),
      })
      console.log(result)
      if (result[0].toString() === '0x1') {
        isNFTApproved.realms = true
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.approved = false
    }
  }

  const getRealmsAllowance = async () => {
    loading.approved = true
    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address
    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address

    // checks that enable succeeded
    if (!starknet.value?.isConnected) {
      console.log('Wallet Not connected')
      return
    }

    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: lordsTokenAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('allowance'), // selector (mint)
        calldata: compileCalldata({
          owner: number.toBN(account.value[0]).toString(),
          spender: number.toBN(realmsTokenAddress).toString(),
        }),
      })

      lordsAllowances.realms = parseInt(result[0]) / 10 ** 18
    } catch (e) {
      console.log(e)
    } finally {
      loading.approved = false
    }
  }
  const setApproveLordsForRealms = async () => {
    loading.approved = true
    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address

    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address
    try {
      const tx = await starknet.value.signer.invokeFunction(
        lordsTokenAddress, // to (erc20 contract)
        stark.getSelectorFromName('approve'), // selector (mint)
        compileCalldata({
          spender: number.toBN(realmsTokenAddress).toString(), // receiver (self)
          amount: getUint256CalldataFromBN('1000000000000000000000'), // amount
        })
      )
      add(new Transaction(tx.transaction_hash, 'approve_lords'))
    } catch (e) {
      console.log(e)
    } finally {
      loading.approved = false
    }
  }

  const getlordsAllowance = async () => {
    loading.approved = true
    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    // checks that enable succeeded
    if (starknet.value?.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: lordsTokenAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('allowance'), // selector (mint)
        calldata: compileCalldata({
          owner: number.toBN(account.value[0]).toString(),
          spender: number.toBN(marketplaceAddress).toString(),
        }),
      })
      lordsAllowances.marketplace = parseInt(result[0]) / 10 ** 18
    } catch (e) {
      console.log(e)
    } finally {
      loading.approved = false
    }
  }
  const setApproveRealmsForMarketplace = async () => {
    loading.approved = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address
    try {
      const tx = await starknet.value.signer.invokeFunction(
        realmsTokenAddress, // to (erc20 contract)
        stark.getSelectorFromName('setApprovalForAll'), // selector (mint)
        compileCalldata({
          operator: number.toBN(marketplaceAddress).toString(), // receiver (self)
          approved: '1', // amount
        })
      )
      add(new Transaction(tx.transaction_hash, 'setApprovalForAll'))
    } catch (e) {
      console.log(e)
    } finally {
      loading.approved = false
    }
  }
  const setApproveLordsForMarketplace = async () => {
    loading.approved = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address
    try {
      const tx = await starknet.value.signer.invokeFunction(
        lordsTokenAddress, // to (erc20 contract)
        stark.getSelectorFromName('approve'), // selector (mint)
        compileCalldata({
          spender: number.toBN(marketplaceAddress).toString(), // receiver (self)
          amount: getUint256CalldataFromBN('1000000000000000000000'), // amount
        })
      )
      add(new Transaction(tx.transaction_hash, 'approve_realms_spend_lords'))
    } catch (e) {
      console.log(e)
    } finally {
      loading.approved = false
    }
  }

  const getTradeCounter = async () => {
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address
    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: marketplaceAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('get_trade_counter'), // selector (mint)
        calldata: [],
      })
      tradeCounter.value = toBN(result[0]).toString()
    } catch (e) {
      console.log(e)
    }
  }

  const openTrade = async (id, price) => {
    loading.trade = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    // checks that enable succeeded
    if (starknet.value.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      const tx = await starknet.value.signer.invokeFunction(
        marketplaceAddress, // to (erc20 contract)
        stark.getSelectorFromName('open_trade'), // selector (mint)
        compileCalldata({
          _token_id: getUint256CalldataFromBN(id), // receiver (self)
          _price: price.toString(),
          _expiration: '919191919',
        })
      )

      add(new Transaction(tx.transaction_hash, 'open_trade'))
    } catch (e) {
      console.log(e)
    } finally {
      loading.trade = false
    }
  }
  const executeTrade = async (id) => {
    loading.trade = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    // checks that enable succeeded
    if (starknet.value.isConnected === false) {
      console.log('Wallet Not connected')
    }

    const tx = await starknet.value.signer.invokeFunction(
      marketplaceAddress, // to (erc20 contract)
      stark.getSelectorFromName('execute_trade'), // selector (mint)
      compileCalldata({
        _trade: id,
      })
    )

    add(new Transaction(tx.transaction_hash, 'execute_trade'))
    loading.trade = false
  }
  const getTrade = async (idx) => {
    loading.getBook = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    // checks that enable succeeded
    if (starknet.value.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: marketplaceAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('get_trade'), // selector (mint)
        calldata: compileCalldata({
          idx, // receiver (self)
        }),
      })

      trades.value.push({
        item: toBN(result[0]).toString(),
        id: idx.toString(),
        expiration: toBN(result[2]).toString(),
        price: toBN(result[3]).toString(),
        poster: result[4].toString(),
        status: toBN(result[5]).toString(),
      })
    } catch (e) {
      console.log(e)
    } finally {
      loading.getBook = false
    }
  }
  const getTradeByToken = async (tokenId) => {
    loading.getBook = true
    const marketplaceAddress =
      starknetAddresses[networkId.value].marketplace.address

    // checks that enable succeeded
    if (starknet.value.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: marketplaceAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName(
          'get_open_trade_by_token'
        ), // selector (mint)
        calldata: compileCalldata({
          _token_id: getUint256CalldataFromBN(tokenId),
        }),
      })

      tokenTrades.value[tokenId] = {
        item: toBN(result[0]).toString(),
        id: tokenId.toString(),
        expiration: toBN(result[2]).toString(),
        price: toBN(result[3]).toString(),
        poster: result[4].toString(),
        status: toBN(result[5]).toString(),
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.getBook = false
    }
  }
  return {
    getApprovals,
    isNFTApproved,
    lordsAllowances,
    setApproveLordsForRealms,
    setApproveLordsForMarketplace,
    setApproveRealmsForMarketplace,
    trades,
    openTrade,
    executeTrade,
    getTrade,
    getTradeCounter,
    tradeCounter,
    loading,
  }
}
