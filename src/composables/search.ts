import { ref } from 'vue'

export function useSearch({ getData }: any) {
  const searchText = ref<string>('')

  const searchInterval = ref<ReturnType<typeof setInterval> | null>(null)

  const search = (text: string) => {
    searchText.value = text
    searchInterval.value && clearTimeout(searchInterval.value)

    searchInterval.value = setTimeout(() => {
      getData()
    }, 500)
  }

  return { search, searchText }
}
