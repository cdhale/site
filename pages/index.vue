<template>
  <section>
    <div class="sm:w-2/3 mx-auto">
      <div>
        <img
          src="https://storage.opensea.io/files/1653d8a6adfa4f61abf1ebc56f63daea.svg"
          class="mx-auto rounded-full"
          alt=""
        />
        <!-- <Book class="mx-auto w-24 h-24 mb-10" /> -->
        <h1 class="sm:text-8xl my-6 text-center">
          Bibliotheca <span class="text-off-200">DAO</span>
        </h1>

        <div class="p-4 text-center">
          <p class="sm:text-3xl font-semibold text-gray-300">
            Custodions of an open source permissionless gaming ecosystem built
            on a <span class="text-off-200">L2 Zero-Knowledge</span> rollup in
            the Lootverse.
          </p>
        </div>
      </div>
    </div>
    <div
      class="
        w-full
        border-double border-4
        flex
        text-center
        border-off-200
        mt-40
      "
    >
      <div
        class="
          text-4xl
          border-r-4 border-double
          p-6
          w-1/3
          border-off-200
          bg-off-200
        "
      >
        What is Bibliotheca?
      </div>
      <div class="text-4xl border-r-4 border-double p-6 w-1/3 border-off-200">
        What do we do?
      </div>
      <div class="text-4xl p-6 w-1/3">How we operate?</div>
    </div>
    <div class="w-full p-6 text-2xl">
      <p>
        We are a collection of designers, builders, architects & world builders,
        centered around the shared goal of building on-chain game economies on
        zk-rollups. We believe in open source composable gaming and are
        developing the worlds first MMOCCG (Massively Multiplayer On-Chain
        Composable Game).
      </p>
    </div>

    <!-- <h1 class="sm:text-6xl mt-40 text-center">Realms, Lords & Resources</h1>
    <div class="p-4 text-center">
      <p class="sm:text-3xl font-semibold text-gray-300">
        Our upcoming Settling game is the first of it's kind running on a ZK
        rollup.
      </p>
    </div>
    <div></div> -->
  </section>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// import Book from '~/assets/img/book-open.svg?inline'
export default defineComponent({
  // components: {
  //   Book,
  // },
  setup() {},
})
</script>
