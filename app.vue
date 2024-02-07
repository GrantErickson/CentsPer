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

        <v-spacer/>

        <v-btn icon>
          <v-icon @click="clickGear">mdi-cog</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <NuxtPage :key="refreshKey"/>
        </v-container>
      </v-main>

      <v-footer app>
        <span>&copy; 2024</span>
      </v-footer>

        <v-dialog v-model="showSettings" width="500">
    <template v-slot:default="{  }">
      <v-card title="Settings">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-checkbox
                v-model="carOptions.showGraphCumulative"
                label="Show Cumulative Yearly Costs"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="carOptions.maxMiles"
                label="Max Miles"
                type="number"/>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="carOptions.milesPerYear"
                label="Miles Per Year"
                type="number"/>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn elevation="4" text="Close" color="blue" @click="clickSettingsClose"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>


    </v-app>
  </NuxtLayout>
</template>

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"></link>

<script setup lang="ts">
import { ref } from 'vue';
import { carOptions } from './scripts/carOptions';

const showSettings = ref(false);
const refreshKey = ref(0);

const clickGear = () => {
  showSettings.value = true;
}

const clickSettingsClose = () => {
  showSettings.value = false;
  refreshKey.value++;
}

</script>

<style lang="sass">
@import "./node_modules/@fontsource/roboto/index.css"
@import "./assets/styles/app.scss"
</style>
