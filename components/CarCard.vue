<template>
  <v-card
    class="mx-auto"
    :title="car.centsPerMile().toFixed(1) + '¢ per mile'"
    :subtitle="
      (car.isSale ? 'Selling ' : 'Buying ') +
      car.year +
      ' ' +
      car.make +
      ' ' +
      car.model +
      ' ' +
      car.style
    "
    elevation="5"
  >
    <template v-slot:prepend>
      <v-avatar
        size="64"
        style="display: block"
        :color="car.uiColor"
        variant="elevated"
        class="pt-2"
      >
        <div>
          <v-icon :icon="car.carIcon" size="x-large"></v-icon>
        </div>
        <div>{{ car.isSale ? "Sell " : "Buy " }}</div>
      </v-avatar>
    </template>
    <template v-slot:append>
      <v-tooltip text="Hotness">
        <template v-slot:activator="{ props }">
          <v-avatar
            size="36"
            style="font-size: 2em"
            variant="text"
            v-bind="props"
          >
            {{ car.hotnessIcon }}
          </v-avatar>
        </template>
      </v-tooltip>
    </template>

    <v-progress-linear
      :model-value="ranking"
      :color="rankingColor"
    ></v-progress-linear>

    <v-card-text>
      <div>
        Buy with {{ Format.number(car.miles) }} miles for
        {{ Format.currency(car.price) }}
      </div>
      <div v-if="car.isSale">
        Sell at {{ Format.number(car.sellMiles) }} miles for
        {{ Format.currency(car.sellPrice) }}
      </div>
      <div v-if="!car.isSale">
        Drive until end of life at
        {{ Format.number(carOptions.maxMiles) }} miles.
      </div>

      <div class="mb-4 mt-2 text-body-1">{{ car.details }}</div>

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
              {{ Format.number(car.finalMiles - car.miles) }}
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
      <div class="text-subtitle-1 mt-3">Reliability</div>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="pl-0">CR {{ car.make }} Ranking</th>
            <th class="pr-0 text-right">CR {{ car.make }} Yearly Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pl-0">
              {{ carOptions.getReliability(car.make).rating }}
            </td>
            <td class="pr-0 text-right">
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
  maxCentsPerMile: { type: Number, required: true },
  minCentsPerMile: { type: Number, required: true },
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
const ranking = computed(() => {
  return Math.round(
    ((props.maxCentsPerMile -
      props.car.centsPerMile() -
      props.minCentsPerMile * 0.9 +
      props.minCentsPerMile) /
      (props.maxCentsPerMile - props.minCentsPerMile)) *
      100
  );
});
const rankingColor = computed(() => {
  if (ranking.value < 30) return "red";
  if (ranking.value < 50) return "orange";
  if (ranking.value < 75) return "yellow";
  return "green";
});

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
