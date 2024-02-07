<template>
  <b>
    Cents per Mile is a simple way to compare cars to determine the best value.
  </b>
  <ul>
    <li>
      Early (0-50,000) miles are worth more since there is typically little
      maintenance and typically a warranty. And new cars are fun to drive. There
      is typically a premium for these miles.
    </li>
    <li>
      Late (150,000-200,000) miles are worth less because maintenance is more
      frequent and costly. Old cars can be stressful to drive.
    </li>

    <p>
      The sweet spot can often be found in the middle (50,000-150,000) miles.
      The car has depreciated, but maintenance is still reasonable.
    </p>

    <p>
      Be wary of a used car where the price per mile is equivalent to a new car.
      You are paying top dollar for end-of-life miles.
    </p>
  </ul>

  <apexchart height="200" :options="options" :series="series" />
  <div class="text-caption">
    The blue line is the value of the miles driven during that period. The green
    line is the average cost per mile amortized over the life of the vehicle.
    x-axis is in 10,000 miles.
  </div>

  <p>Calculation: [Total Cost] / ([Max Miles] - [Miles])</p>
  <p>Example: 31,000 / (200,000 - 40,000) = $.1824 = 18.24¢ per mile</p>

  <hr class="mt-4" />

  <p><b>Settings</b></p>
  <ul>
    <li>
      {{ Format.number(carOptions.maxMiles) }} miles is used as a car's
      lifetime.
    </li>
    <li>{{ Format.number(carOptions.milesPerYear) }} miles driven per year.</li>
  </ul>
  <p>Click the gear in the upper right to change these settings.</p>
</template>

<script setup lang="ts">
import { Format } from "~/scripts/format";
import { carOptions } from "~/scripts/carOptions";

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    type: "area",
    stacked: false,
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
  yaxis: {
    labels: {
      formatter: (value: number) => {
        return value.toFixed(0) + "¢";
      },
    },
    max: 20,
    min: 0,
  },
  maintainAspectRatio: false,
};

const series = [
  {
    name: "Value per mile",
    data: [
      20, 20, 20, 17, 17, 17, 17, 17, 16, 16, 15, 15, 15, 14, 13, 12, 12, 11,
      10, 9,
    ],
  },
  {
    name: "Average cost per mile",
    data: [],
  },
];
let totalCost = series[0].data.reduce((acc, num) => acc + num);
console.log(totalCost);
for (const num of series[0].data) {
  series[1].data.push(totalCost / series[0].data.length);
}
</script>

<style scoped lang="sass">
div.v-card-text
  ul
    li
      margin-left: 16px
      margin-right: 16px

  p
    margin-top:12px
</style>
