<template>
  <section class="w-full">
    <div class="text-center mx-auto">
      <h1>Settling of the Realms Roadmap</h1>
    </div>
    <div class="py-8 mx-auto">
      <div class="bg-gray-800 mx-auto text-off-100 p-8">
        <h2>Design philosophy and process</h2>
        <p class="text-2xl">
          Early development is steered by the Bibliotheca & Realms Team - but
          will be transitioned into DAO guidance in the future. Major
          functionality will be deployed on the Rinkeby testnet for the
          Adventurer community to test and give feedback before mainnet
          deployment.
        </p>
      </div>
    </div>
    <div class="flex flex-col space-y-8">
      <div
        class="
          text-2xl
          p-4
          bg-off-200
          border-4 border-double border-off-100
          mx-auto
          rounded-xl
          my-8
          flex flex-wrap
          justify-around
          w-full
        "
      >
        <span
          class="
            text-red-800
            bg-off-100
            border-off-200 border-4
            rounded-xl
            p-2
            px-4
          "
          >Open Beta</span
        >
        <span
          class="
            text-blue-800
            bg-off-100
            border-off-200 border-4
            rounded-xl
            p-2
            px-4
          "
          >Production</span
        >
      </div>
      <div
        v-for="(stage, index) in mapStages"
        :key="index"
        class="
          mx-auto
          p-8
          border-4 border-off-200 border-double
          hover:border-red
          transform
          hover:-translate-y-2 hover:bg-off-200 hover:text-off-100
          transition
          duration-150
          group
          cursor-pointer
          bg-off-100
        "
      >
        <div class="flex">
          <h5
            v-if="stage.betaTime"
            class="
              uppercase
              group-hover:text-white
              text-red-800
              mb-1
              tracking-widest
              mr-6
            "
          >
            {{ stage.betaTime }}
          </h5>
          <h5
            class="
              uppercase
              group-hover:text-white
              text-blue-800
              mb-1
              tracking-widest
              flex
            "
          >
            {{ stage.prodTime }}
          </h5>
        </div>
        <h2>{{ stage.title }}</h2>
        <p class="text-2xl group-hover:text-white text-gray-700">
          {{ stage.description }}
        </p>
      </div>
    </div>
  </section>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const mapStages = [
      {
        betaTime: '',
        prodTime: 'December 2021',
        title: 'Starknet Bridge & Staking',
        description:
          'The journey commences with a bridge to the Layer 2 network - Starknet. To reward early Realm Lords, a joint Staking contract is being built where Lords can earn. Once Starknet is live, the Realms will be automatically available to redeem on Starknet. You will then be able to trade freely between l1 and l2.',
        active: 'true',
      },
      {
        betaTime: 'Early Q2 2022 ',
        prodTime: 'Early Q2 2022',
        title: 'Minigame on Starknet Alpha',
        description:
          'Mini tower defence game on Starknet Alpha will be released. This will be an entirely on-chain experience and will require Lords to play. ',
        active: 'true',
      },
      {
        betaTime: 'Q2 2022',
        prodTime: 'Q2 2022',
        title: 'Starknet Bridge',
        description:
          'A complete bridge to Starknet is being built. This will allow players to transfer their Realms back and forth between l1 and l2.',
        active: 'true',
      },
      {
        betaTime: 'Q2 2022',
        prodTime: 'Q2 2022',
        title: 'Trading Plaza on Starknet - NFT Marketplace using $LORDS',
        description:
          'A Starknet native NFT marketplace denominated in $LORDS is being designed and built. All trades on this marketplace will use LORDS as the currency. A % of the transactions fees will funnel directly into the Bibliotheca DAO.',
        active: 'true',
      },
      {
        betaTime: 'Q2 2022',
        prodTime: 'Q2 2022',
        title:
          'Settling on Starknet - Stake your Realms and Earn LORDS and resources.',
        description:
          'Players will be able to Settle their Starknet Realms and begin to earn resources and $LORDS.',
        active: 'true',
      },
      {
        betaTime: 'Q2 2022',
        prodTime: 'Q2 2022',
        title: 'Resources Automated Market Maker',
        description:
          'The Resources AMM provides the vital functionality for Adventurers to be able to trade for missing materials for upgrades - such as Wood, Diamonds and Dragonhide',
        active: 'true',
      },
      {
        betaTime: 'Q2 2022',
        prodTime: 'Q2 2022',
        title: 'PvP Contracts',
        description:
          "Fight your way to resource supremacy by raiding other adventurers' Realms, and participate in other creative PvP experiences using Loot derivatives",
        active: 'true',
      },
      {
        betaTime: 'Beyond',
        title: 'The Realmverse economy',
        description:
          'With a thriving ecosytem on Starknet, more features and composablity across apps will emerge. Community involvement will guide this. We envision 1m+ players all working together building a functioning on-chain economy.',
        active: 'true',
      },
    ]
    return {
      mapStages,
    }
  },
})
</script>
