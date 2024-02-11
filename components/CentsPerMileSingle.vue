<template>
  <v-card elevation="3">
    <v-card-title>
      <div class="text-h4">CentsPer Mile</div>
    </v-card-title>
    <v-card-subtitle> Compare cars by cost per mile. </v-card-subtitle>
    <v-card-text>
      <div class="text-h5 mb-3">My Cars</div>
      <v-progress-circular indeterminate v-if="carOptions.isLoading" />
      <v-row v-if="!carOptions.isLoading">
        <v-col
          v-for="aCar in cars"
          :key="aCar.key"
          cols="12"
          class="v-col-md-6 v-col-lg-4 v-col-xl-3"
        >
          <CarCard
            :car="aCar"
            :maxCentsPerMile="maxCentsPerMile"
            :minCentsPerMile="minCentsPerMile"
            @click="showCarEdit(aCar)"
            @copy="copyCar(aCar)"
            @delete="removeCar(aCar)"
          />
        </v-col>
        <v-col cols="12" class="v-col-md-6 v-col-lg-4 v-col-xl-3">
          <v-card
            id="add-car"
            class="mx-auto"
            title="Add a Car"
            variant="tonal"
            @click="addCar"
            color="green"
            elevation="3"
          >
            <template v-slot:prepend>
              <v-avatar color="blue-darken-2" size="large" class="mt-4">
                <v-icon icon="mdi-plus" size="x-large"></v-icon>
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
    <v-card-actions> </v-card-actions>
  </v-card>

  <v-dialog v-model="showEditor" v-if="car != null" max-width="1000">
    <v-card>
      <v-card-title class="mt-4">
        <v-avatar size="48" :color="car.uiColor" variant="elevated">
          <v-icon :icon="car.carIcon" size="large"></v-icon>
        </v-avatar>
        Edit Your Car
      </v-card-title>
      <v-card-text class="pt-0">
        <CarEdit :car="car" />
      </v-card-text>

      <v-card-actions class="bg-brown-lighten-3 py-4 pr-10">
        <v-spacer></v-spacer>

        <v-btn
          elevation="4"
          text="Save"
          color="green"
          @click="saveCarEdit"
          class="bg-white"
        ></v-btn>
        <v-btn
          elevation="4"
          text="Cancel"
          color="red"
          class="bg-white"
          @click="cancelCarEdit"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, type Ref } from "vue";
import { Car } from "~/scripts/car";
import { carOptions } from "~/scripts/carOptions";
import { Format } from "~/scripts/format";

const car: Ref<Car | null> = ref(null);
const selectedCar: Ref<Car | null> = ref(null); // This is so we know the original to replace
const cars = reactive([] as Car[]);
const makes: Ref<string[]> = ref([]);
const models: Ref<string[]> = ref([]);
const styles: Ref<string[]> = ref([]);
const showEditor = ref(false);
const maxCentsPerMile = ref(0);
const minCentsPerMile = ref(0);
let carIsNew = false;

// TODO: This should be loaded a better way to make sure it awaits.
await carOptions.loadReliabilityData();

const options: Ref<any> = ref({});
const series: Ref<any[]> = ref([]);

const refresh = () => {
  maxCentsPerMile.value = Math.max(...cars.map((car) => car.centsPerMile()));
  minCentsPerMile.value = Math.min(...cars.map((car) => car.centsPerMile()));
};

onMounted(() => {
  loadCars();
  refresh();
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
      0,
      0,
      "Nice green car at the dealership in Spokane",
      "Green"
    );
    cars.push(car.value);
    saveCars();
  }
};

const saveCars = () => {
  localStorage.setItem("cars", JSON.stringify(cars));
  refresh();
};

const removeCar = (clickedCar: Car) => {
  // Prompt for confirmation
  if (!confirm("Are you sure you want to delete this car?")) {
    return;
  }
  let index = cars.indexOf(clickedCar);
  cars.splice(index, 1);
  if (cars.length > 0) {
    car.value = cars[index - 1];
  } else {
    addCar();
  }
  saveCars();
};
const copyCar = (clickedCar: Car) => {
  const newCar = Car.deserialize(clickedCar);
  newCar.details = "Copy of " + newCar.details;
  cars.push(newCar);
  saveCars();
};

const addCar = () => {
  car.value = new Car(2020, "", "", "", 0, 0, 0, 0, "", "blue");
  cars.push(car.value);
  showCarEdit(car.value, true);
};

const showCarEdit = (clickedCar: Car, isNew: boolean = false) => {
  // Create a new car to edit so we can cancel easily.
  selectedCar.value = clickedCar;
  car.value = Car.deserialize(selectedCar.value);
  carIsNew = isNew;
  showEditor.value = true;
};

const saveCarEdit = () => {
  showEditor.value = false;
  // Replace the car with the edited one.
  cars[cars.indexOf(selectedCar.value!)] = car.value!;
  car.value = null;
  selectedCar.value = null;
  carIsNew = false;
  saveCars();
};

const cancelCarEdit = () => {
  // If there is nothing assigned to the car, delete it
  if (carIsNew) {
    cars.splice(cars.indexOf(car.value!), 1);
  }
  carIsNew = false;
  showEditor.value = false;
  car.value = null;
  selectedCar.value = null;
};
</script>

<style scoped>
#add-car :deep(.v-card-item .v-card-title) {
  padding-top: 14px !important;
}
</style>
