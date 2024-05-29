<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue'
  import Icon from '@/UI/Icon'

  const emit = defineEmits(['selectDate'])

  const props = defineProps({
    date: { type: String, default: '' }
  })

  const selectedDate = reactive({
    day: 1,
    month: 0,
    year: 0
  })

  const currentDate = reactive({
    day: 0,
    month: 0,
    year: 0
  })

  const calendarStartDay = ref<number>(0)
  const daysPrevMonth = ref<number>(0)
  const daysCurrentMonth = ref<number>(0)
  const nextMonthDayCount = ref<number>(0)

  const monthNames = ref<string[]>([
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ])
  const weekNames = ref<string[]>(['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'])
  const yearNumbers = computed(() => {
    let arr = []
    for (let i = 1900; i <= 2100; i++) {
      arr.push(i)
    }
    return arr
  })

  const createCalendar = (year: number, month: number) => {
    const calendarMonth = new Date(year, month)

    selectedDate.year = year
    selectedDate.month = month

    calendarStartDay.value = calendarMonth.getDay() === 0 ? 7 : calendarMonth.getDay()

    let prevYear = year
    let prevMonth = month - 1
    if (prevMonth < 0) {
      prevMonth = 0
      prevYear = year - 1
    }

    daysPrevMonth.value = 32 - new Date(prevYear, prevMonth, 32).getDate()
    daysCurrentMonth.value = 32 - new Date(year, month, 32).getDate()
    nextMonthDayCount.value = 42 - calendarStartDay.value - daysCurrentMonth.value + 1
  }

  const prevMonth = () => {
    selectedDate.month = selectedDate.month - 1
    if (selectedDate.month < 0) {
      selectedDate.month = 11
      selectedDate.year = selectedDate.year - 1
    }
    createCalendar(selectedDate.year, selectedDate.month)
  }

  const nextMonth = () => {
    selectedDate.month = selectedDate.month + 1
    if (selectedDate.month > 11) {
      selectedDate.month = 0
      selectedDate.year = selectedDate.year + 1
    }
    createCalendar(selectedDate.year, selectedDate.month)
  }

  const selectYear = (year: number) => {
    selectedDate.year = year
    createCalendar(selectedDate.year, selectedDate.month)
    toggleYear()
  }

  const selectMonth = (month: number) => {
    selectedDate.month = month
    createCalendar(selectedDate.year, selectedDate.month)
    toggleMonth()
  }

  const selectDay = (day: number) => {
    selectedDate.day = day
    emit('selectDate', `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`)
  }

  const showMonth = ref(false)
  const toggleMonth = () => {
    showMonth.value = !showMonth.value
    showYear.value = false
  }

  const showYear = ref(false)
  const toggleYear = () => {
    showYear.value = !showYear.value
    showMonth.value = false
  }
  const deleteDate = () => {
    emit('selectDate', '')
  }
  const updateDate = (date: string) => {
    let newDate = new Date(date)

    if (newDate.toString() === 'Invalid Date') {
      newDate = new Date()
    }

    selectedDate.day = newDate.getDate()
    selectedDate.month = newDate.getMonth()
    selectedDate.year = newDate.getFullYear()

    currentDate.day = newDate.getDate()
    currentDate.month = newDate.getMonth()
    currentDate.year = newDate.getFullYear()
  }

  watch(
    () => props.date,
    (date) => {
      updateDate(date)
      createCalendar(selectedDate.year, selectedDate.month)
    }
  )

  updateDate(props.date)
  createCalendar(selectedDate.year, selectedDate.month)
</script>

