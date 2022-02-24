import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import BigNumber from 'bignumber.js'
import { activeNetwork, useNetwork } from './useNetwork'
import { useRealms } from './useRealms'
import { useNotification } from '~/composables/useNotification'
import JourneyABI from '~/abi/Journey.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import balanceABI from '~/abi/balance.json'
import { useModal } from '~/composables/useModal'
import erc721tokens from '~/constant/erc721Tokens'
import contractAddresses from '~/constant/contractAddresses'

const totalRealmsStaked = ref()
const balance = ref()
const claimableBalance = ref()
const isApproved = ref(false)
export function useStaking() {
  const { close } = useModal()
  const { account, library } = useWeb3()
  const { getWalletRealms, userRealms } = useRealms()
  const { useL1Network } = useNetwork()
  const error = reactive({
    stake: null,
  })
  const { showError, showSuccess } = useNotification()
  const loading = reactive({
    stake: false,
    lords: false,
    approve: false,
  })
  const result = reactive({ stake: null })

  const epoch = ref(0)

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
      const journeyContractAddress =
        version === 'v2'
          ? contractAddresses[activeNetwork.value.id].carrackContractAddress
          : contractAddresses[activeNetwork.value.id].journeyContractAddress
      const provider = new ethers.providers.JsonRpcProvider(
        activeNetwork.value.url
      )
      const realmsContract = new ethers.Contract(
        realmsAddress,
        lootRealmsABI,
        provider
      )
      totalRealmsStaked.value[version] = await realmsContract.balanceOf(
        journeyContractAddress
      )
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
      claimableBalance.value[version] = await getClaimable(
        version,
        useL1Network.value,
        account.value
      )
    } catch (e) {
      // await showError('Staking Error', e.message, null)
      error.stake = e.message
    } finally {
      loading.lords = false
    }
  }
  const getEpoch = async (version) => {
    try {
      error.stake = null
      loading.stake = true
      const response = await getJourneyEpoch(version, useL1Network.value)
      epoch.value[version] = response.toNumber()
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
            image: 'https://bibliothecadao.xyz/lords-icon.png', // A string url of the token logo
          },
        },
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
    isLordsAdded,
  }
}

async function getTimeUntilEpoch(version, network) {
  const provider = new ethers.providers.JsonRpcProvider(network.url)

  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress

  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    provider
  )
  const t = await journeyContract.getTimeUntilEpoch()
  return t
}

async function stake(version, realmIds, network, library) {
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
async function getApproval(version, owner, network, library) {
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

async function setApprovalForAllRealms(version, owner, network, library) {
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

async function getBalance(network, account) {
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

async function getJourneyEpoch(version, network) {
  const provider = new ethers.providers.JsonRpcProvider(network.url)
  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress

  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    provider
  )
  const epoch = await journeyContract.getEpoch()
  return epoch
}

async function getClaimable(version, network, account) {
  const provider = new ethers.providers.JsonRpcProvider(network.url)
  const journeyContractAddress =
    version === 'v2'
      ? contractAddresses[network].carrackContractAddress
      : contractAddresses[network].journeyContractAddress
  const journeyContract = new ethers.Contract(
    journeyContractAddress,
    JourneyABI.abi,
    provider
  )

  const tokenBalances = await journeyContract.lordsAvailable(account)
  return ethers.utils.formatEther(tokenBalances)
}

async function claimAll(version, network, library) {
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
async function unStakeAndExit(version, network, realmIds, library) {
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
