<template>
  <v-card elevation="3">
    <v-card-title>
      <div class="text-h4">CentsPer Mile</div>
    </v-card-title>
    <v-card-subtitle>
      <div>Apples to apples on used cars</div>
      <div>{{ maxMiles }} miles is used as a car's lifetime</div>
    </v-card-subtitle>
    <v-card-text>
      <div class="text-h5 mb-3">Selected Car</div>

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

      <div class="text-h5 mb-3">My Cars</div>
      <v-row>
        <v-col
          v-for="(aCar, index) in cars"
          :key="aCar.key"
          cols="12"
          class="v-col-md-6 v-col-lg-4"
        >
          <v-card
            class="mx-auto"
            :title="aCar.centsPerMile() + '¢/mile'"
            :subtitle="aCar.year + ' ' + aCar.make + ' ' + aCar.model"
            @click="select(index)"
            :color="aCar == car ? 'blue' : ''"
            :variant="variant(aCar)"
            tonal
            elevation="5"
          >
            <template v-slot:prepend>
              <v-avatar :color="aCar.uiColor">
                <v-icon :icon="aCar.carIcon"></v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-avatar size="24" style="font-size: 2em" variant="text">
                {{ aCar.hotnessIcon }}
              </v-avatar>
            </template>
            <v-card-text>
              {{ aCar.details }}
            </v-card-text>
            <v-card-actions>
              <v-icon
                @click="copy(index)"
                color="blue"
                icon="mdi-content-copy"
              />
              <v-spacer></v-spacer>
              <v-icon @click="remove(index)" color="red" icon="mdi-delete" />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" class="v-col-md-6 v-col-lg-4">
          <v-card class="mx-auto" title="Add Car" @click="addCar" color="green">
            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-car"></v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-avatar size="24" style="font-size: 2em"> </v-avatar>
            </template>
            <v-card-text> </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12">
          <apexchart
            height="300"
            type="bar"
            :options="options"
            :series="series"
          />
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Car } from "~/scripts/car";
import { CarOptions } from "~/scripts/carOptions";
import VueApexCharts from "vue3-apexcharts";

const carOptions = new CarOptions();

const car: Ref<Car> = ref(new Car(0, "", "", "", 0, 0, "", ""));
const cars = reactive(new Array<Car>());
const maxMiles = ref(200000);
const makes: Ref<string[]> = ref([]);
const models: Ref<string[]> = ref([]);
const styles: Ref<string[]> = ref([]);

// Watchers to update the makes, models, and styles when the year, make, or model changes
watch(
  () => car.value.year,
  async () => {
    if (!car.value) return;

    makes.value = await carOptions.makes(car.value.year);
    if (makes.value.indexOf(car.value.make) == -1) {
      car.value.make = "";
      car.value.model = "";
      car.value.style = "";
    }
  },
  { immediate: true }
);
watch(
  () => car.value.make,
  async () => {
    if (!car.value) return;
    models.value = await carOptions.models(car.value.year, car.value.make);
    if (models.value.length === 1) {
      car.value.model = models.value[0];
    }
    if (models.value.indexOf(car.value.model) == -1) {
      car.value.model = "";
      car.value.style = "";
    }
  },
  { immediate: true }
);
watch(
  () => car.value.model,
  async () => {
    if (!car.value) return;
    styles.value = await carOptions.styles(
      car.value.year,
      car.value.make,
      car.value.model
    );
    if (styles.value.length === 1) {
      car.value.style = styles.value[0];
    }
    if (styles.value.indexOf(car.value.style) == -1) {
      car.value.style = "";
    }
  },
  { immediate: true }
);
watch(
  car,
  () => {
    if (!car.value) return;
    saveCars();
  },
  { deep: true }
);

const options: Ref<any> = ref({});
const series: Ref<any[]> = ref([]);

const setChart = () => {
  options.value = {
    chart: {
      id: "cars",
    },
    carCount: cars.length,
    name: "Cars",
    xaxis: {
      categories: cars.map(
        (car) => car.year + " " + car.make + " " + car.model
      ),
    },
    maintainAspectRatio: false,
  };

  series.value = [
    {
      name: "Cents per Mile",
      data: cars.map((car) => car.centsPerMile()),
    },
  ];
};

onMounted(() => {
  loadCars();
  setChart();
});

const loadCars = () => {
  const carsJson = localStorage.getItem("cars");
  if (carsJson) {
    cars.push(...JSON.parse(carsJson).map((car: any) => Car.deserialize(car)));
  }
  if (cars.length > 0) {
    car.value = cars[0];
  } else {
    car.value = new Car(
      2018,
      "Subaru",
      "Forester",
      "SUV",
      28000,
      32000,
      "Nice green car at the dealership in Spokane",
      "Green"
    );
    cars.push(car.value);
    saveCars();
  }
};

const saveCars = () => {
  localStorage.setItem("cars", JSON.stringify(cars));
  setChart();
};

const select = (index: number) => {
  //car.value = Car.deserialize(cars[index]);
  car.value = cars[index];
};
const remove = (index: number) => {
  // Prompt for confirmation
  if (!confirm("Are you sure you want to delete this car?")) {
    return;
  }
  cars.splice(index, 1);
  if (cars.length > 0) {
    car.value = cars[index - 1];
  } else {
    addCar();
  }
  saveCars();
};

const copy = (index: number) => {
  console.log("Copying Car: " + index);
  const newCar = Car.deserialize(cars[index]);
  newCar.details = "Copy of " + car.value.details;
  cars.push(newCar);
  car.value = newCar;
  saveCars();
};

const addCar = () => {
  car.value = new Car(2020, "", "", "", 0, 0, "", "");
  cars.push(car.value);
};

const variant = (aCar: Car) => {
  return aCar == car.value ? "tonal" : "elevated";
};
</script>

<style scoped>
.math {
  display: flex;
  align-items: center;
  font-size: 1.4em;
  margin-top: 1.2em;
}
</style>
