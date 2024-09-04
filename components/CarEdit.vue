<template>
  <v-container v-if="car != null">
    <v-row no-gutters>
      <v-btn-toggle v-model="car.isSale" elevation="4">
        <v-btn :value="false" min-width="120" color="orange">
          <v-icon>mdi-car-outline</v-icon>
          Buy
        </v-btn>
        <v-btn :value="true" min-width="120" color="blue">
          <v-icon>mdi-car-outline</v-icon>
          Sell
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <div class="text-body-2 bg-brown text-center my-4">
      <span>Year, Make, Model, Style</span>
    </div>
    <v-row>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3 py-0">
        <v-autocomplete
          label="Year"
          v-model="car.year"
          :items="carOptions.years"
          auto-select-first="exact"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3 py-0">
        <v-autocomplete
          auto-select-first="exact"
          label="Make"
          v-model="car.make"
          :items="makes"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3 py-0">
        <v-autocomplete
          label="Model"
          auto-select-first="exact"
          v-model="car.model"
          :items="models"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" class="v-col-sm-6 v-col-md-3 py-0">
        <v-autocomplete
          label="Style"
          auto-select-first="exact"
          v-model="car.style"
          :items="styles"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <div class="text-body-2 bg-brown text-center my-4">
      <span>Details</span>
    </div>
    <v-row>
      <v-col cols="12" class="v-col-md-6 v-col-lg-8 py-0">
        <v-text-field
          label="Details"
          v-model="car.details"
          density="comfortable"
        />
      </v-col>
      <v-col cols="6" class="v-col-md-3 v-col-lg-2 py-0">
        <v-combobox
          label="Color"
          v-model="car.color"
          :items="carOptions.colors"
          density="comfortable"
        />
      </v-col>
      <v-col cols="6" class="v-col-md-3 v-col-lg-2 py-0">
        <v-select
          label="Hotness"
          v-model="car.hotness"
          :items="[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" class="v-col-md-12 v-col-lg-12 py-0">
        <v-text-field
          label="Link"
          v-model="car.link"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <div class="text-body-2 bg-brown text-center my-4">
      <span>Purchase</span>
    </div>
    <v-row>
      <v-col cols="6" class="v-col-md-6 py-0">
        <v-text-field
          label="Price"
          v-model="car.price"
          prepend-inner-icon="mdi-currency-usd"
          type="number"
          density="comfortable"
        />
      </v-col>
      <v-col cols="6" class="v-col-md-6 py-0">
        <v-text-field
          label="Miles"
          v-model="car.miles"
          type="number"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <div class="text-body-2 bg-brown text-center my-4" v-if="car.isSale">
      <span>Sale or Trade-In</span>
    </div>
    <v-row v-if="car.isSale">
      <v-col cols="6" class="v-col-md-6 py-0">
        <v-text-field
          label="Sale Price"
          v-model="car.sellPrice"
          prepend-inner-icon="mdi-currency-usd"
          type="number"
          density="comfortable"
        />
      </v-col>
      <v-col cols="6" class="v-col-md-6 py-0">
        <v-text-field
          label="Miles at Sale"
          v-model="car.sellMiles"
          type="number"
          :prepend-inner-icon="car.sellMiles < car.miles ? 'mdi-alert' : ''"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <div class="text-body-2 bg-brown text-center my-4">
      <span>Calculated</span>
    </div>
    <v-row>
      <v-col cols="12" class="v-col-md-6 py-0">
        <v-text-field
          label="Cents per Mile"
          :model-value="car.centsPerMile() + ' ¢/mile'"
          readonly
          density="comfortable"
        />
      </v-col>
    </v-row>
  </v-container>
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
