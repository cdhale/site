<template>
  <section class="text-off-200">
    <div class="container mx-auto text-center">
      <h1 class="text-3xl font-semibold capitalize sm:text-6xl sm:mt-20">
        The great journey has begun.
      </h1>
      <p class="text-2xl sm:text-4xl">Lords, it's time to board the Galleon.</p>
    </div>
    <div class="flex flex-wrap">
      <div class="self-center p-2 my-10 font-semibold sm:w-1/2 sm:p-10">
        <p class="my-2 text-xl leading-normal sm:text-3xl">
          <span class="">Settling of the Realms</span>
          is an open source MMOCCG (Massively Multiplayer On-Chain Composable
          Game) of economics and Chivalry built on-top of ZK-STARKS (StarkNet).
          <br />
        </p>
        <p class="my-8 text-xl leading-normal sm:text-3xl">
          Board the ship now for the promised zero-knowledge proofed land and be
          rewarded in $LORDS. The token of the Realmverse.
          <br />
        </p>
      </div>
      <div class="my-10 sm:w-1/2">
        <img class="w-full mx-auto" src="~/assets/img/hand.svg" alt="" />
      </div>
    </div>
    <div
      class="
        container
        flex flex-wrap
        p-4
        mx-auto
        text-2xl text-center text-white
        font-display
      "
    >
      <div class="flex w-1/2 p-2">
        <button
          :class="{ 'bg-off-200 text-off-100 border-off-100': tab === 'A' }"
          class="
            w-full
            p-4
            border-4 border-double
            rounded
            text-off-200
            border-off-200
            hover:bg-off-200 hover:text-off-100
          "
          @click="tab = 'A'"
        >
          Galleon v1
        </button>
      </div>
      <div class="flex w-1/2 p-2">
        <button
          :class="{ 'bg-off-200 text-off-100 border-off-100': tab === 'B' }"
          class="
            w-full
            p-4
            border-4 border-double
            rounded
            text-off-200
            border-off-200
            hover:bg-off-200 hover:text-off-100
          "
          @click="tab = 'B'"
        >
          Carrack v2
        </button>
      </div>
    </div>
    <div
      id="stake"
      class="container flex flex-wrap justify-center mx-auto text-center"
    >
      <div
        v-if="tab === 'A'"
        class="container flex flex-wrap justify-center mx-auto text-center"
      >
        <div class="w-full mx-auto my-8">
          <h1 class="w-full">The Galleon (V1 Staking)</h1>
          <p class="sm:text-2xl">
            <span class="font-semibold">Rewards:</span> 350x $LORDS per epoch (a
            bonus of 12%). <br />
            <span class="font-semibold">Length: </span>5 epochs (11-15). <br />
            <span class="font-semibold">Claiming $LORDS:</span> You must claim
            directly on StarkNet once migrated (not weekly). <br /><span
              class="font-semibold"
              >Rewards Eligibility:</span
            >
            You will be rewarded for every full epoch staked. <br />
        </div>

        <div v class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1 class="text-center">Your Unstaked Realms</h1>
            <p>
              You need to be staked for an entire epoch to be entitled to your
              Lords
            </p>
            <p class="my-auto text-6xl">{{ numberRealms || 0 }}</p>
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
        <div class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1>Your Staked Realms</h1>
            <p class="my-auto text-6xl">
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
        <div class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1>Your Lords Available To Claim</h1>
            <p>
              You earn 350x $LORDS per Realm per full staked epoch (claimable on
              StarkNet after epoch 15)
            </p>
            <p class="mx-auto my-auto text-6xl">
              <LoadingRings
                v-if="loading.lords"
                class="w-32 mx-auto stroke-current fill-none text-off-200"
              />
              <span v-else>{{ claimableBalance }}</span>
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
            <div class="w-full mt-2">
              <span class="cursor-pointer hover:underline" @click="isLordsAdded"
                >Add LORDS to MetaMask</span
              >
            </div>
          </BaseBox>
        </div>
        <div class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1>Current Epoch</h1>
            <p>An epoch is 1 week</p>
            <p class="my-auto text-6xl text-center">{{ epoch.v1 }}</p>
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
      </div>
      <div
        v-if="tab === 'B'"
        class="container flex flex-wrap justify-center mx-auto text-center"
      >
        <div class="w-full mx-auto my-8">
          <h1 class="w-full">The Carrack (V2 Staking)</h1>
          <div class="py-4 my-4 text-2xl underline">
            <no-ssr>
              <vac class="text-center" :end-time="1645923897 * 1000">
                <span slot="process" slot-scope="{ timeObj }">{{
                  `Grace Period: ${timeObj.d} days ${timeObj.h} hrs ${timeObj.m} mins ${timeObj.s} seconds`
                }}</span>
              </vac>
            </no-ssr>
          </div>
          <p class="sm:text-2xl">
            <span class="font-semibold">Rewards:</span> 312.5x $LORDS per epoch.
            <br />
            <span class="font-semibold">Length: </span>5 epochs (11-15). <br />
            <span class="font-semibold">Claiming $LORDS:</span>You can claim
            $LORDS immediately after each fully staked epoch.<br /><span
              class="font-semibold"
              >Rewards Eligibility:</span
            >
            You will be rewarded for every full epoch staked.<br />
        </div>
        <div v class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1 class="text-center">Your Unstaked Realms</h1>
            <p>
              You need to be staked for an entire epoch to be entitled to your
              Lords
            </p>
            <p class="my-auto text-6xl">{{ numberRealms || 0 }}</p>
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
              @click="stakeRealms('v2')"
              >Board the Ship (stake)</BButton
            >
          </BaseBox>
        </div>
        <div class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1>Your Staked Realms</h1>
            <p class="my-auto text-6xl">
              {{ bridgedV2Realms || 0 }}
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
              @click="unstakeRealms('v2')"
              >Leave Ship (unstake)</BButton
            >
          </BaseBox>
        </div>
        <div class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1>Your Lords Available To Claim</h1>
            <p>
              You earn 312.5x $LORDS per Realm per full staked epoch (claimable
              weekly)
            </p>
            <!-- <p class="mx-auto my-auto text-6xl">
              <LoadingRings
                v-if="loading.lords"
                class="w-32 mx-auto stroke-current fill-none text-off-200"
              />
              <span v-else>{{ claimableV2Balance }}</span>
            </p> -->
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
              :disabled="claimableV2Balance == '0'"
              @click="claimAllLords('v2')"
              >Claim Lords</BButton
            >
            <div class="w-full mt-2">
              <span class="cursor-pointer hover:underline" @click="isLordsAdded"
                >Add LORDS to MetaMask</span
              >
            </div>
          </BaseBox>
        </div>
        <div class="w-full p-2 sm:w-1/2">
          <BaseBox class="h-80">
            <h1>Current Epoch</h1>
            <p>An epoch is 1 week</p>
            <p class="my-auto text-6xl text-center">{{ epoch.v2 + 10 }}</p>
            <no-ssr>
              <vac
                v-if="timeLeft"
                class="text-center"
                :end-time="new Date().getTime() + timeLeftV2 * 1000"
              >
                <span slot="process" slot-scope="{ timeObj }">{{
                  `Time Left in Epoch: ${timeObj.d} days ${timeObj.h} hrs ${timeObj.m} mins ${timeObj.s} seconds`
                }}</span>
              </vac>
            </no-ssr>
          </BaseBox>
        </div>
      </div>
      <div class="w-full p-2">
        <BaseBox>
          <h1>Total Realms Staked</h1>
          <span class="flex mx-auto text-2xl sm:text-6xl">
            <LoadingRings
              v-if="!totalRealmsStaked"
              class="self-center stroke-current fill-none text-off-200"
            />
            <span v-else class="mr-8">{{ totalRealmsStaked }} </span> /
            8000</span
          >
        </BaseBox>
      </div>
      <div class="hidden w-full p-2 sm:block">
        <BaseBox>
          <h1>The Kings' LP Rewards</h1>
          <p class="text-2xl">
            Provide your UniSwap V3 position and be rewarded in LORDS. <br />
            10,000 LORDS are distributed per day to in-range positions
          </p>
          <p>
            IMPORTANT NOTE: You will only earn rewards if your Position is
            within range.
          </p>
          <div v-if="userRewards != '0.0'" class="my-6 font-display">
            <h3>Claimable LORDS</h3>
            <span class="text-3xl">{{ userRewards }}</span>
            <div class="flex justify-center mx-auto mt-4 space-x-4">
              <BButton
                :loading="loadingIncentive.claim"
                type="settling"
                @click="claim()"
                >Claim</BButton
              >
            </div>
          </div>
          <div
            v-if="userPositions && v1PositionsFilter.length"
            class="flex flex-wrap w-full mx-auto mt-8"
          >
            <h2 v-if="poolIncentives[0]" class="text-center">
              Program V1 - Ending
              <span class="text-lg">{{
                new Date(poolIncentives[0].endTime * 1000 || 0).toLocaleString()
              }}</span>
            </h2>
            <table class="w-full py-4 mx-auto table-auto">
              <thead>
                <tr class="pt-4 text-2xl text-center font-display">
                  <th>LP Token ID</th>
                  <th>Status</th>
                  <th>LORDS</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <LpTable
                  v-for="position in v1PositionsFilter"
                  :key="position.id"
                  :position="position"
                />
              </tbody>
            </table>
            <p class="my-4">
              To claim the Lords, first unstake your position, then click the
              Claim button.
            </p>
          </div>

          <div
            v-if="userPositions && userPositions.length"
            class="flex flex-wrap w-full mx-auto mt-8"
          >
            <h2 v-if="poolIncentives[1]" class="text-center">
              Program V2 - Ending
              <span class="text-lg">{{
                new Date(poolIncentives[1].endTime * 1000 || 0).toLocaleString()
              }}</span>
            </h2>
            <table class="w-full py-4 mx-auto table-auto">
              <thead>
                <tr class="pt-4 text-2xl text-center font-display">
                  <th>LP Token ID</th>
                  <th>Status</th>
                  <th>LORDS</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <LpTable
                  v-for="position in userPositions"
                  :key="position.id"
                  stake-button
                  :position="position"
                />
              </tbody>
            </table>
          </div>
          <div v-else class="my-6">
            <p class="text-3xl">You do not have any LP positions.</p>
          </div>
          <p v-if="userPositions && userPositions.length" class="my-4">
            To claim the Lords, first unstake your position, then click the
            Claim button.
          </p>
        </BaseBox>
      </div>
    </div>
    <div id="faqs" class="container mx-auto my-20 sm:w-1/2">
      <h1 class="text-center">FAQs</h1>
      <Accordion v-for="(faq, index) in faqs" :key="index">
        <template #header> {{ faq.title }} </template>
        <template #body> <p v-html="faq.body"></p> </template>
      </Accordion>
    </div>
    <div id="roadmap" class="container mx-auto my-20 sm:w-1/2">
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
  ref,
} from '@nuxtjs/composition-api'
import { useModal } from '~/composables/useModal'
import { useNetwork, activeNetworkId } from '~/composables/useNetwork'
import { useRealms } from '~/composables/useRealms'
import { useStaking } from '~/composables/useStaking'
import { useIncentive } from '~/composables/useIncentive'
import JourneySettling from '~/components/modal/JourneySettling.vue'
import { useWeb3Modal } from '~/composables/useWeb3Modal'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'

