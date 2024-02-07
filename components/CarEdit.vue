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
import { carOptions } from "~/scripts/carOptions";

const props = defineProps({
  car: { type: Car, required: true },
});

onMounted(() => {
  // Update makes when the year changes
  watch(
    () => props.car.year,
    async (year) => {
      if (year != null) {
        makes.value = await carOptions.makes(year);
      }
    }
  );

  watch(
    () => props.car.make,
    async (make) => {
      if (make != null) {
        models.value = await carOptions.models(props.car.year, make);
      }
    }
  );

  watch(
    () => props.car.model,
    async (model) => {
      if (model != null) {
        styles.value = await carOptions.styles(
          props.car.year,
          props.car.make,
          model
        );
      }
    }
  );
});

const makes: Ref<string[]> = ref([]);
const models: Ref<string[]> = ref([]);
const styles: Ref<string[]> = ref([]);
</script>

<style scoped></style>
