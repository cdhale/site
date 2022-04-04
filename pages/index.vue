<template>
  <section>
    <div class="sm:w-2/3 mx-auto">
      <div>
        <img
          src="/lords-icon.png"
          class="mx-auto rounded-full w-32 h-32 sm:w-96 sm:h-96"
          alt=""
        >

        <h1 class="text-3xl sm:text-8xl my-6 text-center">
          Bibliotheca <span class="text-off-200">DAO</span>
        </h1>

        <div class="p-4 text-center">
          <p class="sm:text-3xl font-semibold text-gray-300">
            An open source permissionless gaming ecosystem built on StarkNet; a
            <span class="text-off-200">L2 Zero-Knowledge</span> rollup.
          </p>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <div
        class="
          w-full
          border-double border-4
          flex flex-wrap
          text-center
          border-off-200
          mt-10
          sm:mt-40
        "
      >
        <div
          class="
            border-r-4 border-double
            p-6
            border-off-200
            bg-off-200
            w-full
            text-center
          "
        >
          <span
            class="font-display text-2xl sm:text-5xl"
          >Settling of The Realms</span>
          <p class="mt-4 sm:text-2xl">
            The worlds first L2 MMOCCG resource management game.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap mb-20 mt-10">
        <div class="w-full text-center mb-20">
          <p class="sm:text-3xl sm:w-2/3 mx-auto">
            Settling of the Realms is the first game of the Realmverse, and is
            the economic pillar that lays the foundation for an ever expanding
            on-chain economy. The game is centered around 3 core tenets: Realms,
            $LORDS and Resources.
          </p>
        </div>
        <div class="sm:w-1/2 p-6 sm:text-2xl self-center">
          <h1
            class="
              border-double border-4 border-b border-r
              px-4
              py-4
              border-off-200
            "
          >
            Realms
          </h1>
          <p class="sm:text-3xl">
            Realms are the productive assets in this world. They are macro
            economic drivers that keep the resources flowing. There are 8000
            Realms with varying rarity spread across the Realmverse.
          </p>
          <div class="flex mt-8 space-x-2">
            <BButton
              to="/realms"
              class="text-sm"
              type="primary"
            >
              Explore Realms
            </BButton>
            <BButton
              href="https://opensea.io/collection/lootrealms"
              class="text-sm"
              type="primary"
            >
              Buy Realms
            </BButton>
          </div>
        </div>
        <div class="sm:w-1/2 self-center mx-auto">
          <img
            src="https://storage.opensea.io/files/1653d8a6adfa4f61abf1ebc56f63daea.svg"
            class="mx-auto rounded-full w-48 h-48 sm:w-96 sm:h-96"
            alt=""
          >
        </div>
      </div>
      <div class="flex flex-wrap my-20">
        <div class="sm:w-1/2 p-6 sm:text-2xl self-center sm:order-1">
          <h1
            class="
              border-double border-4 border-b border-r
              px-4
              py-4
              border-off-200
            "
          >
            $LORDS
          </h1>
          <p class="sm:text-3xl">
            $LORDS is your liquidity in and out of the game. You need it to
            transact on all the marketplaces and all assets are denominated in
            it. The way to get $LORDS is either by Settling your Realm or
            purchasing on Uniswap.
          </p>
          <div class="flex mt-8 space-x-2">
            <BButton
              href="https://app.uniswap.org/#/swap"
              class="text-sm"
              type="primary"
            >
              $LORDS
            </BButton>
            <BButton
              href="https://docs.bibliothecaforloot.com/economics/lords"
              class="text-sm"
              type="primary"
            >
              Tokenomics
            </BButton>
          </div>
        </div>
        <div class="sm:w-1/2 self-center mx-auto">
          <img
            src="/lords-icon.png"
            class="mx-auto rounded-full w-48 h-48 sm:w-96 sm:h-96"
            alt=""
          >
        </div>
      </div>
      <div class="flex flex-wrap my-20">
        <div class="sm:w-1/2 p-6 sm:text-2xl self-center">
          <h1
            class="
              border-double border-4 border-b border-r
              px-4
              py-4
              border-off-200
            "
          >
            Resources
          </h1>
          <p class="sm:text-3xl">
            Resources are the composable assets of the Realmverse. When settled,
            Realms generate one or more of 22 resources, which have varying
            rarity and are required for all purchases and crafting within the
            world.
          </p>
          <div class="flex mt-8">
            <BButton
              to="/realms/resources"
              class="text-xs"
              type="primary"
            >
              Resource distribution
            </BButton>
          </div>
        </div>
        <div class="sm:w-1/2 self-center mx-auto">
          <img
            src="https://github.com/BibliothecaForAdventurers/voxel-resources/blob/main/alchemical%20silver.gif?raw=true"
            class="mx-auto rounded-full w-48 h-48 sm:w-96 sm:h-96 object-cover"
            alt=""
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// import Book from '~/assets/img/book-open.svg?inline'
export default defineComponent({
  // components: {
  //   Book,
  // },
  setup () {}
})
</script>
