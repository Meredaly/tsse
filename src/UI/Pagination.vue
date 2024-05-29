<script setup lang="ts">
  import { reactive, computed } from 'vue'
  import MIcons from '@/UI/Icon'

  const emit = defineEmits(['input', 'clickPage'])
  const props = defineProps({
    modelValue: {
      type: Number,
      required: true
    },
    pageCount: {
      type: Number,
      required: true
    }
  })

  const paginationClasses = reactive({
    ul: 'pagination',
    li: 'pagination__item',
    liActive: 'pagination__item--active',
    liDisable: 'pagination__item--disable',
    button: 'pagination__link',
    buttonActive: 'pagination__link--active',
    buttonDisable: 'pagination__link--disable'
  })

  const paginationLabels = reactive({
    first: '&laquo;',
    prev: '&lsaquo;',
    next: '&rsaquo;',
    last: '&raquo;'
  })

  const items = computed(() => {
    let valPrev = props.modelValue > 1 ? props.modelValue - 1 : 1 // for easier navigation - gives one previous page
    let valNext = props.modelValue < props.pageCount ? props.modelValue + 1 : props.pageCount // one next page
    let extraPrev = valPrev === 3 ? 2 : null
    let extraNext = valNext === props.pageCount - 2 ? props.pageCount - 1 : null
    let dotsBefore = valPrev > 3 ? 2 : null
    let dotsAfter = valNext < props.pageCount - 2 ? props.pageCount - 1 : null
    let output = []
    for (let i = 1; i <= props.pageCount; i += 1) {
      if ([1, props.pageCount, props.modelValue, valPrev, valNext, extraPrev, extraNext, dotsBefore, dotsAfter].includes(i)) {
        output.push({
          label: i,
          active: props.modelValue === i,
          disable: [dotsBefore, dotsAfter].includes(i)
        })
      }
    }
    return output
  })

  const hasFirst = computed(() => {
    return props.modelValue === 1
  })
  const hasLast = computed(() => {
    return props.modelValue === props.pageCount
  })

  const prev = () => {
    !hasFirst && emit('clickPage', props.modelValue - 1)
  }
  const goto = (page: number) => {
    emit('clickPage', page)
  }
  const next = () => {
    !hasLast && emit('clickPage', props.modelValue + 1)
  }
</script>

<template>
  <ul :class="paginationClasses.ul">
    <li v-if="paginationLabels.prev" :class="`${paginationClasses.li} ${hasFirst ? paginationClasses.liDisable : ''}`">
      <button
        @click="prev"
        :disabled="hasFirst"
        :class="`${paginationClasses.button} ${hasFirst ? paginationClasses.buttonDisable : ''} pagination__arrow`"
      >
        <MIcons name="chevronLeft" />
      </button>
    </li>

    <li
      v-for="page in items"
      :key="page.label"
      :class="`${paginationClasses.li} ${page.active ? paginationClasses.liActive : ''} ${page.disable ? paginationClasses.liDisable : ''}`"
    >
      <span v-if="page.disable" :class="`${paginationClasses.button} ${paginationClasses.buttonDisable}`"> ... </span>
      <button v-else @click="goto(page.label)" :class="`${paginationClasses.button} ${page.active ? paginationClasses.buttonActive : ''}`">
        {{ page.label }}
      </button>
    </li>

    <li v-if="paginationLabels.next" :class="`${paginationClasses.li} ${hasLast ? paginationClasses.liDisable : ''}`">
      <button
        @click="next"
        :disabled="hasLast"
        :class="`${paginationClasses.button} ${hasLast ? paginationClasses.buttonDisable : ''} pagination__arrow`"
      >
        <MIcons name="chevronRight" />
      </button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .pagination {
    display: flex;
    gap: 10px;
    // .pagination__item
    &__item {
      &--active {
      }
      &--disable {
      }
      span {
      }
    }
    // .pagination__link
    &__link {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      color: var(--dark);
      border-radius: 16px;
      min-width: 32px;
      padding: 6px;
      display: block;
      background: var(--hover);
      border-radius: var(--border-radius);

      &:hover {
        background: var(--dark);
        color: var(--white);
      }
      &--active {
        color: var(--white);
        background: var(--primary);
        &:hover {
          background: var(--primary);
        }
      }
      &--disable {
        pointer-events: none;
      }
    }

    // .pagination__arrow
    &__arrow {
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
    }
  }
</style>
