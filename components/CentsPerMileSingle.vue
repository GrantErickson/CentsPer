<template>
  <v-card elevation="3" color="brown" variant="tonal">
    <v-card-title>
      <div class="text-h4">Cents per Mile</div>
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
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { Car } from "~/scripts/car.ts";

const car = ref(new Car("My Car", 10000, 100000));
</script>