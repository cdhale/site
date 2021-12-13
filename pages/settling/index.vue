<template>
  <section class="text-off-200">
    <div class="container mx-auto text-center">
      <h1 class="text-3xl sm:text-6xl capitalize font-semibold sm:mt-20">
        The great journey has begun.
      </h1>
      <p class="text-2xl sm:text-4xl">Lords, it's time to board the Galleon.</p>
    </div>
    <div class="flex flex-wrap">
      <div class="sm:w-1/2 p-2 sm:p-10 my-10 self-center font-semibold">
        <p class="text-xl sm:text-3xl leading-normal my-2">
          <span class="">Settling of the Realms</span>
          is an open source MMOCCG (Massively Multiplayer On-Chain Composable
          Game) of economics and Chivalry built on-top of ZK-STARKS (StarkNet).
          <br />
        </p>
        <p class="text-xl sm:text-3xl leading-normal my-8">
          Board the ship now for the promised zero-knowledge proofed land and be
          rewarded in $LORDS. The token of the Realmverse.
          <br />
        </p>
      </div>
      <div class="sm:w-1/2 my-10">
        <img class="mx-auto w-full" src="~/assets/img/hand.svg" alt="" />
      </div>
    </div>
    <div
      id="stake"
      class="flex flex-wrap justify-center text-center container mx-auto"
    >
      <div class="p-2 sm:w-1/2 w-full">
        <BaseBox>
          <h1 class="text-center">Your Unstaked Realms</h1>
          <p>
            You need to be staked for an entire epoch to be entitled to your
            Lords
          </p>
          <p class="text-6xl my-auto">{{ numberRealms || 0 }}</p>
          <BButton
            v-if="!account"
            class="w-full mt-auto"
            type="settling"
            @click="open"
            >Connect Account</BButton
          >
          <BButton
            v-else
            class="w-full mt-auto"
            type="settling"
            :disabled="numberRealms == 0"
            @click="stakeRealms"
            >Board the Ship (stake)</BButton
          >
        </BaseBox>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <BaseBox>
          <h1>Your Staked Realms</h1>
          <p class="text-6xl my-auto">
            {{ bridgedRealms || 0 }}
          </p>
          <BButton
            v-if="!account"
            class="w-full mt-auto"
            type="settling"
            @click="open"
            >Connect Account</BButton
          >
          <BButton
            v-else
            class="w-full mt-auto"
            type="settling"
            @click="unstakeRealms"
            >Leave Ship (unstake)</BButton
          >
        </BaseBox>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <BaseBox>
          <h1>Your Lords Available To Claim</h1>
          <p>You will earn 625 per Realm per full epoch staked</p>
          <p class="text-6xl mx-auto my-auto">
            <LoadingRings
              v-if="loading.lords"
              class="mx-auto fill-none stroke-current text-off-200 w-32"
            />
            <span v-else>{{ claimableBalance || 0 }}</span>
          </p>
          <BButton
            v-if="!account"
            class="w-full mt-auto"
            type="settling"
            @click="open"
            >Connect Account</BButton
          >
          <BButton
            v-else
            class="w-full mt-auto"
            type="settling"
            :disabled="claimableBalance == '0'"
            @click="claimAllLords"
            >Claim Lords</BButton
          >
        </BaseBox>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <BaseBox>
          <h1>Current Epoch</h1>
          <p>An epoch is 1 week</p>
          <p class="text-6xl text-center my-auto">{{ epoch }}</p>
          <no-ssr>
            <vac
              v-if="timeLeft"
              class="text-center"
              :end-time="new Date().getTime() + timeLeft * 1000"
            >
              <span slot="process" slot-scope="{ timeObj }">{{
                `Time Left in Epoch: ${timeObj.d} days ${timeObj.h} hrs ${timeObj.m} mins ${timeObj.s} seconds`
              }}</span>
            </vac>
          </no-ssr>
        </BaseBox>
      </div>
      <div class="p-2 w-full">
        <BaseBox>
          <h1>Total Realms Staked</h1>
          <span class="text-6xl flex mx-auto">
            <LoadingRings
              v-if="!totalRealmsStaked"
              class="fill-none stroke-current text-off-200 self-center"
            />
            <span v-else class="mr-8">{{ totalRealmsStaked }}</span> /
            8000</span
          >
        </BaseBox>
      </div>
    </div>
    <div id="faqs" class="container mx-auto sm:w-1/2 my-20">
      <h1 class="text-center">FAQs</h1>
      <Accordion v-for="(faq, index) in faqs" :key="index">
        <template #header> {{ faq.title }} </template>
        <template #body> <p v-html="faq.body"></p> </template>
      </Accordion>
    </div>
    <div id="roadmap" class="container mx-auto sm:w-1/2 my-20">
      <RoadMap />
    </div>
  </section>
</template>
<script>
import { useWeb3 } from '@instadapp/vue-web3'
import {
  defineComponent,
  onMounted,
  watch,
  computed,
} from '@nuxtjs/composition-api'
import { useModal } from '~/composables/useModal'
import { useNetwork, activeNetworkId } from '~/composables/useNetwork'
import { useRealms } from '~/composables/useRealms'
import { useStaking } from '~/composables/useStaking'
import JourneySettling from '~/components/modal/JourneySettling.vue'
import { useWeb3Modal } from '~/composables/useWeb3Modal'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'