<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="calendar__month-year">
        <div @click="toggleMonth" :class="['calendar__month-name', { _active: showMonth }]">{{ monthNames[selectedDate.month] }}</div>
        <span>-</span>
        <div @click="toggleYear" :class="['calendar__year-name', { _active: showYear }]">{{ selectedDate.year }}</div>
      </div>
      <div class="calendar__arrows">
        <button @click="prevMonth" class="calendar__arrow-prev">
          <icon name="chevronLeft" />
        </button>
        <button @click="nextMonth" class="calendar__arrow-next">
          <icon name="chevronRight" />
        </button>
      </div>
    </div>
    <div class="calendar__body">
      <div class="calendar__weekdays">
        <div v-for="weekName in weekNames" class="calendar__weekday">{{ weekName }}</div>
      </div>
      <div class="calendar__days">
        <template v-for="day in daysPrevMonth" :key="'other-' + day">
          <div v-if="day >= daysPrevMonth - calendarStartDay + 2" class="calendar__day calendar__day-other">
            <div class="calendar__day-text">{{ day }}</div>
          </div>
        </template>
        <template v-for="day in daysCurrentMonth" :key="'current-' + day">
          <div
            @click="selectDay(day)"
            :class="[
              'calendar__day',
              {
                calendar__day_active: selectedDate.year === currentDate.year && selectedDate.month === currentDate.month && day === currentDate.day
              }
            ]"
          >
            <div class="calendar__day-box"></div>
            <div class="calendar__day-text">{{ day }}</div>
          </div>
        </template>
        <template v-for="day in nextMonthDayCount" :key="'other-' + day">
          <div class="calendar__day calendar__day-other">
            <div class="calendar__day-text">{{ day }}</div>
          </div>
        </template>
      </div>
      <div v-show="showMonth" class="calendar__months _active">
        <div
          v-for="index in 12"
          @click="selectMonth(index - 1)"
          :class="['calendar__month', { calendar__month_active: selectedDate.month === index - 1 }]"
        >
          {{ monthNames[index - 1] }}
        </div>
      </div>
      <div v-show="showYear" class="calendar__years _active">
        <div
          v-for="yearNumber in yearNumbers"
          @click="selectYear(yearNumber)"
          :class="['calendar__year', { calendar__year_active: selectedDate.year === yearNumber }]"
        >
          {{ yearNumber }}
        </div>
      </div>
    </div>
    <div class="calendar__bot">
      <button @click="deleteDate">Удалить дату</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .calendar {
    width: 256px;
    height: 336px;
    background: var(--white);
    border: 1px solid var(--hover);
    border-radius: 6px;
    overflow: hidden;

    // .calendar__header
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 16px 7px 16px;
    }
    // .calendar__month-year
    &__month-year {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
      color: var(--text);
      &._active {
        background-color: var(--primary);
      }
    }
    // .calendar__month-name
    &__month-name {
      cursor: pointer;
      padding: 4px 10px;
      border: 1px solid var(--hover);
      border-radius: 4px;
      color: var(--caption);
      &._active {
        background-color: var(--primary);
        border-color: var(--primary);
        color: var(--white);
      }
    }
    // .calendar__year-name
    &__year-name {
      cursor: pointer;
      padding: 4px 10px;
      border: 1px solid var(--hover);
      border-radius: 4px;
      color: var(--caption);
      &._active {
        background-color: var(--primary);
        border-color: var(--primary);
        color: var(--white);
      }
    }
    // .calendar__arrows
    &__arrows {
      display: flex;
      gap: 6px;
      align-items: center;
      color: var(--white);
    }
    // .calendar__arrow-prev
    &__arrow-prev {
      background-color: transparent;
      color: var(--text);
    }
    // .calendar__arrow-next
    &__arrow-next {
      background-color: transparent;
      color: var(--text);
    }
    // .calendar__body
    &__body {
      position: relative;
      padding: 0px 16px 8px 16px;
    }
    // .calendar__weekdays
    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    // .calendar__weekday
    &__weekday {
      width: 32px;
      height: 32px;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-transform: uppercase;
      color: var(--caption);
      letter-spacing: 0.4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .calendar__days
    &__days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    // .calendar__day
    &__day {
      width: 32px;
      height: 32px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      color: var(--text);
      border-right: 1px solid var(--hover);
      border-bottom: 1px solid var(--hover);
      &:nth-child(7n) {
        border-right-color: transparent;
      }
      &:nth-last-child(1),
      &:nth-last-child(2),
      &:nth-last-child(3),
      &:nth-last-child(4),
      &:nth-last-child(5),
      &:nth-last-child(6),
      &:nth-last-child(7) {
        border-bottom-color: transparent;
      }
      &:hover,
      &_active {
        .calendar__day-box {
          background-color: var(--primary);
          color: var(--white);
        }
        .calendar__day-box + .calendar__day-text {
          color: var(--white);
        }
      }
    }
    // .calendar__day-other
    &__day-other {
      user-select: none;
      cursor: default;
      color: var(--hover);
    }
    // .calendar__day-text
    &__day-text {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      position: relative;
      z-index: 1;
    }
    // .calendar__day-box
    &__day-box {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
    }
    // .calendar__months
    &__months {
      position: absolute;
      top: 0;
      left: 0;
      background: var(--white);
      width: 100%;
      height: 100%;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 20px 16px;
      display: none;
      &._active {
        display: grid;
      }
    }
    // .calendar__month
    &__month {
      color: var(--text);
      border-right: 1px solid var(--hover);
      border-bottom: 1px solid var(--hover);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:nth-child(3n) {
        border-right-color: transparent;
      }
      &:nth-last-child(1),
      &:nth-last-child(2),
      &:nth-last-child(3) {
        border-bottom-color: transparent;
      }
      &_active,
      &:hover {
        background-color: var(--primary);
        color: var(--white);
      }
    }
    // .calendar__years
    &__years {
      position: absolute;
      top: 0;
      left: 0;
      background: var(--white);
      width: 100%;
      height: 100%;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 20px 16px;
      overflow-y: auto;
      display: none;
      &._active {
        display: grid;
      }
    }
    // .calendar__year
    &__year {
      color: var(--text);
      border-right: 1px solid var(--hover);
      border-bottom: 1px solid var(--hover);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 48px;
      &:nth-child(3n) {
        border-right-color: transparent;
      }
      &:nth-last-child(1),
      &:nth-last-child(2),
      &:nth-last-child(3) {
        border-bottom-color: transparent;
      }
      &_active,
      &:hover {
        background-color: var(--primary);
        color: var(--white);
      }
    }
    // .calendar__bot
    &__bot {
      height: 50px;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px solid var(--hover);
      button {
        padding: 6px 20px;
        width: 100%;
        height: fit-content;
        border-radius: var(--border-radius);
        background: var(--primary);
        color: var(--white);
        border-color: var(--primary);
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
</style>
