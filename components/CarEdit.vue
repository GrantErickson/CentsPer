<template>
  <div v-if="car != null">
    <v-row>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete
          label="Year"
          v-model="car.year"
          :items="carOptions.years"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete label="Make" v-model="car.make" :items="makes" />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete label="Model" v-model="car.model" :items="models" />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete label="Style" v-model="car.style" :items="styles" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="v-col-md-6 v-col-lg-8">
        <v-text-field label="Details" v-model="car.details" />
      </v-col>
      <v-col cols="12" class="v-col-md-3 v-col-lg-2">
        <v-combobox
          label="Color"
          v-model="car.color"
          :items="carOptions.colors"
        />
      </v-col>
      <v-col cols="12" class="v-col-md-3 v-col-lg-2">
        <v-select
          label="Hotness"
          v-model="car.hotness"
          :items="[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="v-col-md-6 v-col-lg-4">
        <v-text-field
          label="Price"
          v-model="car.price"
          prepend-inner-icon="mdi-currency-usd"
          type="number"
        />
      </v-col>
      <v-col cols="12" class="v-col-md-6 v-col-lg-4">
        <v-text-field label="Miles" v-model="car.miles" type="number" />
      </v-col>
      <v-col cols="12" class="v-col-md-6 v-col-lg-4">
        <v-text-field
          label="Cents per Mile"
          :model-value="car.centsPerMile() + ' ¢/mile'"
          readonly
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from "vue";
import { Car } from "~/scripts/car";
import { CarOptions } from "~/scripts/carOptions";

const props = defineProps({
  car: { type: Car, required: true },
  carOptions: { type: CarOptions, required: true },
});

const makes: Ref<string[]> = ref([]);
const models: Ref<string[]> = ref([]);
const styles: Ref<string[]> = ref([]);

const test = () => {
  // Watchers to update the makes, models, and styles when the year, make, or model changes
  watch(
    () => props.car.year,
    async () => {
      if (!props.car) return;

      makes.value = await props.carOptions.makes(props.car.year);
      if (makes.value.indexOf(props.car.make) == -1) {
        props.car.make = "";
        props.car.model = "";
        props.car.style = "";
      }
    },
    { immediate: true }
  );
  watch(
    () => props.car.make,
    async () => {
      if (!props.car) return;
      models.value = await props.carOptions.models(
        props.car.year,
        props.car.make
      );
      if (models.value.length === 1) {
        props.car.model = models.value[0];
      }
      if (models.value.indexOf(props.car.model) == -1) {
        props.car.model = "";
        props.car.style = "";
      }
    },
    { immediate: true }
  );
  watch(
    () => props.car.model,
    async () => {
      if (!props.car) return;
      styles.value = await props.carOptions.styles(
        props.car.year,
        props.car.make,
        props.car.model
      );
      if (styles.value.length === 1) {
        props.car.style = styles.value[0];
      }
      if (styles.value.indexOf(props.car.style) == -1) {
        props.car.style = "";
      }
    },
    { immediate: true }
  );
};
</script>

<style scoped></style>
