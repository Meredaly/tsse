<script setup lang="ts">
import { computed, ref } from "vue";
import type { PropType } from "vue";
import Icon from "@/UI/Icon";
import TextField from "@/UI/TextField.vue";
import { useDropdown } from "@/composables/dropdown";

interface Item {
  id?: string | number;
  uuid?: string;
  name: string;
}

const emit = defineEmits(["selectItem", "checkedItem", "search"]);

const props = defineProps({
  label: { type: String, default: null },
  placeholder: { type: String, default: "" },
  items: { type: Array as PropType<Item[]>, default: () => [] },
  selectedItem: { type: Object as PropType<Item | null>, default: null },
  background: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  width: { type: String, default: null },
  disabled: { type: Boolean, default: false },
});

const { dropdownBody, dropdownMenu, showDropdown, closeDropdown } =
  useDropdown();

const search = ref("");

const selectItem = (item: Item) => {
  closeDropdown();
  search.value = "";
  emit("selectItem", item);
};

const searching = (text: string): void => {
  emit("search", text);
  search.value = text;
};

const openDropdown = () => {
  if (!props.disabled) {
    showDropdown.value = true;
  }
};

const classes = computed(() => [
  "dropdown",
  {
    "dropdown--background": props.background,
    "dropdown--focused": showDropdown.value,
    "dropdown--required": props.required,
    "dropdown--success": props.success,
    "dropdown--error": props.error,
    "dropdown--disabled": props.disabled,
  },
]);
</script>

<template>
  <div :class="classes" ref="dropdownBody">
    <div v-if="label" class="dropdown__label">{{ label }}</div>
    <div class="dropdown__box">
      <div
        @click="showDropdown ? closeDropdown() : openDropdown()"
        class="dropdown__button"
      >
        <p v-if="selectedItem" class="dropdown__button-text">
          {{ selectedItem.name }}
        </p>
        <p v-if="!selectedItem" class="dropdown__button-placeholder">
          {{ placeholder }}
        </p>
        <span class="dropdown__button-icon">
          <icon name="chevronBottom" />
        </span>
      </div>
      <div
        v-if="showDropdown && !disabled"
        ref="dropdownMenu"
        class="dropdown__menu _box"
      >
        <div v-if="searchable" class="dropdown__search">
          <text-field
            @update-value="searching"
            :value="search"
            prepend-icon="search"
          />
        </div>
        <div class="dropdown__list">
          <div
            v-for="menuItem in items"
            :key="menuItem.id"
            @click="selectItem(menuItem)"
            :class="[
              'dropdown__item',
              { _active: menuItem.uuid === selectedItem?.uuid },
            ]"
          >
            <div class="dropdown__item-text">{{ menuItem.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  width: 100%;
  position: relative;
  // .dropdown__label
  &__label {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: var(--black);
    margin-bottom: 6px;
  }
  // .dropdown__box
  &__box {
  }
  // .dropdown__button
  &__button {
    width: 100%;
    background: var(--input-background);
    border: 1px solid var(--hover);
    border-radius: var(--border-radius);
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 10px 19px;
    cursor: pointer;
    user-select: none;
  }

  &--background {
    .dropdown__button {
      background-color: var(--white);
    }
  }
  &--required {
    .dropdown__label {
      &::after {
        content: "*";
        color: var(--danger);
      }
    }
  }
  &--focused {
    .dropdown__button {
      border-color: var(--primary);
    }
    .dropdown__button-icon {
      transform: rotate(180deg);
    }
  }

  &--success {
    .dropdown__button {
      border-color: var(--success);
    }
  }

  &--error {
    animation: 0.2s invalid forwards;
    .dropdown__button {
      border-color: var(--danger);
    }
  }

  // .dropdown__button-text
  &__button-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: var(--text);
    padding: 0px 5px 0px 0;
    flex: 1 1;
  }
  // .dropdown__button-placeholder
  &__button-placeholder {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    padding: 2px 5px 2px 0;
    flex: 1 1;
    color: var(--caption);
  }
  // .dropdown__button-icon
  &__button-icon {
    display: flex;
    color: var(--caption);
    &:deep() {
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  // .dropdown__menu
  &__menu {
    position: absolute;
    z-index: 3;
    width: 100%;
    padding: 0;
    overflow: hidden;
    box-shadow: var(--shadow);
    background: var(--white);
    top: calc(100% + 5px);
    border-radius: var(--border-radius);
  }
  // .dropdown__search
  &__search {
    padding: 10px;
    border-bottom: 1px solid var(--hover);
  }
  // .dropdown__list
  &__list {
    max-height: 300px;
    overflow: auto;
  }
  // .dropdown__item
  &__item {
    display: block;
    width: 100%;
    padding: 10px 24px;
    border-radius: var(--box-radius);
    background-color: transparent;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: var(--dark);
    cursor: pointer;
    &:hover,
    &._active {
      background-color: var(--hover-light);
    }
  }
  // .dropdown__item-text
  &__item-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
}

@keyframes invalid {
  0% {
    z-index: 1;
    transform: translateX(0px);
  }
  25% {
    transform: translateX(5px);
    z-index: 1;
  }
  50% {
    transform: translateX(0px);
    z-index: 1;
  }
  75% {
    transform: translateX(-5px);
    z-index: 1;
  }
  100% {
    transform: translateX(0px);
    z-index: 1;
  }
}
</style>
