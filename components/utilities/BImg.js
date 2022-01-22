import {
  reactive,
  h,
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from '@nuxtjs/composition-api'

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    srcPlaceholder: {
      type: String,
      default: 'data:,',
    },
    srcset: {
      type: String,
    },
    intersectionOptions: {
      type: Object,
      default: () => ({}),
    },
    usePicture: {
      type: Boolean,
      default: false,
    },
  },
  inheritAttrs: false,
  setup(props, context) {
    const root = ref(context.root.$el)
    const state = reactive({
      observer: null,
      intersected: false,
      loaded: false,
    })

    // Computed
    const srcImage = computed(() =>
      state.intersected && props.src ? props.src : props.srcPlaceholder
    )
    const srcsetImage = computed(() =>
      state.intersected && props.srcset ? props.srcset : false
    )
    console.log(context)
    // Methods
    const load = () => {
      if (root.value.getAttribute('src') !== props.srcPlaceholder) {
        state.loaded = true
        context.emit('load')
      }
    }
    const error = () => context.emit('error', root.value)

    // Hooks
    onMounted(() => {
      if ('IntersectionObserver' in window) {
        state.observer = new IntersectionObserver((entries) => {
          const image = entries[0]
          if (image.isIntersecting) {
            state.intersected = true
            state.observer.disconnect()
            context.emit('intersect')
          }
        }, props.intersectionOptions)
        console.log(state.observer)
        console.log(root.value)
        state.observer.observe(root.value)
      }
    })

    onBeforeUnmount(() => {
      if ('IntersectionObserver' in window) {
        state.observer.disconnect()
      }
    })

    return {
      root,
      state,
      srcImage,
      srcsetImage,
      load,
      error,
    }
  },
  render() {
    const img = h('img', {
      ref: this.root,
      attrs: {
        src: this.srcImage,
        srcset: this.srcsetImage,
      },
      domProps: this.$attrs,
      class: {
        'v-lazy-image': true,
        'v-lazy-image-loaded': this.state.loaded,
      },
      on: { load: this.load, error: this.error },
    })
    if (this.usePicture) {
      return h(
        'picture',
        { on: { load: this.load } },
        this.intersected ? [this.$slots.default, img] : [img]
      )
    } else {
      return img
    }
  },
}
