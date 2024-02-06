<template>
  <v-card
    class="mx-auto"
    :title="car.centsPerMile() + '¢/mile'"
    :subtitle="car.year + ' ' + car.make + ' ' + car.model"
    tonal
    elevation="5"
  >
    <template v-slot:prepend>
      <v-avatar size="48" :color="car.uiColor">
        <v-icon :icon="car.carIcon" size="x-large"></v-icon>
      </v-avatar>
    </template>
    <template v-slot:append>
      <v-avatar size="24" style="font-size: 2em" variant="text">
        {{ car.hotnessIcon }}
      </v-avatar>
    </template>
    <v-card-text>
      {{ "with " + car.miles + " miles for $" + car.price }}
    </v-card-text>
    <v-table density="compact">
      <thead>
        <tr>
          <th>Expected Miles</th>
          <th>Lifetime</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ carOptions.maxMiles - car.miles }}</td>
          <td>{{ expectedYears }} years</td>
          <td>${{ totalCost }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-card-text>
      {{ car.details }}
      <apexchart height="200" :options="options" :series="series" />
    </v-card-text>
    <v-card-actions>
      <v-icon @click="$emit('copy')" color="blue" icon="mdi-content-copy" />
      <v-spacer></v-spacer>
      <v-icon @click="$emit('delete')" color="red" icon="mdi-delete" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Car } from "~/scripts/car";
import { CarOptions } from "~/scripts/carOptions";

const props = defineProps({
  car: { type: Car, required: true },
  carOptions: { type: CarOptions, required: true },
});
const emit = defineEmits({
  copy: () => {
    return true;
  },
  delete: () => {
    return true;
  },
});

const options: Ref<any> = ref({});
const series: Ref<any[]> = ref([]);

let timerId: NodeJS.Timeout = null!;
watch(props.car, () => {
  if (timerId) clearTimeout(timerId);
  timerId = setTimeout(() => {
    setChart();
  }, 500);
});

const expectedYears = ref(0);
const totalCost = ref(0);

const setChart = () => {
  options.value = {
    chart: {
      toolbar: {
        show: false,
      },
      type: "area",
      stacked: true,
      height: 200,
      id: "cars",
    },
    dataLabels: {
      enabled: false,
    },
    name: "",
    xaxis: {
      type: "number",
    },
    maintainAspectRatio: false,
  };

  series.value = props.car.carLifetimeGraph(
    props.carOptions.maxMiles,
    props.carOptions.milesPerYear
  );

  expectedYears.value = series.value[0].data.length;
  totalCost.value = series.value.reduce(
    (acc1, val1) =>
      acc1 + val1.data.reduce((acc2: number, val2: number) => acc2 + val2, 0),
    0
  );
};

onMounted(() => {
  setChart();
});
</script>

<style scoped></style>
