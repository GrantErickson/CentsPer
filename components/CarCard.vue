<template>
  <v-card
    class="mx-auto"
    :title="car.centsPerMile() + '¢ per mile'"
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
      with {{ Format.number(car.miles) }} miles for
      {{ Format.currency(car.price) }}
    </v-card-text>
    <v-table density="compact">
      <thead>
        <tr>
          <th>Expected Miles</th>
          <th class="text-center">Lifetime</th>
          <th class="text-right">Total Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ Format.number(carOptions.maxMiles - car.miles) }}</td>
          <td class="text-center">{{ expectedYears }} years</td>
          <td class="text-right">{{ Format.currency(totalCost) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-card-text>
      {{ car.details }}
      <apexchart height="200" :options="options" :series="series" />
      <v-table density="compact">
        <thead>
          <tr>
            <th>{{ car.make }} Ranking</th>
            <th class="text-right">{{ car.make }} Yearly Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ carOptions.getReliability(car.make).rating }}</td>
            <td class="text-right">
              {{ carOptions.getReliability(car.make).perYearCost }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-icon
        @click.stop="$emit('copy')"
        color="blue"
        icon="mdi-content-copy"
      />
      <v-spacer></v-spacer>
      <v-icon @click.stop="$emit('delete')" color="red" icon="mdi-delete" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Car } from "~/scripts/car";
import { carOptions } from "~/scripts/carOptions";
import { Format } from "~/scripts/format";

const props = defineProps({
  car: { type: Car, required: true },
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

  series.value = props.car.carLifetimeGraph();

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
