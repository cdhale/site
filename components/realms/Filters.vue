<template>
  <div
    class="
      border-r border-gray-700
      py-5
      px-2
      bg-gray-1000
      transform
      duration-300
      ease-in-out
      transition-all
      left-0
      top-0
      h-screen
      flex flex-col
      overflow-y-scroll
      z-30
    "
    :class="filtersOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'"
  >
    <div class="px-4 flex items-center justify-between">
      <h3 class="text-gray-200">Filters</h3>
      <button
        type="button"
        class="
          -mr-2
          w-10
          h-10
          p-2
          rounded-md
          flex
          items-center
          justify-center
          text-gray-400
        "
        @click="$emit('toggleFilter')"
      >
        <Close class="w-6 h-6" />
      </button>
    </div>
    <form
      class="sm:flex mt-4 mb-2 space-x-2 w-full hidden"
      method="POST"
      @submit.prevent="submitSearch"
    >
      <input
        v-model="search"
        placeholder="realm id"
        class="
          bg-black
          rounded-2xl
          px-4
          text-xl
          border-4 border-double border-off-200
        "
        type="text"
      />
      <div class="self-center">
        <BButton class="mt-2 sm:mt-0 sm:px-4 w-full text-white" type="primary"
          ><Search class="white w-6 h-6"
        /></BButton>
      </div>
    </form>

    <div class="mt-4 border-t border-gray-200">
      <div
        v-for="section in filterCategories"
        :key="section.id"
        class="border-t border-gray-200 px-4 py-6"
      >
        <h4 class="-mx-2 -my-3 flow-root">
          <!-- Expand/collapse section button -->
          <button
            type="button"
            class="
              px-2
              py-3
              w-full
              flex
              items-center
              justify-between
              text-gray-200
              hover:text-gray-500
            "
            aria-controls="filter-section-mobile-0"
            aria-expanded="false"
            @click="toggleSection(section)"
          >
            <span class="text-gray-300"> {{ section.name }} </span>
            <span class="ml-6 flex items-center">
              <svg
                v-if="!section.open"
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>
        </h4>
        <!-- Filter section, show/hide based on section state. -->
        <div v-if="section.open" id="filter-section-mobile-0" class="pt-6">
          <div class="space-y-2">
            <div
              v-for="option in section.options"
              :key="section.id + option.id"
              class="
                flex
                items-center
                hover:bg-gray-900
                p-1
                rounded
                cursor-pointer
              "
            >
              <input
                v-if="section.id === 'orders'"
                :id="'filter-' + section.id + option.id"
                v-model="checked[type][section.id]"
                :value="option.name"
                :checked="option.checked"
                type="checkbox"
                class="
                  h-4
                  cursor-pointer
                  w-4
                  appearance-none
                  form-tick
                  border border-gray-700
                  rounded-md
                  checked:bg-red-600 checked:border-transparent
                  focus:outline-none
                "
                @change.prevent="updateResources()"
              />
              <input
                v-else
                :id="'filter-' + section.id + option.id"
                v-model="checked[type][section.id]"
                :value="parseInt(option.id)"
                :checked="option.checked"
                type="checkbox"
                class="
                  h-4
                  cursor-pointer
                  w-4
                  appearance-none
                  form-tick
                  border border-gray-700
                  rounded-md
                  checked:bg-red-600 checked:border-transparent
                  focus:outline-none
                "
                @change.prevent="updateResources()"
              />
              <label
                :for="'filter-' + section.id + option.id"
                class="ml-3 min-w-0 flex-1 text-gray-200 text-xl cursor-pointer"
              >
                <span v-if="section.id === 'orders'">Order of</span>
                {{ option.name }}
                <span v-if="option.stakedRealms" class="font-semibold"
                  >({{ option.stakedRealms }})</span
                >
              </label>
            </div>
          </div>
          <BButton class="w-full mt-4" type="primary" @click="updateResources()"
            >Update</BButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, toRefs, watch } from '@vue/composition-api'
import Close from '~/assets/img/x-square.svg?inline'
import { useResources } from '~/composables/useResources'
import { gaOrders } from '~/composables/utils/ordersData'
import Search from '~/assets/img/search.svg?inline'

export default {
  name: 'Filters',
  components: {
    Close,
    Search,
  },
  props: {
    filtersOpen: {
      default: false,
      type: Boolean,
    },
    type: {
      type: String,
      default: 'all',
    },
    resources: {
      type: Array,
      default: null,
    },
    orders: {
      type: Array,
      default: null,
    },
  },
  setup(props, context) {
    const filtersRef = ref(props.filters)
    const { getResourceList, resourceList, resourceListOrdered } =
      useResources()
    const filterCategories = ref([
      {
        id: 'resources',
        name: 'Resources',
        open: false,
        options: [],
      },
      {
        id: 'orders',
        name: 'Orders',
        open: false,
        options: gaOrders,
      },
    ])
    const openFilter = ref(null)

    const search = ref()

    const submitSearch = () => {
      if (search.value > 0 && search.value <= 8000) {
        context.root.$router.push(`/realms/${search.value}`)
      }
    }

    const checked = ref({
      user: { resources: [], orders: [] },
      all: { resources: [], orders: [] },
    })
    if (props.resources) {
      checked.value.user.resources = props.resources
    }
    if (props.orders) {
      checked.value.user.orders = props.orders
    }
    const resourcesRef = toRefs(props).resources
    const ordersRef = toRefs(props).orders

    const updateResources = () => {
      context.emit('searchFilter', checked.value[props.type])
    }
    const toggleSection = (section) => {
      section.open = !section.open
    }
    const adventureLinks = [
      {
        page: '/adventurer',
        title: 'Search All',
      },
    ]

    onMounted(async () => {
      await getResourceList()
      filterCategories.value[0].options = resourceListOrdered.value.map(
        (obj) => {
          if (props.filters?.resources) {
            console.log('setting')
            obj.checked = !!props.filters?.resources?.includes(parseInt(obj.id))
          } else {
            obj.checked = false
          }
          return obj
        }
      )
    })

    watch(resourcesRef, () => {
      console.log('resource change')
      checked.value[props.type].resources = resourcesRef.value
    })
    watch(ordersRef, () => {
      console.log('orders change')
      checked.value[props.type].orders = ordersRef.value
    })

    return {
      search,
      submitSearch,
      resourcesRef,
      resourceList,
      filtersRef,
      filterCategories,
      resourceListOrdered,
      toggleSection,
      updateResources,
      openFilter,
      adventureLinks,
      checked,
    }
  },
}
</script>
