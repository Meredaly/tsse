import { onMounted, ref } from 'vue'

export function useDropdown() {
  const dropdownBody = ref<null | HTMLElement>(null)
  const dropdownMenu = ref<null | HTMLElement>(null)
  const showDropdown = ref<boolean>(false)
  const showTop = ref<boolean>(false)

  const openDropdown = () => {
    showDropdown.value = true
    setTimeout(() => {
      let bodyPosition = dropdownBody.value?.getBoundingClientRect()
      let menuPosition = dropdownMenu.value?.getBoundingClientRect()
      if (bodyPosition && menuPosition) {
        if (window.innerHeight - bodyPosition.y < menuPosition.height + 100) {
          showTop.value = true
        } else {
          showTop.value = false
        }
      }
    }, 0)
  }

  const closeDropdown = () => {
    showDropdown.value = false
  }

  const dropdownToggle = (status: boolean) => {
    dropdownMenu.value && (dropdownMenu.value.style.height = status ? dropdownMenu.value.scrollHeight + 'px' : '')
  }

  onMounted(() => {
    document.addEventListener('click', (event: Event) => {
      if (event) {
        const target = event.target as HTMLElement
        if (target) {
          const isClickInside = dropdownBody.value?.contains(target)

          if (!isClickInside) {
            showDropdown.value = false
            dropdownToggle(showDropdown.value)
          }
        }
      }
    })
  })

  return {
    dropdownBody,
    dropdownMenu,
    showDropdown,
    showTop,
    openDropdown,
    closeDropdown,
    dropdownToggle
  }
}
