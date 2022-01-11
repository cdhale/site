import { getStarknet } from '@argent/get-starknet'
import { ref, watch, onBeforeUnmount, computed } from '@nuxtjs/composition-api'
import { shortString } from 'starknet'

const active = ref(false)
const account = ref([])
const starknet = ref()

export function useArgent() {
  // check if wallet extension is installed and initialized. Shows a modal prompting the user to download
  // ArgentX otherwise.
  const activate = async () => {
    console.log('got here')
    try {
      starknet.value = getStarknet({ showModal: true })
      account.value = await starknet.value.enable() // may throws when no extension is detected
    } catch {
      console.log('No Extension')
    }

    // check if connection was successful
    if (starknet.value.isConnected) {
      // If the extension was installed and successfully connected, you have access to a
      // starknet.js Signer object to do all kind of requests through the users wallet contract.
      active.value = true
    } else {
      console.log('connection failed')
    }
    return account.value
  }

  const addToken = async (address: string): Promise<void> => {
    const starknet = getStarknet()
    await starknet.enable()
    await starknet.request({
      type: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
        },
      },
    })
  }

  const signMessage = async (message: string) => {
    const starknet = getStarknet()
    await starknet.enable()

    // checks that enable succeeded
    if (starknet.isConnected === false)
      throw new Error('starknet wallet not connected')
    if (!shortString.isShortString(message)) {
      throw new Error('message must be a short string')
    }

    return starknet.signer.signMessage({
      domain: {
        name: 'Example DApp',
        chainId: networkId.value === 'mainnet-alpha' ? 'SN_MAIN' : 'SN_GOERLI',
        version: '0.0.1',
      },
      types: {
        StarkNetDomain: [
          { name: 'name', type: 'felt' },
          { name: 'chainId', type: 'felt' },
          { name: 'version', type: 'felt' },
        ],
        Message: [{ name: 'message', type: 'felt' }],
      },
      primaryType: 'Message',
      message: {
        message,
      },
    })
  }

  const networkId = computed(() => {
    try {
      const baseUrl = starknet.value.provider.baseUrl
      if (baseUrl.includes('alpha-mainnet.starknet.io')) {
        return 'mainnet-alpha'
      } else {
        return 'goerli-alpha'
      }
    } catch {
      return 'goerli-alpha'
    }
  })

  const getExplorerUrlBase = computed(() => {
    if (networkId.value === 'mainnet-alpha') {
      return 'https://voyager.online/'
    } else {
      return 'https://goerli.voyager.online/'
    }
  })

  const networkUrl = () => {
    try {
      return getStarknet().provider.baseUrl
    } catch {}
  }

  const waitForTransaction = async (hash) => {
    await getStarknet().provider.waitForTx(hash)
  }

  const handleUpdate = (update) => {
    console.log(update)
    account.value = update
  }

  watch(
    starknet,
    () => {
      if (starknet.value) {
        starknet.value.on('accountsChanged', handleUpdate)
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (starknet.value) {
      starknet.value.off('accountsChanged', handleUpdate)
    }
  })

  return {
    account,
    signMessage,
    addToken,
    active,
    activate,
    starknet,
    getExplorerUrlBase,
    networkId,
    networkUrl,
    waitForTransaction,
  }
}
