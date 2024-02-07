<template>
  <div v-if="car != null">
    <v-row>
      <v-btn-toggle v-model="car.isSale">
        <v-btn :value="false">
          <v-icon>mdi-currency-usd</v-icon>
          Buy
        </v-btn>
        <v-btn :value="true">
          <v-icon>mdi-currency-usd</v-icon>
          Sell
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <v-row>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete
          label="Year"
          v-model="car.year"
          :items="carOptions.years"
          auto-select-first="exact"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete
          auto-select-first="exact"
          label="Make"
          v-model="car.make"
          :items="makes"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete
          label="Model"
          auto-select-first="exact"
          v-model="car.model"
          :items="models"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3">
        <v-autocomplete
          label="Style"
          auto-select-first="exact"
          v-model="car.style"
          :items="styles"
        />
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
      <v-col cols="12" class="v-col-md-6">
        <v-text-field
          label="Price"
          v-model="car.price"
          prepend-inner-icon="mdi-currency-usd"
          type="number"
        />
      </v-col>
      <v-col cols="12" class="v-col-md-6">
        <v-text-field label="Miles" v-model="car.miles" type="number" />
      </v-col>
    </v-row>

    <v-row v-if="car.isSale">
      <v-col cols="12" class="v-col-md-6">
        <v-text-field
          label="Sale Price"
          v-model="car.sellPrice"
          prepend-inner-icon="mdi-currency-usd"
          type="number"
        />
      </v-col>
      <v-col cols="12" class="v-col-md-6">
        <v-text-field
          label="Miles at Sale"
          v-model="car.sellMiles"
          type="number"
          :prepend-inner-icon="car.sellMiles < car.miles ? 'mdi-alert' : ''"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="v-col-md-6">
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
    async (year) => updateMakes(year)
  );
  const updateMakes = async (year: number) => {
    if (year != null) {
      makes.value = await carOptions.makes(year);
    }
  };

  watch(
    () => props.car.make,
    async (make) => updateModels(make)
  );
  const updateModels = async (make: string) => {
    if (make != null) {
      models.value = await carOptions.models(props.car.year, make);
    }
  };

  watch(
    () => props.car.model,
    async (model) => updateStyles(model)
  );
  const updateStyles = async (model: string) => {
    if (model != null) {
      styles.value = await carOptions.styles(
        props.car.year,
        props.car.make,
        model
      );
    }
  };

  // Make sure they are all loaded for the current car values.
  updateMakes(props.car.year);
  updateModels(props.car.make);
  updateStyles(props.car.model);
});

const makes: Ref<string[]> = ref([]);
const models: Ref<string[]> = ref([]);
const styles: Ref<string[]> = ref([]);
</script>

<style scoped></style>
