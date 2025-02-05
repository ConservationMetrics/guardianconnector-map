import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-10-08",

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      script: [
        { src: "/vendor/lightbox/lightbox-plus-jquery.js", defer: true },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  devtools: { enabled: true },

  nitro: {
    plugins: ["@/server/index.ts"],
  },

  modules: [
    "gc-shared-resources",
    "nuxt-auth-utils",
    "@nuxtjs/i18n",
    "@nuxt/test-utils/module",
    "nuxt-windicss",
  ],

  css: ["public/vendor/lightbox/lightbox.min.css"],

  i18n: {
    locales: [
      { code: "en", name: "English", language: "en-US", file: "en.json" },
      { code: "es", name: "Español", language: "es-ES", file: "es.json" },
      { code: "pt", name: "Português", language: "pt-PT", file: "pt.json" },
      { code: "nl", name: "Nederlands", language: "nl-NL", file: "nl.json" },
    ],
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      redirectOn: "all",
    },
    // langDir: "lang/",
    strategy: "no_prefix",
    skipSettingLocaleOnNavigate: true, // persists locale when route changes
  },

  runtimeConfig: {
    configDatabase: "guardianconnector",
    database: "",
    dbHost: "",
    dbUser: "",
    dbPassword: "",
    dbPort: "5432",
    dbSsl: true,
    dbTable: "",
    isSqlite: false,
    sqliteDbPath: "",
    port: "8080",
    public: {
      allowedFileExtensions: {
        image: ["jpg", "jpeg", "png", "webp"],
        audio: ["mp3", "ogg", "wav"],
        video: ["mov", "mp4", "avi", "mkv"],
      },
      appApiKey: "",
      authStrategy: "none",
      baseUrl: "http://localhost:8080",
    },
  },
});