export default defineComponent({
  components: {
    LoadingRings,
  },
  layout: 'settling',

  setup() {
    const tab = ref('A')
    const { getWalletRealms, userRealms } = useRealms()
    const { account } = useWeb3()
    const { open } = useWeb3Modal()
    const {
      rewardInfo,
      lpPositions,
      getLp,
      withdraw,
      deposit,
      getRewards,
      userRewards,
      claim,
      fetchUserPositions,
      userPositions,
      loading: loadingIncentive,
      getIncentivesForPool,
      poolIncentives,
    } = useIncentive()
    const { checkForNetworkMismatch, networkMismatch, useL1Network } =
      useNetwork()
    const {
      claimableBalance,
      claimableV2Balance,
      loading,
      getClaimableLordsBalance,
      getEpoch,
      epoch,
      getTimeToNextEpoch,
      claimAllLords,
      timeLeft,
      getTotalRealmsStaked,
      totalRealmsStaked,
      isLordsAdded,
    } = useStaking()
    const { showComponent } = useModal()

    const v1PositionsFilter = computed(() => {
      return (
        userPositions.value &&
        userPositions.value.filter(
          (a) => a.staked && a.incentivePositions.length === 1
        )
      )
    })
    onMounted(async () => {
      activeNetworkId.value = useL1Network.value.id
      await getIncentivesForPool()

      if (account.value) {
        if (networkMismatch.value) {
          checkForNetworkMismatch()
        }
        await getWalletRealms({ address: account.value, first: 1000 })
      }

      await getRewards()
      await getClaimableLordsBalance()
      await getClaimableLordsBalance({ version: 'v2' })
      await getEpoch()
      await getEpoch('v2')
      await getTimeToNextEpoch()
      await getTimeToNextEpoch({ version: 'v2' })
      await getTotalRealmsStaked()

      // await isLordsAdded()
    })
    const stakeRealms = (version) => {
      showComponent(JourneySettling, {
        type: 'stake',
        version,
      })
    }
    const unstakeRealms = (version) => {
      showComponent(JourneySettling, {
        type: 'unstake',
        version,
      })
    }
    const numberRealms = computed(() => {
      return userRealms.value.l1?.wallet?.realmsHeld
    })
    const bridgedRealms = computed(() => {
      return userRealms.value.l1?.wallet?.bridgedRealmsHeld
    })
    const bridgedV2Realms = computed(() => {
      return userRealms.value.l1?.wallet?.bridgedV2RealmsHeld
    })
    watch(
      account,
      async (val) => {
        if (val) {
          await getRewards()
          await fetchUserPositions()
          await getClaimableLordsBalance()
          await getClaimableLordsBalance('v2')
          await getWalletRealms({ address: account.value, first: 1000 })
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
        body: 'By boarding the Galleon or Carrack now, you can begin to earn $LORDS. Once the StarkNet bridge is complete, your Realms will be available to claim directly on StarkNet.',
      },
      {
        title: 'What are the rewards?',
        body: 'Epoch 11-15: The Galleon 350x $LORDS for each Realm staked per epoch. The Carrack 312.5x $LORDS for each Realm staked per epoch.',
      },
      {
        title: 'What is the difference between the Galleon and Carrack?',
        body: 'You can claim rewards directly on mainnet after each epoch in the Carrack, while in the Galleon you must wait to claim them directly on StarkNet once the Journey (bridging) is complete.',
      },
      {
        title:
          'How long do you need to be staked for to be entitled to rewards?',
        body: 'You need to be staked for one entire epoch (7 days) to be entitled to your $LORDS. For example, if you stake at the end of epoch 2 and remain staked until epoch 4, you will receive the epoch 3 reward. ',
      },
      {
        title: 'Once staked, do you need to stake again for future epochs?',
        body: 'No, once you stake and remained staked, you’ll be entitled to all future epoch rewards (unless you unstake).',
      },
      {
        title: 'Why can’t I see my Realm(s) in OpenSea after staking?',
        body: 'Your realms won’t appear in OS while staking as they are transferred into the contract wallet in this process. You can view your staked Realms at your Adventurers page. ',
      },
      {
        title: 'Can I list/sell my Realms on OpenSea while staking?',
        body: 'No, during staking you can’t list/sell your Realms as they are in the contract wallet. If you wish to list/sell your Realms then you must first unstake them.',
      },
      {
        title:
          'How long will the Journey last for and what happens at epoch 16+?',
        body: 'The Journey will continue for a maximum of 15 epochs. If StarkNet is not ready by the end of epoch 15, rewards will be adjusted to the future gaming emissions amount (25x per day / 175x per week). If StarkNet is ready, gaming emissions (25x per day / 175x per week) will commence directly on layer 2.',
      },
      {
        title: 'Do you have to claim $LORDS after each epoch/on mainnet?',
        body: 'No, you can let rewards accrue and claim in bulk to save gas. If you wish to avoid claiming on L1 we will have a solution to migrate your $LORDS to StarkNet and claim there to save further gas.',
      },
      {
        title: 'What are Realms?',
        body: 'Realms are mythical maps of the Lootverse. Every realm has been procedurally generated and is unique down to the language. Each realm has a map showing the regions, cities, rivers and topography that exist in the world. Resource deposits and exclusive Wonders can be found in each realm with varying rarity, and each belongs to one of the 16 Loot Orders.',
      },
      {
        title: 'The $LORDS Token',
        body: 'The $LORDS token is the utility token of the Realmsverse, used to transact on marketplaces on StarkNet. There will be a native StarkNet marketplace for trading Realms along with an AMM (Uniswap style) for trading the resources generated. Both marketplaces will be denominated in $LORDS. Read the full tokenomics breakdown here: <a class="font-semibold underline" href="https://docs.bibliothecadao.xyz/lootverse-master-scroll/economics/lords-resources-and-more-fungibles">$LORDS Tokenomics</a>',
      },
      {
        title: 'Why is settling all on-chain?',
        body: 'All game activity will be on-chain, this means no central servers and no central backend. This allows the game assets to be composed and used in other games within the Realmverse, with no reliance on a central entity for their ongoing use.',
      },
      {
        title: 'What is StarkNet?',
        body: "StarkNet is a ZK-Rollup Layer 2 network. It allows for extreme computation and cheap transaction costs, without sacrificing the security of your assets. The Bibliotheca team is building one of the world's first fully on-chain games on a ZK-Rollup. You will be able to trade with speed and with little fees.",
      },
      {
        title: 'Community Driven - The Bibliotheca DAO',
        body: 'Settling of the Realms is governed by the Realm Lords under the Bibliotheca DAO. Game direction, testing and feedback are all directed by the community. There is a core team of developers building the game, however all code is open source and we encourage outside contributors.',
      },
      {
        title: 'Can I audit your Contracts?',
        body: 'Yes! Find them here. <br> <a class="font-semibold underline" href="https://etherscan.io/address/0x686f2404e77ab0d9070a46cdfb0b7fecdd2318b0">$LORDS</a><br> <a class="font-semibold underline" href="https://etherscan.io/address/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d">Realms</a><br> <a class="font-semibold underline" href="https://etherscan.io/address/0x17963290db8c30552d0cfa2a6453ff20a28c31a2#code">Journey</a><br> <a class="font-semibold underline" href="https://etherscan.io/address/0xcdFe3d7eBFA793675426F150E928CD395469cA53#code">Journey v2</a>',
      },
    ]

    return {
      faqs,
      account,
      poolIncentives,
      open,
      loading,
      epoch,
      userRealms,
      bridgedRealms,
      bridgedV2Realms,
      claimableBalance,
      numberRealms,
      claimableV2Balance,
      fetch,
      stakeRealms,
      unstakeRealms,
      claimAllLords,
      timeLeft,
      getTotalRealmsStaked,
      totalRealmsStaked,
      rewardInfo,
      lpPositions,
      getLp,
      withdraw,
      deposit,
      getRewards,
      userRewards,
      claim,
      fetchUserPositions,
      userPositions,
      loadingIncentive,
      isLordsAdded,
      v1PositionsFilter,
      tab,
    }
  },
})
</script>
