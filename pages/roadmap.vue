<template>
  <section class="w-full">
    <div class="text-center sm:w-1/2 mx-auto">
      <h1>Settling of the Realms Roadmap</h1>
      <p class="font-semibold text-2xl">
        UPDATE: We have pivoted from Arbitrum to Starknet as our layer 2
        solution. We have done this to minimise gas costs per action. This will
        delay mainnet launch of the game.
      </p>

      <p class="my-4 text-2xl">
        Settling is an open source MMOCCG (Massively Multiplayer On-Chain
        Composable Game) of economics and Chivalry built on-top of ZK STARKS
        (Starknet). <br />
        The goal of the game is to build up your Realm, form alliances and
        harvest resources. If you would like to contibute - check out our
        <a href="https://github.com/BibliothecaForAdventurers" target="_blank"
          >GitHub Repos</a
        >
        and come say hi on our
        <a href="https://discord.gg/GHrrTNkuwa" target="_blank">Discord</a>
      </p>
    </div>

    <div class="flex flex-col space-y-8">
      <div
        class="
          text-2xl
          sm:w-1/2
          p-4
          bg-black
          mx-auto
          rounded-xl
          my-8
          flex flex-wrap
          justify-around
        "
      >
        <span class="text-red-800 bg-red-400 rounded p-2 px-4">Open Beta</span>
        <span class="text-blue-800 bg-blue-400 rounded p-2 px-4"
          >Production</span
        >
      </div>
      <div
        v-for="(stage, index) in mapStages"
        :key="index"
        class="
          mx-auto
          bg-black
          p-8
          rounded-xl
          shadow-xl
          sm:w-1/2
          hover:border-red
          transform
          hover:-translate-y-2 hover:bg-red-500
          transition
          duration-150
          group
          cursor-pointer
        "
      >
        <div class="flex">
          <h5
            v-if="stage.betaTime"
            class="
              uppercase
              group-hover:text-white
              text-red-400
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
              text-blue-400
              mb-1
              tracking-widest
              flex
            "
          >
            {{ stage.prodTime }}
          </h5>
        </div>
        <h2>{{ stage.title }}</h2>
        <p class="text-2xl group-hover:text-white text-gray-400">
          {{ stage.description }}
        </p>
      </div>
    </div>
    <div class="py-8 sm:w-1/2 mx-auto">
      <div class="bg-gray-800 mx-auto rounded-xl shadow-2xl text-white p-8">
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
          'The journey commences with a bridge to the Layer 2 network - Starknet. To reward early Realm Lords, a joint Staking contract is being built where Lords can earn.',
        active: 'true',
      },
      {
        betaTime: 'Q1 2021',
        prodTime: 'Q1 2021',
        title: 'Staking Realms to Earn Resources',
        description:
          'Realm holders begin to generate resources and $LORDS tokens after the development of staking contracts on Arbitrum ',
        active: 'true',
      },
      {
        betaTime: 'Q1 2021',
        prodTime: 'Q1 2021',
        title: 'Staking Realms to Earn Resources',
        description:
          'Realm holders begin to generate resources and $LORDS tokens after the development of staking contracts on Arbitrum ',
        active: 'true',
      },
      {
        betaTime: 'Q1 2021',
        prodTime: 'Q1 2021',
        title: 'Build upgrades on your Realms',
        description:
          "Construct various structures to upgrade a Realms' resource generation and manage its health, defense and more.",
        active: 'true',
      },
      {
        betaTime: 'Q1 2021',
        prodTime: 'Q1 2021',
        title: 'Resources Automated Market Maker',
        description:
          'The Resources AMM provides the vital functionality for Adventurers to be able to trade for missing materials for upgrades - such as Wood, Diamonds and Dragonhide',
        active: 'true',
      },
      {
        betaTime: 'Q1 2021',
        prodTime: 'Q1 2021',
        title: 'V1 Platform live',
        description:
          'Full Version 1 production launch of user frontend to enable staking, trading resources, and building upgrades',
        active: 'true',
      },
      {
        betaTime: 'Q1 2021',
        prodTime: 'Q1 2021',
        title: 'PvP Contracts',
        description:
          "Fight your way to resource supremacy by raiding other adventurers' Realms, and participate in other creative PvP experiences using Loot derivatives",
        active: 'true',
      },
      {
        betaTime: 'Beyond',
        title: 'Much, much more',
        description:
          'Functionality will continue to be added based on community feedback and engagement.',
        active: 'true',
      },
    ]
    return {
      mapStages,
    }
  },
})
</script>
