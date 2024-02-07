<template>
  <v-card
    class="mx-auto"
    :title="car.centsPerMile() + '¢ per mile'"
    :subtitle="car.year + ' ' + car.make + ' ' + car.model + ' ' + car.style"
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
      <div>
        with {{ Format.number(car.miles) }} miles for
        {{ Format.currency(car.price) }}
      </div>
      <div class="mb-4">{{ car.details }}</div>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="pl-0">Expected Miles</th>
            <th class="text-center">Lifetime</th>
            <th class="pr-0 text-right">Yearly Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pl-0">
              {{ Format.number(carOptions.maxMiles - car.miles) }}
            </td>
            <td class="text-center">{{ expectedYears }} years</td>
            <td class="pr-0 text-right">{{ Format.currency(totalCost) }}</td>
          </tr>
        </tbody>
      </v-table>

      <hr class="mt-2 mb-3" />
      <div class="text-subtitle-1 mt-3">
        <div v-if="carOptions.showGraphCumulative">Cumulative Yearly Costs</div>
        <div v-if="!carOptions.showGraphCumulative">Yearly Costs</div>
      </div>
      <apexchart height="200" :options="options" :series="series" />

      <hr class="mt-2 mb-3" />
      <v-table density="compact">
        <thead>
          <tr>
            <th>CR {{ car.make }} Ranking</th>
            <th class="text-right">CR {{ car.make }} Yearly Cost</th>
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
  if (carOptions.showGraphCumulative) {
    totalCost.value =
      series.value.reduce(
        (acc: number, val: any) => acc + val.data[val.data.length - 1],
        0
      ) / expectedYears.value;
  } else {
    totalCost.value =
      series.value.reduce(
        (acc1, val1) =>
          acc1 +
          val1.data.reduce((acc2: number, val2: number) => acc2 + val2, 0),
        0
      ) / expectedYears.value;
  }
};

onMounted(() => {
  setChart();
});
</script>

<style scoped></style>
