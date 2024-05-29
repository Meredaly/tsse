<script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue'
  import type { PropType } from 'vue'

  import { Pie } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  import COLORS from '@/helpers/colors'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

  import { KindOfActivity } from '../types'

  const props = defineProps({
    items: {
      type: Array as PropType<KindOfActivity[]>,
      default: () => []
    }
  })

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

  const getPercent = (value: number) => {
    const count = dataset.value.reduce((sum: number, data: number): number => sum + data, 0)
    const onePercent = 100 / count
    const percent = Math.round(onePercent * value * 100) / 100
    return percent
  }

  const chartData = computed(() => {
    return {
      labels: labels.value,
      datasets: [
        {
          backgroundColor: [...COLORS],
          data: dataset.value
        }
      ]
    }
  })

  const options = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 2,
        color: '#000',
        padding: 6,
        display: function (context: any) {
          return dataset.value[context.dataIndex]
        },
        formatter: function (value: any, context: any) {
          context
          if (value === 0) {
            return ''
          } else {
            return getPercent(value) + '%'
          }
        }
      },
      legend: {
        display: false
      }
    }
  })
</script>

<template>
  <Pie :data="chartData" :options="options" />
</template>

<style scoped></style>
