import EventEmitter from 'events'
const type = 'website'
const url = 'https://bibliothecadao.xyz'
const title = 'Bibliotheca DAO'
const description =
  'Custodians of an open source permissionless gaming ecosystem built on a L2 Zero-Knowledge rollup.'
const mainImage =
  'https://i.ibb.co/fMq60gr/Screenshot-from-2021-09-11-11-45-23.png'
EventEmitter.defaultMaxListeners = 20
const graphqlClients = {
  realms: {
    endpoint:
      'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms',
  },
  staker: {
    endpoint: process.env.GRAPH_API_STAKER
      ? process.env.GRAPH_API_STAKER
      : 'http://localhost:1337/graphql',
    options: {},
  },
  ecosystem: {
    endpoint: process.env.GRAPH_API
      ? process.env.GRAPH_API
      : 'http://localhost:1337/graphql',
    options: {},
  },
}
if (process.env.ACTIVE_NETWORKS.includes('rinkeby')) {
  graphqlClients.staker.endpoint = process.env.GRAPH_API_STAKER_RINKEBY
  graphqlClients.ecosystem.endpoint = process.env.GRAPH_API_RINKEBY
  graphqlClients.realms.endpoint =
    'https://api.thegraph.com/subgraphs/name/redbeardeth/realms-rinkeby'
}
const meta = [
  {
    hid: 'description',
    name: 'description',
    content: description,
  },
  {
    hid: 'og:type',
    property: 'og:type',
    content: type,
  },
  {
    hid: 'og:url',
    property: 'og:url',
    content: url,
  },
  {
    hid: 'og:title',
    property: 'og:title',
    content: title,
  },
  {
    hid: 'og:description',
    property: 'og:description',
    content: description,
  },
  {
    hid: 'og:image',
    property: 'og:image',
    content: mainImage,
  },
  {
    hid: 'twitter:url',
    name: 'twitter:url',
    content: url,
  },
  {
    hid: 'twitter:title',
    name: 'twitter:title',
    content: title,
  },
  {
    hid: 'twitter:description',
    name: 'twitter:description',
    content: description,
  },
  {
    hid: 'twitter:image',
    name: 'twitter:image',
    content: mainImage,
  },
]

export default {
  ssr: true,
  head: {
    title: 'Bibliotheca DAO',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inconsolata:wght@300&display=swap',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  loadingIndicator: {
    name: 'pulse',
    color: '#FFF',
    background: 'black',
  },
  graphql: {
    clients: graphqlClients,
    options: {},
    useFetchPolyfill: true,
    includeNodeModules: true,
  },
  plugins: [
    '~/plugins/vue-formulate',
    '~/plugins/analytics.js',
    '~/plugins/v-click-outside.js',
    '~/plugins/vue-awesome-countdown.js',
  ],
  components: [
    '~/components/web3',
    '~/components/modal',
    '~/components/navigation',
    '~/components',
    '~/components/cards',
    '~/components/utilities',
    '~/components/market',
    '~/components/realms',
    '~/components/tables',
  ],
  buildModules: [
    '@nuxtjs/eslint-module',
    'nuxt-graphql-request',
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    function () {
      this.nuxt.hook('tailwindcss:config', (config) => {
        // Move the legacy purge content array to the the new property
        // https://tailwindcss.com/docs/upgrade-guide#configure-content-sources
        config.content = config.purge.content
        // Remove legacy purge option to disable the warning
        config.purge = undefined
      })
    },
  ],
  modules: ['@nuxtjs/axios', '@nuxtjs/svg'],
  generate: {
    fallback: true,
  },
  serverMiddleware: ['~/serverMiddleware/redirects.ts'],
  build: {
    extend(config) {
      config.node = {
        fs: 'empty',
      }
    },
  },
  router: {
    linkExactActiveClass: 'text-off-200',
  },
  env: {
    INFURA_ID: process.env.INFURA_ID,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    ETHER_SCAN: process.env.ETHER_SCAN,
    ACTIVE_NETWORKS: process.env.ACTIVE_NETWORKS,
    OPENSEA: process.env.OPENSEA,
  },
}
