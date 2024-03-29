// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false, // This is because Apex can't server-side render.
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "nuxt-gtag",
  ],
  gtag: {
    id: "G-HTKLMCKTF7",
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