export default defineComponent({
  components: {
    LoadingRings,
  },
  layout: 'settling',
  setup() {
    const { getWalletRealms, userRealms } = useRealms()
    const { account } = useWeb3()
    const { open } = useWeb3Modal()
    const { checkForNetworkMismatch, networkMismatch, useL1Network } =
      useNetwork()
    const {
      claimableBalance,
      loading,
      getClaimableLordsBalance,
      getEpoch,
      epoch,
      getTimeToNextEpoch,
      claimAllLords,
      timeLeft,
      getTotalRealmsStaked,
      totalRealmsStaked,
    } = useStaking()
    const { showComponent } = useModal()

    onMounted(async () => {
      activeNetworkId.value = useL1Network.value.id
      if (account.value) {
        if (networkMismatch.value) {
          checkForNetworkMismatch()
        }
        await getWalletRealms(account.value)
      }
      await getClaimableLordsBalance()
      await getEpoch()
      await getTimeToNextEpoch()
      await getTotalRealmsStaked()
    })
    const stakeRealms = () => {
      showComponent(JourneySettling, {
        type: 'stake',
      })
    }
    const unstakeRealms = () => {
      showComponent(JourneySettling, {
        type: 'unstake',
      })
    }
    const numberRealms = computed(() => {
      return userRealms.value.l1?.wallet?.realmsHeld
    })
    const bridgedRealms = computed(() => {
      return userRealms.value.l1?.wallet?.bridgedRealmsHeld
    })
    watch(
      account,
      async (val) => {
        if (val) {
          await getClaimableLordsBalance()
          await getWalletRealms(account.value)
          await getTotalRealmsStaked()
          if (networkMismatch.value) {
            checkForNetworkMismatch()
          }
        }
      },
      {
        immediate: true,
      }
    )
    const faqs = [
      {
        title: 'What does this staking contract do?',
        body: 'By boarding the ship now, you can begin to earn $LORDS. Once the StarkNet bridge is complete, your Realms will be available to claim directly on StarkNet. ',
      },
      {
        title: 'How long do I need to be staked for to be entitled?',
        body: 'You need to be staked for one entire epoch to be entitled to your $LORDS.',
      },
      {
        title: 'How long will the Journey last for?',
        body: 'Until the StarkNet bridge is complete, the Journey will happen for a minimum 10 weeks. You can withdraw when your balance is above 0.',
      },
      {
        title: 'What are Realms?',
        body: 'Realms are mythical maps of the Lootverse. Every realm has been procedurally generated and is unique down to the language. Each realm has a map showing the regions, cities, rivers and topography that exist in the world. Resource deposits and exclusive Wonders can be found in each realm with varying rarity, and each belongs to one of the 16 Loot Orders.',
      },
      {
        title: 'The $LORDS Token',
        body: 'The $LORDS token is the utility token of the Realmsverse, used to transact on marketplaces on StarkNet. There will be a native StarkNet marketplace for trading Realms along with an AMM (Uniswap style) for trading the resources generated. Both marketplaces will be denominated in $LORDS. Read the full tokenomics breakdown here: <a class="font-semibold underline" href="https://docs.bibliothecaforloot.com/economics/lords">$LORDS Tokenomics</a>',
      },
      {
        title: 'Why is settling all on-chain?',
        body: 'All game activity will be on-chain, this means no central servers and no central backend. This allows the game assets to be composed and used in other games within the Realmverse, with no reliance on a central entity for their ongoing use. ',
      },
      {
        title: 'What is StarkNet?',
        body: "StarkNet is a ZK-Rollup Layer 2 network. It allows for extreme computation and cheap transaction costs, without sacrificing the security of your assets. The Bibliotheca team is building one of the world's first fully on-chain game on a ZK-Rollup. You will be able to trade with speed and with little fees.",
      },
      {
        title: 'Community Driven - The Bibliotheca DAO',
        body: 'Settling of the Realms is goverened by the Realm Lords under the Bibliotheca DAO. Game direction, testing and feedback is all directed by the community. There is core a team of developers building the game, however all code is open source and we encourage outside contributors.',
      },
      {
        title: 'Can I audit your Contracts?',
        body: 'Yes! Find them here. <br> <a class="font-semibold underline" href="https://etherscan.io/address/0x686f2404e77ab0d9070a46cdfb0b7fecdd2318b0">$LORDS</a><br> <a class="font-semibold underline" href="https://etherscan.io/address/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d">Realms</a><br> <a class="font-semibold underline" href="https://etherscan.io/address/0x17963290db8c30552d0cfa2a6453ff20a28c31a2#code">Journey</a>',
      },
    ]

    return {
      faqs,
      account,
      open,
      loading,
      epoch,
      userRealms,
      bridgedRealms,
      claimableBalance,
      numberRealms,
      fetch,
      stakeRealms,
      unstakeRealms,
      claimAllLords,
      timeLeft,
      getTotalRealmsStaked,
      totalRealmsStaked,
    }
  },
})
</script>
