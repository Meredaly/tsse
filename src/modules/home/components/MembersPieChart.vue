<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  import { Pie } from 'vue-chartjs'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

  const props = defineProps({
    paid: {
      type: Number,
      default: 0
    },
    notPaid: {
      type: Number,
      default: 0
    }
  })

  const data = computed(() => {
    return {
      labels: ['Оплачено', 'Время истекло'],
      datasets: [
        {
          backgroundColor: ['#20ba72', '#ffc554'],
          data: [props.paid, props.notPaid]
        }
      ]
    }
  })

  const options = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false
      },
      legend: {
        display: false
      }
    }
  })
</script>

<template>
  <Pie :data="data" :options="options" />
</template>

<style scoped></style>
