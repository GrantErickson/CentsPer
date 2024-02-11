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
          <v-icon @click="clickHelp">mdi-help</v-icon>
        </v-btn>
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
                  v-model="showGraphCumulative"
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
            <v-btn elevation="4" text="Restore Defaults" color="orange" @click="clickSettingsDefault"></v-btn>
            <v-spacer></v-spacer>
            <v-btn elevation="4" text="Close" color="blue" @click="clickSettingsClose"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>


      <v-dialog v-model="showHelp" max-width="600">
      <template v-slot:default="{  }">
        <v-card title="How to use Cents per Mile">
          <v-card-text>
            <Help-Content/>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn elevation="4" text="Close" color="blue" @click="clickHelpClose"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>


    </v-app>
  </NuxtLayout>
</template>

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"></link>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { carOptions } from './scripts/carOptions';
import { Format } from './scripts/format';

const showSettings = ref(false);
const showHelp = ref(false);
const refreshKey = ref(0);
const showGraphCumulative = ref(false); // This is a staging variable so that screen doesn't change behind the dialog.

onMounted(() => {
  if (!localStorage.getItem('firstTime')) {
    localStorage.setItem('firstTime', 'false');
    showHelp.value = true;
  }
});

const clickGear = () => {
  showGraphCumulative.value = carOptions.showGraphCumulative;
  showSettings.value = true;
}
const clickSettingsClose = () => {
  carOptions.showGraphCumulative = showGraphCumulative.value;
  showSettings.value = false;
  refreshKey.value++;
}

const clickSettingsDefault = () => {
  showGraphCumulative.value = false;
  carOptions.maxMiles = 200000;
  carOptions.milesPerYear = 15000;
}

const clickHelp = () => {
  showHelp.value = true;
}
const clickHelpClose = () => {
  showHelp.value = false;
}

</script>

<style lang="sass">
@import "./node_modules/@fontsource/roboto/index.css"
@import "./assets/styles/app.scss"
</style>
