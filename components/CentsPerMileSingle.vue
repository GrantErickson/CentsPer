<template>
  <v-card elevation="3" color="brown" variant="tonal">
    <v-card-title>
      <div class="text-h4">CentsPer Mile</div>
    </v-card-title>
    <v-card-subtitle>
      <div>Apples to apples on used cars</div>
      <div>200,000 miles is used as a car's lifetime</div>
    </v-card-subtitle>
    <v-card-text>
      <v-text-field label="Name" v-model="car.name"></v-text-field>
      <v-text-field label="Price" v-model="car.price"></v-text-field>
      <v-text-field label="Miles" v-model="car.miles"></v-text-field>
      <v-text-field
        label="Cents per Mile"
        :model-value="car.centsPerMile()"
        readonly
      >
      </v-text-field>
      <v-btn @click="save" color="blue">Save</v-btn>

      <v-list v-for="(car, index) in cars" :key="car.key">
        <v-list-item @click="load(index)" elevation="4">
          {{ car.name }} @ {{ car.centsPerMile() }}¢ per mile
          <v-icon @click="remove(index)" color="red" icon="mdi-delete">
          </v-icon>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { Car } from "~/scripts/car";

const car = ref(new Car("My Car", 10000, 100000));
const cars = reactive(new Array<Car>());

onMounted(() => {
  loadCars();
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
};

const load = (index: number) => {
  console.log("Loading");
  car.value = Car.deserialize(cars[index]);
};
const remove = (index: number) => {
  console.log("Loading");
  cars.splice(index, 1);
  saveCars();
};
</script>
