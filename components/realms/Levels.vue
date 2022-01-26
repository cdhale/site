<template>
  <div v-if="cities" class="my-2 text-xl">
    <div class="my-2">
      Cities: {{ cities }} / 21
      <div class="bg-gray-200 bg-white w-full rounded bg-opacity-75">
        <div
          :style="'width:' + (cities / 21) * 100 + '%'"
          class="rounded px-4 py-2 bg-red-400 bg-opacity-75"
        ></div>
      </div>
    </div>
    <div class="my-2">
      Harbours: {{ harbours }} / 35
      <div class="bg-gray-200 bg-white w-full rounded bg-opacity-75">
        <div
          :style="'width:' + (harbours / 35) * 100 + '%'"
          class="rounded px-4 py-2 bg-gray-900 bg-opacity-75"
        ></div>
      </div>
    </div>
    <div class="my-2">
      Regions: {{ regions }} / 7
      <div class="bg-gray-200 w-full rounded bg-opacity-75">
        <div
          :style="'width:' + (regions / 7) * 100 + '%'"
          class="rounded px-4 py-2 bg-yellow-300 bg-opacity-75"
        ></div>
      </div>
    </div>
    <div class="my-2">
      Rivers: {{ rivers }} / 60
      <div class="bg-gray-200 bg-white w-full rounded bg-opacity-75">
        <div
          :style="'width:' + (rivers / 60) * 100 + '%'"
          class="
            rounded
            px-4
            py-2
            bg-blue-300 bg-opacity-75
            border-blue-300 border
          "
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    cities: {
      type: Number,
      required: true,
    },
    harbours: {
      type: Number,
      required: true,
    },
    regions: {
      type: Number,
      required: true,
    },
    rivers: {
      type: Number,
      required: true,
    },
  },
  setup() {},
})
</script>
