<template>
  <v-card elevation="3">
    <v-card-title>
      <div class="text-h4">CentsPer Mile</div>
    </v-card-title>
    <v-card-subtitle>
      <div>Apples to apples on used cars</div>
      <div>{{ carOptions.maxMiles }} miles is used as a car's lifetime</div>
    </v-card-subtitle>
    <v-card-text>
      <div class="text-h5 mb-3">My Cars</div>
      <v-progress-circular indeterminate v-if="!carOptions.isLoaded" />
      <v-row v-if="carOptions.isLoaded">
        <v-col
          v-for="(aCar, index) in cars"
          :key="aCar.key"
          cols="12"
          class="v-col-md-6 v-col-lg-4"
        >
          <CarCard
            :car="aCar"
            @click="showCarEdit(index)"
            @copy="copyCar(index)"
            @delete="removeCar(index)"
          />
        </v-col>
        <v-col cols="12" class="v-col-md-6 v-col-lg-4">
          <v-card
            class="mx-auto"
            title="Add Car"
            variant="tonal"
            @click="addCar"
            color="green"
          >
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

  <v-dialog v-model="showEditor" v-if="car != null">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Open Dialog"> </v-btn>
    </template>

    <template>
      <v-card title="Edit Car">
        <v-card-text>
          <CarEdit :car="car" />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Save" color="green" @click="saveCarEdit"></v-btn>
          <v-btn text="Cancel" color="red" @click="cancelCarEdit"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, type Ref } from "vue";
import { Car } from "~/scripts/car";
import { carOptions } from "~/scripts/carOptions";
import VueApexCharts from "vue3-apexcharts";

const car: Ref<Car | null> = ref(null);
const selectedCar: Ref<Car | null> = ref(null); // This is so we know the original to replace
const cars = reactive(new Array<Car>());
const makes: Ref<string[]> = ref([]);
const models: Ref<string[]> = ref([]);
const styles: Ref<string[]> = ref([]);
const showEditor = ref(false);

// TODO: This should be loaded a better way to make sure it awaits.
await carOptions.loadReliabilityData();

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

const removeCar = (index: number) => {
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
const copyCar = (index: number) => {
  const newCar = Car.deserialize(cars[index]);
  newCar.details = "Copy of " + car.value?.details;
  cars.push(newCar);
  car.value = newCar;
  saveCars();
};

const addCar = () => {
  car.value = new Car(2020, "", "", "", 0, 0, "", "");
  cars.push(car.value);
};

const showCarEdit = (index: number) => {
  // Create a new car to edit so we can cancel easily.
  selectedCar.value = cars[index];
  car.value = Car.deserialize(selectedCar.value);
  showEditor.value = true;
};

const saveCarEdit = () => {
  showEditor.value = false;
  // Replace the car with the edited one.
  cars[cars.indexOf(selectedCar.value)] = car.value;
  car.value = null;
  selectedCar.value = null;
  saveCars();
};

const cancelCarEdit = () => {
  showEditor.value = false;
  car.value = null;
  selectedCar.value = null;
};
</script>

<style scoped></style>
