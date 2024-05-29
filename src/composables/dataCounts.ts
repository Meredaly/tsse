import { computed } from 'vue'

export function useDataCounts({ page, limit, count }: any) {
  const startData = computed(() => {
    return (page.value - 1) * limit.value + 1
  })

  const endData = computed(() => {
    let endCount = (page.value - 1) * limit.value + limit.value
    return endCount > count.value ? count.value : endCount
  })

  return {
    startData,
    endData
  }
}
