export default {
  // Target (https://go.nuxtjs.dev/config-target)
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
  },

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },

  // target: 'static',
  target: 'server',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'General Alliance Agent Portal',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //   rel: 'stylesheet',
      //   href: 'https://use.font-awesome.com/releases/v5.2.0/css/all.css',
      // },
      // {
      //   rel: 'stylesheet',
      //   href:
      //     'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css',
      // },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/css/main.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/vuelidate.js',
    { src: '@/plugins/vue-luxon.js', mode: 'client' },
    { src: '@/plugins/vue-currency-filter.js', mode: 'client' },
    { src: '@/plugins/vue-lodash-filter.js', mode: 'client' },
    { src: '@/plugins/vue-mask.js', mode: 'client' },
    { src: '@/plugins/vue-formulate.js', mode: 'client' },
    { src: '@/plugins/persisted-state.client.js' },
    { src: '@/plugins/pino.js' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // Firebase
    // '@nuxtjs/firebase',
    // Cookies
    // 'cookie-universal-nuxt',
  ],

  // Nuxt Auth
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/auth/login',
      home: '/',
    },

    strategies: {
      local: {
        token: {
          required: false,
          type: false,
        },
        user: {
          property: false, // 'user',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: false, // { url: '/api/auth/logout', method: 'post' },
          user: false, // { url: '/api/auth/user', method: 'get' },
        },
      },
    },
  },

  // Firebase
  // firebase: {
  //   config: {
  //     apiKey: process.env.FIREBASE_API_KEY,
  //     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  //     messagingSenderId: process.env.FIREBASE_MSG_SND_ID,
  //     appId: process.env.FIREBASE_APP_ID,
  //     measurementId: process.env.FIREBASE_MEAS_ID,
  //     databaseURL: false,
  //   },
  //   services: {
  //     auth: {
  //       persistence: 'local', // default
  //       initialize: {
  //         // onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
  //         onAuthStateChangedAction: 'auth/onAuthStateChanged',
  //         subscribeManually: false,
  //       },
  //       ssr: false, // default
  //     },
  //     firestore: true,
  //   },
  // },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  proxy: {
    '/api/': {
      target: process.env.NUXT_ENV_NEW_API_URL,
      pathRewrite: { '^/api/': '' },
    },
  },

  axios: {
    proxy: true,
    // https: true,
    baseURL: process.env.NUXT_ENV_NEW_API_URL,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  router: {
    middleware: ['auth'],
  },
}
