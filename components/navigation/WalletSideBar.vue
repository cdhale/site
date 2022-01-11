<template>
  <div
    class="
      border-off-200 border-double border-l-4
      rounded-tl-2xl
      bg-gray-900
      transform
      duration-300
      ease-in-out
      transition-all
      right-0
      z-20
    "
    :class="walletSideBarOpen ? '-translate-x-0' : 'translate-x-full'"
  >
    <div class="top-10 flex flex-col z-30 h-screen justify-between">
      <div class="flex flex-col p-4">
        <div class="flex w-full justify-end">
          <button @click="toggleWalletSideBar">
            <Close class="w-6 h-6" />
          </button>
        </div>
        <div class="flex justify-between">
          <h3>Your Treasury</h3>
          <span class="inline-block pt-2 text-sm">{{
            shortenHash(account[0])
          }}</span>
        </div>
        <div
          class="
            bg-black
            rounded-xl
            my-4
            py-2
            text-off-100
            hover:shadow-md
            flex flex-col
            shadow-sm
            group
            border-double border-4 border-off-200
            text-center
          "
        >
          <span class="text-sm w-full">Total Balance</span>
          <span class="text-lg">$254,353.42 USD</span>
          <span></span>
        </div>
        <div
          class="
            bg-black
            rounded-xl
            my-2
            py-2
            text-off-100
            hover:shadow-md
            flex
            shadow-sm
            group
            border border-4 border-off-200
            text-center
          "
        >
          <MainnetSVG class="h-6 w-6 m-2" />
          <div class="flex w-full justify-between">
            <div class="flex text-left flex-col">
              <span>ETH</span>
              <span class="text-sm">Ethereum</span>
            </div>
            <div class="flex text-right flex-col pr-4">
              <span>13.12</span>
              <span class="text-sm">$51,156</span>
            </div>
          </div>
        </div>
        <div
          class="
            bg-black
            rounded-xl
            my-2
            pt-2
            text-off-100
            hover:shadow-md
            shadow-sm
            group
            border border-4 border-off-200
            text-center
          "
        >
          <div class="flex">
            <MainnetSVG class="h-6 w-6 m-2" />
            <div class="flex w-full justify-between pb-2">
              <div class="flex text-left flex-col">
                <span>LORDS</span>
                <span class="text-sm">Lords Token</span>
              </div>
              <div class="flex text-right flex-col pr-4">
                <span>{{
                  starkLordsBalance ? starkLordsBalance.toFixed(2) : 0
                }}</span>
                <span class="text-sm"
                  >${{ (starkLordsBalance * lordsPrice).toFixed(2) }}</span
                >
              </div>
            </div>
          </div>
          <BButton
            class="
              border
              rounded
              pl-3
              py-2
              px-10
              mr-4
              text-center
              hover:bg-off-200 hover:text-off-100
              w-full
              border-off-200
              text-off-200
            "
            @click="mintToken('100')"
            >Get 100 $LORDS</BButton
          >
        </div>
        <div
          class="
            bg-black
            rounded-xl
            my-2
            pt-2
            text-off-100
            hover:shadow-md
            shadow-sm
            group
            border border-4 border-off-200
            text-center
          "
        >
          <div class="flex pb-2">
            <img
              src="https://storage.opensea.io/files/122f3d930bb508a5aab9d1ead9f6cbff.svg"
              class="h-12 w-12 mx-2"
            />
            <div class="flex w-full justify-between pl-1">
              <div class="flex text-left flex-col">
                <span>Realms</span>
                <span class="text-sm">NFT</span>
              </div>
              <div class="flex text-right flex-col pt-3 pr-4">
                <span>{{ numberOfRealms }}</span>
              </div>
            </div>
          </div>
          <BButton
            v-if="lordsAllowances.realms < 10"
            :disabled="loading.approved"
            class="
              border
              rounded
              pl-3
              py-2
              px-10
              mr-4
              text-center
              hover:bg-off-200 hover:text-off-100
              w-full
              border-off-200
              text-off-200
            "
            @click="setApproveLordsForRealms()"
            >Approve Lords</BButton
          >
          <BButton
            class="
              border
              rounded
              pl-3
              py-2
              px-10
              mr-4
              text-center
              hover:bg-off-200 hover:text-off-100
              w-full
              border-off-200
              text-off-200
            "
            :disabled="lordsAllowances.realms < 10"
            @click="mintTestRealm()"
            >Mint a Realm</BButton
          >
        </div>
      </div>
      <div class="flex border-t w-full border-off-200 flex-col p-4">
        <h4>Your Allowances</h4>
        <div class="flex justify-between">
          <span>Realm Minting:</span
          ><span>{{ lordsAllowances.realms }} $LORDS</span>
        </div>
        <div class="flex justify-between">
          <span>Marketplace Purchases:</span
          ><span>{{ lordsAllowances.marketplace }} $LORDS</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted } from '@nuxtjs/composition-api'
import { useLordsPrice, useUiState } from '~/composables'
import Close from '~/assets/img/x-square.svg?inline'
import { useStarknet } from '~/composables/useStarknet'
import { useArgent } from '~/composables/useArgent'
import { useFormatting } from '~/composables/useFormatting'
import MainnetSVG from '~/assets/icons/mainnet.svg?inline'
import { useMarketplace } from '~/composables/useMarketplace'

export default {
  name: 'WalletSideBar',
  components: {
    Close,
    MainnetSVG,
  },
  setup() {
    const { account } = useArgent()
    const {
      getLordsBalance,
      starkLordsBalance,
      mintToken,
      mintRealm,
      numberOfRealms,
      getRealmsBalance,
      getOwnersTokens,
      getLordsTotalSupply,
    } = useStarknet()
    const { lordsAllowances, setApproveLordsForRealms, loading, getApprovals } =
      useMarketplace()
    const { lordsPrice } = useLordsPrice()
    const { toggleWalletSideBar, walletSideBarOpen } = useUiState()
    const { shortenHash } = useFormatting()

    const random = (max) => {
      return Math.floor(Math.random() * max)
    }
    const mintTestRealm = async () => {
      const id = random(8000)
      console.log(id)
      await mintRealm(id)
    }

    onMounted(() => {
      getApprovals()
      fetchLordsBalance()
    })

    const fetchLordsBalance = () => {
      getOwnersTokens()
      getRealmsBalance()
      getLordsBalance()
      getLordsTotalSupply()
    }

    return {
      mintTestRealm,
      account,
      getLordsBalance,
      loading,
      setApproveLordsForRealms,
      starkLordsBalance,
      lordsAllowances,
      lordsPrice,
      mintToken,
      mintRealm,
      numberOfRealms,
      getRealmsBalance,
      toggleWalletSideBar,
      walletSideBarOpen,
      shortenHash,
    }
  },
}
</script>
