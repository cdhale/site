<template>
  <div
    class="min-h-screen bg-fixed bg-center bg-no-repeat bg-cover img-background bg-off-100 bg-opacity-70 sm:flex-nowrap"
  >
    <div class="flex justify-between w-full px-10 mt-12 sm:hidden">
      <NuxtLink to="https://dao-site.vercel.app">
        Back
      </NuxtLink>
    </div>
    <NotificationBar />
    <div class="hidden w-full px-4 bg-gray-900 sm:flex">
      <div class="container flex mx-auto">
        <BibliothecaBook class="self-center mr-10 transition-all duration-150 cursor-pointer fill-current h-9 hover:fill-white hover:animate-bounce" @click="returnDAO()" />
        <div class="ml-auto">
          <AccountButton type="primary" class="!py-2" />
        </div>
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
import BibliothecaBook from '~/assets/img/BibliothecaBook.svg?inline'

export default defineComponent({
  components: {
    BibliothecaBook
  },
  setup () {
    useConnect()

    const links = [
      {
        title: 'Faqs',
        url: '#faqs'
      },
      {
        title: 'docs',
        url: 'https://docs.bibliothecadao.xyz/'
      },
      {
        title: 'stake',
        url: '#stake'
      },
      {
        title: 'Roadmap',
        url: '#roadmap'
      },
      {
        title: 'Atlas',
        url: 'https://atlas.bibliothecadao.xyz'
      }
    ]
    const returnDAO = () => {
      window.location = 'https://bibliothecadao.xyz'
    }
    return {
      returnDAO,
      links
    }
  }
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
