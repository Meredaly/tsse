import { ref } from 'vue'
import { SelectCheckboxItem, TableHeadItem } from '@/types'
import { useCookies } from 'vue3-cookies'
import { useI18n } from 'vue-i18n'

interface PropsData {
  FILTER_NAME: string
  TABLE_HEAD: TableHeadItem[]
}

export function useFilters({ FILTER_NAME, TABLE_HEAD }: PropsData) {
  const { cookies } = useCookies()
  const { t } = useI18n()

  const showFilter = ref<boolean>(false)

  const saveFilter = (selectedFilters: SelectCheckboxItem[]) => {
    TABLE_HEAD.forEach((head: TableHeadItem): void => {
      head.visibility = selectedFilters.some((selectedCheckboxItem) => selectedCheckboxItem.uuid === head.uuid)
    })
    const selectedFiltersId = selectedFilters.map((selectedFilter) => selectedFilter.uuid)
    cookies.set(FILTER_NAME, selectedFiltersId.join(','), 10000000000)

    closeFilter()
  }

  const filterItems = ref<SelectCheckboxItem[]>([])
  const selectedFilters = ref<SelectCheckboxItem[]>([])
  const openFilter = () => {
    filterItems.value = TABLE_HEAD.map((head: TableHeadItem): SelectCheckboxItem => {
      return {
        uuid: head.uuid,
        name: t(head.title)
      }
    })

    selectedFilters.value = TABLE_HEAD.filter((head: TableHeadItem): boolean => head.visibility).map((head: TableHeadItem): SelectCheckboxItem => {
      return {
        uuid: head.uuid,
        name: t(head.title)
      }
    })

    showFilter.value = true
  }

  const closeFilter = (): void => {
    showFilter.value = false
  }

  const getFilters = (): void => {
    const savedFilters = cookies.get(FILTER_NAME)?.split(',') || null
    if (savedFilters) {
      TABLE_HEAD.forEach((head: TableHeadItem): void => {
        head.visibility = savedFilters.includes(head.uuid)
      })
    }
  }

  return {
    getFilters,
    closeFilter,
    openFilter,
    saveFilter,
    selectedFilters,
    filterItems,
    showFilter
  }
}
