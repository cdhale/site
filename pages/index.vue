<template>
  <section>
    <div class="text-center sm:pt-20 sm:w-2/3 mx-auto">
      <Book class="mx-auto w-24 h-24 mb-10" />
      <h1 class="sm:text-6xl mb-10">Bibliotheca (for Adventurers)</h1>
      <p class="sm:text-3xl my-5">
        Bibliotheca graphs community projects <br />so you can see your progress
        in the Lootverse.
      </p>

      <div class="flex my-10 justify-around">
        <BButton type="primary" to="/settling#roadmap"
          >See Settling Roadmap</BButton
        >
      </div>

      <div class="flex flex-wrap justify-around">
        <div
          class="
            bg-black
            border-4 border-off-200 border-double
            p-4
            rounded-xl
            w-80
            h-80
            mt-10
            text-3xl
            cursor-pointer
            transform
            hover:-translate-y-2
            transition
            duration-150
            flex flex-col
            sm:mr-4
          "
          @click="$router.push('/adventurer')"
        >
          <div class="mt-auto">See all Adventurers</div>
        </div>
        <div
          class="
            bg-black
            border-4 border-off-200 border-double
            p-4
            rounded-xl
            w-80
            h-80
            mt-10
            text-3xl
            cursor-pointer
            transform
            hover:-translate-y-2
            transition
            duration-150
            flex flex-col
          "
          @click="$router.push('/realms')"
        >
          <div class="mt-auto">See all Realms</div>
        </div>
        <div
          class="
            bg-black
            border-4 border-off-200 border-double
            p-4
            rounded-xl
            w-80
            h-80
            mt-10
            text-3xl
            cursor-pointer
            transform
            hover:-translate-y-2
            transition
            duration-150
            flex flex-col
          "
          @click="$router.push('/loot')"
        >
          <div class="mt-auto">See all Loot</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import Book from '~/assets/img/book-open.svg?inline'
export default defineComponent({
  components: {
    Book,
  },
  setup() {},
})
</script>
