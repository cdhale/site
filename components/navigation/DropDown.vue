<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        id="menu-button"
        type="button"
        class="
          inline-flex
          justify-center
          w-full
          rounded-2xl
          border-4 border-double border-off-200
          shadow-sm
          px-4
          py-2
          bg-black
          text-xl text-off-200
          hover:bg-gray-800
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-offset-off-200
          focus:ring-off-200
          z-20
          capitalize
        "
        aria-expanded="true"
        aria-haspopup="true"
        @click="active = !active"
      >
        Search by: <span class="w-2" />
        <span class="bold text-off-100">
          {{
            activeElement ? '  ' + activeElement.name : 'Select Loot Item'
          }}</span>
        <svg
          class="-mr-1 ml-2 h-5 w-5 self-center"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      v-show="active"
      class="
        origin-top-left
        absolute
        left-0
        mt-2
        w-56
        rounded-md
        shadow-lg
        bg-black
        ring-1 ring-black ring-opacity-5
        focus:outline-none
        z-10
        capitalize
        border-4 border-double border-off-200
      "
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <a
          v-for="(item, index) in items"
          id="menu-item-0"
          :key="index"
          href="#"
          :class="{
            'bg-gray-800  text-off-200': item.name === activeElement.name,
          }"
          class="
            bg-black
            block
            px-4
            py-2
            text-md
            hover:bg-gray-900
            rounded
            hover:text-off-200
          "
          role="menuitem"
          tabindex="-1"
          @click="setElement(item)"
        >{{ item.name }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup (props, context) {
    const activeElement = ref(props.items[0])
    const active = ref(false)
    const hide = () => {
      active.value = false
    }

    const setElement = (item) => {
      active.value = false
      activeElement.value = item
      context.emit('itemSelect', item)
    }

    return {
      activeElement,
      active,
      hide,
      setElement
    }
  }
})
</script>
