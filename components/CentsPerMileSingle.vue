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
      <v-row>
        <v-col cols="12" class="v-col-sm-6 v-col-md-3">
          <v-text-field label="Year" v-model="car.year"></v-text-field>
        </v-col>
        <v-col cols="12" class="v-col-sm-6 v-col-md-3">
          <v-text-field label="Make" v-model="car.make"></v-text-field>
        </v-col>
        <v-col cols="12" class="v-col-sm-6 v-col-md-3">
          <v-text-field label="Model" v-model="car.model"></v-text-field>
        </v-col>
        <v-col cols="12" class="v-col-sm-6 v-col-md-3">
          <v-text-field label="Location" v-model="car.location"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="v-col-md-6 v-col-lg-3">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Price"
                v-model="car.price"
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>
            <v-col cols="6">
              <div class="math">÷ ( {{ maxMiles }} -</div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="v-col-md-6 v-col-lg-3">
          <v-row>
            <v-col cols="6">
              <v-text-field label="Miles" v-model="car.miles" />
            </v-col>
            <v-col cols="6"> <div class="math">) x</div> </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="v-col-md-6 v-col-lg-3">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Hotness %"
                v-model="car.hotness"
                type="number"
                append-inner-icon="mdi-percent"
              />
            </v-col>
            <v-col cols="6"> <div class="math">÷ 100 =</div></v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="v-col-md-6 v-col-lg-3">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Cents per Mile"
                :model-value="car.centsPerMile() + ' ¢/mile'"
                readonly
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-btn @click="save" color="blue" class="mb-5">Save</v-btn>

      <v-row>
        <v-col
          v-for="(car, index) in cars"
          :key="car.key"
          cols="12"
          class="v-col-md-6 v-col-lg-4"
        >
          <v-card
            class="mx-auto"
            :title="car.centsPerMile() + '¢/mile'"
            :subtitle="car.year + ' ' + car.make + ' ' + car.model"
          >
            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-car"></v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-avatar size="24" style="font-size: 2em">
                {{ car.hotnessIcon }}
              </v-avatar>
            </template>
            <v-card-text>
              {{ car.location }}
            </v-card-text>
            <v-card-actions>
              <v-icon @click="remove(index)" color="red" icon="mdi-delete" />
            </v-card-actions>
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
import VueApexCharts from "vue3-apexcharts";

const car = ref(new Car("Unknown", "Unknown", 2020, 10000, 100000, "A Friend"));
const cars = reactive(new Array<Car>());
const maxMiles = ref(200000);

const options = ref({});
const series = ref();

const setChart = () => {
  options.value = {
    chart: {
      id: "cars",
    },
    carCount: cars.length,
    name: car.value.make,
    xaxis: {
      categories: cars.map((car) => car.make + " " + car.model),
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
};

const saveCars = () => {
  console.log("Saving Cars");
  localStorage.setItem("cars", JSON.stringify(cars));
};

const save = () => {
  console.log("Saving");
  console.log(cars);
  cars.push(Car.deserialize(car.value));
  saveCars();
  setChart();
};

const load = (index: number) => {
  console.log("Loading");
  car.value = Car.deserialize(cars[index]);
};
const remove = (index: number) => {
  // Prompt for confirmation
  if (!confirm("Are you sure you want to delete this car?")) {
    return;
  }
  console.log("Loading");
  cars.splice(index, 1);
  saveCars();
  setChart();
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
