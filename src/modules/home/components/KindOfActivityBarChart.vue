<script setup lang="ts">
  import { ref, watchEffect, computed } from 'vue'
  import type { PropType } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  import COLORS from '@/helpers/colors'

  import { KindOfActivity } from '../types'

  const props = defineProps({
    items: {
      type: Array as PropType<KindOfActivity[]>,
      default: () => []
    }
  })

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

  const labels = ref<string[]>([])
  const dataset = ref<number[]>([])

  watchEffect(() => {
    labels.value = props.items.map((item: KindOfActivity) => {
      return item.name
    })
    dataset.value = props.items.map((item: KindOfActivity) => {
      return item.amountMember
    })
  })

  const chartData = computed(() => {
    return {
      labels: labels.value,
      datasets: [
        {
          data: dataset.value,
          backgroundColor: [...COLORS],
          borderRadius: 4,
          padding: 6
        }
      ]
    }
  })

  const chartOptions = ref<any>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        rotation: -90,
        color: '#000',
        anchor: 'start',
        align: 'end',
        clamp: true,
        font: {
          size: 14,
          weight: 500
        },
        formatter: function (value: any, context: any) {
          value
          return labels.value[context.dataIndex]
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
          tickColor: 'transparent'
        }
      },
      y: {
        grid: {
          borderColor: 'transparent',
          tickColor: 'transparent'
        }
      }
    }
  })
</script>

<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
