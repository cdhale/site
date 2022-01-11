import { ref, reactive, watch, onMounted } from '@nuxtjs/composition-api'
import { compileCalldata, number, stark, uint256 } from 'starknet'
import { utils } from 'ethers'
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

const starkLordsBalance = ref()
const lordsSupply = ref()
const numberOfRealms = ref()
const starkRealms = ref()

export function useStarknet() {
  const { starknet, account, networkId, waitForTransaction } = useArgent()
  const { toBN } = useBigNumber()
  const { add } = useStarkTransactions()

  const result = reactive({
    mint: null,
    mintRealm: null,
  })

  const loading = reactive({
    allowance: false,
    mint: false,
    realmOwner: false,
  })

  const mintToken = async (mintAmount) => {
    loading.mint = true
    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address
    // checks that enable succeeded
    if (starknet.value.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      const tx = await starknet.value.signer.invokeFunction(
        lordsTokenAddress, // to (erc20 contract)
        stark.getSelectorFromName('publicMint'), // selector (mint)
        compileCalldata({
          amount: getUint256CalldataFromBN(
            utils.parseUnits(mintAmount, 18).toString()
          ), // amount
        })
      )
      add(new Transaction(tx.transaction_hash, 'mint_lords'))
    } catch (e) {
      console.log(e)
    } finally {
      loading.mint = false
    }
  }

  const mintRealm = async (id) => {
    loading.mint = true
    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address

    // checks that enable succeeded
    if (starknet.value.isConnected === false) {
      console.log('Wallet Not connected')
    }
    try {
      const tx = await starknet.value.signer.invokeFunction(
        realmsTokenAddress, // to (erc20 contract)
        stark.getSelectorFromName('publicMint'), // selector (mint)
        compileCalldata({
          token_id: getUint256CalldataFromBN(id), // amount
        })
      )
      add(new Transaction(tx.transaction_hash, 'mint_realm'))
      const result = await waitForTransaction(tx.transaction_hash)
      console.log(result)
    } catch (e) {
      console.log(e)
    } finally {
      loading.mint = false
    }
  }

  const getRealmsBalance = async () => {
    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address

    // checks that enable succeeded
    if (!starknet.value?.isConnected) {
      console.log('Wallet Not connected')
      return
    }

    const { result } = await starknet.value.provider.callContract({
      contract_address: realmsTokenAddress, // to (erc20 contract)
      entry_point_selector: stark.getSelectorFromName('balanceOf'), // selector (mint)
      calldata: compileCalldata({
        account: number.toBN(account.value[0]).toString(), // receiver (self)
      }),
    })
    numberOfRealms.value = toBN(result[0])
  }
  const getOwnersTokens = async () => {
    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address

    // checks that enable succeeded
    if (!starknet.value?.isConnected) {
      console.log('Wallet Not connected')
      return
    }

    const { result } = await starknet.value.provider.callContract({
      contract_address: realmsTokenAddress, // to (erc20 contract)
      entry_point_selector: stark.getSelectorFromName(
        'get_all_tokens_for_owner'
      ), // selector (mint)
      calldata: compileCalldata({
        account: number.toBN(account.value[0]).toString(), // receiver (self)
      }),
    })
    const array = result.map(Number).slice(1)
    const newArray = []
    for (let i = 0; i < array.length; i = i + 2) {
      newArray.push({
        low: array[i],
        high: array[i + 1],
      })
    }
    starkRealms.value = newArray
  }

  const getLordsTotalSupply = async () => {
    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address

    // checks that enable succeeded
    if (!starknet.value?.isConnected) {
      console.log('Wallet Not connected')
      return
    }

    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: lordsTokenAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('totalSupply'), // selector (mint)
        calldata: [],
      })
      lordsSupply.value = toBN(result[0]).div(toBN(10 ** 18))
    } catch (e) {
      console.log(e)
    }
  }

  const getLordsBalance = async () => {
    const lordsTokenAddress = starknetAddresses[networkId.value].lords.address
    // checks that enable succeeded
    if (!starknet.value?.isConnected) {
      console.log('Wallet Not connected')
      return
    }

    const callData = compileCalldata({
      account: account.value[0],
    })
    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: lordsTokenAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('balanceOf'), // selector (mint)
        calldata: callData,
      })
      starkLordsBalance.value = toBN(result[0]).div(toBN(10 ** 18))
    } catch (e) {
      console.log(e)
    }
  }
  const getRealmOwner = async (id) => {
    loading.realmOwner = true
    const realmsTokenAddress = starknetAddresses[networkId.value].realms.address
    console.log(getUint256CalldataFromBN(id))
    try {
      const { result } = await starknet.value.provider.callContract({
        contract_address: realmsTokenAddress, // to (erc20 contract)
        entry_point_selector: stark.getSelectorFromName('ownerOf'), // selector (mint)
        calldata: compileCalldata({
          token_id: getUint256CalldataFromBN(id),
        }),
      })
      return result[0]
    } catch (e) {
      console.log('error here')
      console.log(e)
    } finally {
      loading.realmOwner = false
    }
  }
  /* watch(starkRealms, () => {
    if (starkRealms.value) {
      localStorage.setItem(
        'starkRealms',
        starkRealms.value.map(String).toString()
      )
    }
  })

  onMounted(() => {
    if (starkRealms.value) {
      return
    }
    console.log(localStorage.getItem('starkRealms'))
    if (localStorage.getItem('starkRealms')) {
      starkRealms.value = localStorage
        .getItem('starkRealms')
        .split(',')
        .map(Number)
    }
  }) */

  return {
    result,
    mintToken,
    mintRealm,
    lordsSupply,
    starkLordsBalance,
    getLordsBalance,
    getRealmsBalance,
    getOwnersTokens,
    getRealmOwner,
    numberOfRealms,
    getLordsTotalSupply,
    starkRealms,
    loading,
  }
}
