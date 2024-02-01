<template>
  <NuxtLayout>
    <v-app>
      <v-app-bar elevation="2" variant="tonal" color="brown-lighten-2">
        <template v-slot:prepend>
          <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
          <v-img
            :width="42"
            src="~/assets/images/PennyTire128.png"
            class="float-left mr-2"
          >
          </v-img>        
        </template>

        <v-app-bar-title>

          <div class="text-h4">CentsPer.com</div>
        </v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-container>
          <NuxtPage/>
        </v-container>
      </v-main>
      <v-footer app>
        <span>&copy; 2024</span>
      </v-footer>
    </v-app>
  </NuxtLayout>
</template>

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"></link>

<style lang="sass">
@import './node_modules/@fontsource/roboto/index.css'
</style>

<style lang="sass">
@import './assets/styles/app.scss'
</style>
