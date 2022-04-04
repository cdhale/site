import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import BigNumber from 'bignumber.js'
import EthDater from 'ethereum-block-by-date'
import { activeNetwork, useNetwork } from './useNetwork'
import { useRealms } from './useRealms'
import { getWalletAtBlock } from './graphql/queries'
import { useNotification } from '~/composables/useNotification'
import JourneyABI from '~/abi/Journey.json'
import Journey2ABI from '~/abi/Journey2.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import balanceABI from '~/abi/balance.json'
import { useModal } from '~/composables/useModal'
import erc721tokens from '~/constant/erc721Tokens'
import contractAddresses from '~/constant/contractAddresses'
import { useGraph } from '~/composables/useGraph'

const totalRealmsStaked = ref()
const balance = ref()
const claimableBalance = ref()
const claimableV2Balance = ref()
const isApproved = ref(false)

export function useStaking () {
  const unclaimableBalance = ref()

  const { gqlRequest } = useGraph()
  const { close } = useModal()
  const { account, library } = useWeb3()
  const { getWalletRealms, userRealms } = useRealms()
  const { useL1Network } = useNetwork()
  const error = reactive({
    stake: null
  })
  const { showError, showSuccess } = useNotification()
  const loading = reactive({
    stake: false,
    lords: false,
    approve: false,
    unclaimableBalance: false
  })
  const result = reactive({ stake: null })

  const epoch = reactive({
    v1: 0,
    v2: null
  })
  const getApproved = async (version) => {
    try {
      const response = await getApproval(
        version,
        account.value,
        activeNetwork.value.id,
        library
      )

      if (response) {
        isApproved.value = true
      }
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  const approve = async (version) => {
    try {
      loading.approve = true
      const response = await setApprovalForAllRealms(
        version,
        account.value,
        activeNetwork.value.id,
        library
      )

      if (response) {
        isApproved.value = true
      }
    } catch (e) {
      await showError('Staking Error')
      error.stake = e.message
    } finally {
      loading.approve = false
    }
  }
  const stakeRealms = async (version, realmIds) => {
    try {
      error.stake = null
      loading.stake = true

      await setApprovalForAllRealms(
        version,
        account.value,
        activeNetwork.value.id,
        library
      )
      const realmsStaked = await stake(
        version,
        realmIds,
        useL1Network.value.id,
        library
      )
      const convertedRealms = realmsStaked.map((x) => {
        return x.toString()
      })
      const realms = userRealms.value.l1.realms
      for (let i = 0; i < convertedRealms.length; i++) {
        for (let j = 0; j < realms.length; j++) {
          if (realms[j].id === convertedRealms[i]) {
            realms.splice(j, 1)
            userRealms.value.l1.bridgedRealms.push(realms[j])
          }
        }
      }
      userRealms.value.l1.realms = realms
      userRealms.value.l1.wallet.bridgedRealmsHeld =
        +userRealms.value.l1.wallet.bridgedRealmsHeld + convertedRealms.length
      userRealms.value.l1.wallet.realmsHeld =
        +userRealms.value.l1.wallet.realmsHeld - convertedRealms.length

      const body = 'Successfully staked Realms: ' + realmsStaked
      showSuccess('Realm staked', body)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
      close()
      await resetState(version)
    }
  }
  const getTotalRealmsStaked = async (version) => {
    try {
      const realmsAddress = erc721tokens[activeNetwork.value.id].realms.address
      const carrackContractAddress =
        contractAddresses[activeNetwork.value.id].carrackContractAddress
      const journeyContractAddress =
        contractAddresses[activeNetwork.value.id].journeyContractAddress
      const provider = new ethers.providers.JsonRpcProvider(
        activeNetwork.value.url
      )
      const realmsContract = new ethers.Contract(
        realmsAddress,
        lootRealmsABI,
        provider
      )

      const carrack = await realmsContract.balanceOf(carrackContractAddress)

      const galleon = await realmsContract.balanceOf(journeyContractAddress)

      totalRealmsStaked.value = parseInt(carrack) + parseInt(galleon)
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const getLordsBalance = async () => {
    try {
      error.stake = null
      loading.lords = true
      const balanceResponse = await getBalance(
        useL1Network.value,
        account.value
      )

      balance.value = new BigNumber(balanceResponse)
        .dividedBy(10 ** 18)
        .toFixed()
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.lords = false
    }
  }
  const getClaimableLordsBalance = async (version) => {
    try {
      error.stake = null
      loading.lords = true
      if (version === 'v2') {
        claimableV2Balance.value = await getClaimable(
          version,
          useL1Network.value,
          account.value
        )
      } else {
        claimableBalance.value = await getClaimable(
          version,
          useL1Network.value,
          account.value
        )
      }
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.lords = false
    }
  }
  const getUnclaimableLordsBalance = async (params) => {
    loading.unclaimableBalance = true
    const provider = new ethers.providers.JsonRpcProvider(useL1Network.value.url)
    const today = new Date().getTime()
    const dater = new EthDater(
      provider // Ethers provider, required.
    )
    const startingEpochBlocks = await dater.getEvery(
      'weeks', // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
      '2022-02-24T11:04:29Z', // Start date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      today, // End date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      1, // Duration, optional, integer. By default 1.
      true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
      false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    )
    console.log(startingEpochBlocks)

    const getBridgedRealmsAtEpoch = async (epoch) => {
      const { wallet } = await gqlRequest(
        getWalletAtBlock,
        {
          address: params.address.toLowerCase(),
          block: epoch.block
        },
        'realms'
      )
      return wallet.bridgedRealmsHeld
    }

    // eslint-disable-next-line require-await
    const getData = async () => {
      return Promise.all(startingEpochBlocks.map(epoch => getBridgedRealmsAtEpoch(epoch)))
    }

    try {
      const epochData = await getData()
      let totalClaimable = 0
      for (let e = 1; e < epochData.length; e++) {
        const beginEpochRealms = epochData[e - 1]
        const endEpochRealms = epochData[e]

        if (endEpochRealms >= beginEpochRealms) {
          totalClaimable = totalClaimable + (epochData[e - 1] as number * 350)
        } else {
          totalClaimable = totalClaimable + (epochData[e] as number * 350)
        }
        console.log(totalClaimable)
      }
      unclaimableBalance.value = totalClaimable
    } catch (e) {
      console.log(e)
    }
    loading.unclaimableBalance = false
  }
  const getEpoch = async (version) => {
    try {
      error.stake = null
      loading.stake = true
      const response = await getJourneyEpoch(version, useL1Network.value)
      if (version === 'v2') {
        epoch.v2 = response.toNumber()
      } else {
        epoch.v1 = response.toNumber()
      }
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  const timeLeft = ref()
  const getTimeToNextEpoch = async (version) => {
    try {
      error.stake = null
      loading.stake = true
      const response = await getTimeUntilEpoch(version, useL1Network.value)
      timeLeft.value = response.toNumber()
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const claimAllLords = async (version) => {
    try {
      error.stake = null
      loading.lords = true
      await claimAll(version, useL1Network.value.id, library)
      showSuccess('Transaction Complete', 'All Lords claimed')
    } catch (e) {
      await showError('Claiming Error')
      error.stake = e.message
    } finally {
      await resetState(version)
      loading.lords = false
    }
  }

  const unstake = async (version, realmIds) => {
    try {
      error.stake = null
      loading.stake = true
      await unStakeAndExit(version, activeNetwork.value.id, realmIds, library)
      return setTimeout(() => {
        getWalletRealms()
      }, 4500)
    } catch (e) {
      await showError('Unstaking Error')
      error.stake = e.message
    } finally {
      loading.stake = false
      close()
      await resetState(version)
    }
  }
  const resetState = async (version) => {
    try {
      await getClaimableLordsBalance(version)
      await getLordsBalance()
      await getTotalRealmsStaked(version)
    } catch (e) {
      console.log(e)
    } finally {
      loading.stake = false
    }
  }

  const isLordsAdded = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          // @ts-ignore: Unreachable code error
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: contractAddresses[useL1Network.value.id].lordsTokenAddress, // The address that the token is at.
            symbol: 'LORDS', // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: 'https://bibliothecadao.xyz/lords-icon.png' // A string url of the token logo
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return {
    stakeRealms,
    claimAllLords,
    getEpoch,
    getTimeToNextEpoch,
    getLordsBalance,
    getClaimableLordsBalance,
    getUnclaimableLordsBalance,
    unclaimableBalance,
    claimableV2Balance,
    getApproved,
    approve,
    isApproved,
    totalRealmsStaked,
    getTotalRealmsStaked,
    epoch,
    balance,
    claimableBalance,
    error,
    loading,
    result,
    timeLeft,
    unstake,
    isLordsAdded
  }
}

async function getTimeUntilEpoch (version, network) {
  const provider = new ethers.providers.JsonRpcProvider(network.url)

  const journeyContractAddress =
    contractAddresses[network.id].carrackContractAddress

  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    provider
  )
  console.log(provider)
  console.log(journeyContract)
  const t = await journeyContract.getTimeUntilEpoch()
  console.log(t)
  return t
}

async function stake (version, realmIds, network, library) {
  const signer = library.value.getSigner()

  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress

  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    signer
  )
  const stake = await journeyContract.boardShip(realmIds)
  const receipt = await stake.wait()
  const event = receipt.events[receipt.events.length - 1]

  return event.args[0]
}
// TODO: make generic
async function getApproval (version, owner, network, library) {
  const realmsAddress = erc721tokens[activeNetwork.value.id].realms.address
  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress
  const signer = library.value.getSigner()
  const realmsContract = new ethers.Contract(
    realmsAddress,
    lootRealmsABI,
    signer
  )
  const journeyApproved = await realmsContract.isApprovedForAll(
    owner,
    journeyContractAddress
  )
  if (journeyApproved) {
    return true
  } else {
    return false
  }
}

async function setApprovalForAllRealms (version, owner, network, library) {
  const realmsAddress = erc721tokens[activeNetwork.value.id].realms.address

  const signer = library.value.getSigner()
  const realmsContract = new ethers.Contract(
    realmsAddress,
    lootRealmsABI,
    signer
  )
  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress

  const journeyApproved = await realmsContract.isApprovedForAll(
    owner,
    journeyContractAddress
  )
  if (journeyApproved) {
    return true
  }
  const approve = await realmsContract.setApprovalForAll(
    journeyContractAddress,
    true
  )
  const receipt = await approve.wait()
  return receipt
}

async function getBalance (network, account) {
  const provider = new ethers.providers.JsonRpcProvider(network.url)
  const lordsTokenAddress = contractAddresses[network.id].lordsTokenAddress

  const lordsContract = new ethers.Contract(
    lordsTokenAddress,
    balanceABI,
    provider
  )
  const tokenBalances = await lordsContract.balanceOf(account)

  return ethers.utils.formatEther(tokenBalances)
}

async function getJourneyEpoch (version, network) {
  const provider = new ethers.providers.JsonRpcProvider(network.url)
  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network.id].carrackContractAddress
      : contractAddresses[network.id].journeyContractAddress

  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    provider
  )
  const epoch = await journeyContract.getEpoch()
  return epoch
}

async function getClaimable (version, network, account) {
  console.log(network)
  const provider = new ethers.providers.JsonRpcProvider(network.url)

  const abi = version === 'v2' ? Journey2ABI.abi : JourneyABI.abi

  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network.id].carrackContractAddress
      : contractAddresses[network.id].journeyContractAddress

  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    abi,
    provider
  )
  let tokenBalances
  if (version === 'v2') {
    const t = await journeyContract.lordsAvailable(account)
    tokenBalances = t[0]
  } else {
    tokenBalances = await journeyContract.lordsAvailable(account)
  }

  return ethers.utils.formatEther(tokenBalances)
}

async function claimAll (version, network, library) {
  const signer = library.value.getSigner()

  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress
  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    signer
  )

  const withdraw = await journeyContract.claimLords()

  await withdraw.wait()

  return withdraw
}
async function unStakeAndExit (version, network, realmIds, library) {
  const signer = library.value.getSigner()

  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress
  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    signer
  )

  const withdraw = await journeyContract.exitShip(realmIds)

  const receipt = await withdraw.wait()
  return receipt
}
