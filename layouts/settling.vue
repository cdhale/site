<template>
  <div
    class="
      img-background
      min-h-screen
      bg-off-100 bg-opacity-70
      sm:flex-nowrap
      bg-center bg-cover bg-no-repeat
      border-8 border-off-200 border-double
      bg-fixed
    "
  >
    <div class="sm:hidden w-full mt-12 flex justify-between px-10">
      <NuxtLink to="/">Back</NuxtLink>
    </div>
    <NotificationBar />
    <div class="hidden w-full sm:flex px-4">
      <NuxtLink
        class="
          hover:bg-off-200 hover:text-off-100
          text-off-200
          transform
          duration-200
          h-20
          min-w-40
          p-10
          flex
          font-display
          uppercase
          text-center
          rounded-b-2xl
          text-2xl
        "
        to="/"
        ><span class="self-center text-center w-full">Home</span></NuxtLink
      >
      <a
        v-for="(link, index) in links"
        :key="index"
        class="
          hover:bg-off-200 hover:text-off-100
          text-off-200
          transform
          duration-200
          h-20
          min-w-40
          p-10
          flex
          font-display
          uppercase
          text-center
          rounded-b-2xl
          text-2xl
        "
        :href="link.url"
      >
        <span class="self-center text-center w-full">{{ link.title }}</span></a
      >
      <div class="ml-auto">
        <AccountButton type="settling" />
      </div>
    </div>
    <div class="w-full">
      <Nuxt class="p-3 sm:p-8" />
      <Modal />
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { useConnect } from '~/composables/useConnect'

export default defineComponent({
  setup() {
    useConnect()

    const links = [
      {
        title: 'Faqs',
        url: '#faqs',
      },
      {
        title: 'docs',
        url: 'https://docs.bibliothecadao.xyz/',
      },
      {
        title: 'stake',
        url: '#stake',
      },
      {
        title: 'Roadmap',
        url: '#roadmap',
      },
    ]

    return {
      links,
    }
  },
})
</script>

<style>
.img-background {
  position: relative;
  background: '#F9F7F1';
}
.img-background::after {
  content: '';
  opacity: 0.1;
  background: url('~/assets/img/realm-img.png');
  top: 0;
  background-size: cover;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
}
</style>
