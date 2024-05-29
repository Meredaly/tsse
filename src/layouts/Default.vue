<script setup lang="ts">
  import { computed, ref } from 'vue'
  import Sidebar from '@/components/sidebar'
  import Header from '@/components/header'

  import { useAuth } from '@/store/auth'

  const auth = useAuth()

  const isAuth = computed(() => auth.isAuth)

  const isSidebarMini = ref<boolean>(false)
</script>

<template>
  <div v-if="isAuth" class="wrapper">
    <div :class="['wrapper__sidebar', { _mini: isSidebarMini }]">
      <Sidebar :mini="isSidebarMini" />
    </div>
    <div class="wrapper__main">
      <div class="wrapper__header">
        <Header @toggle-menu="isSidebarMini = !isSidebarMini" />
      </div>
      <div class="wrapper__body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    padding: 20px;
    height: 100vh;
    gap: 20px;

    // .wrapper__siebar
    &__sidebar {
      width: 270px;
      height: 100%;
      &._mini {
        width: 80px;
      }
    }
    // .wrapper__main
    &__main {
      flex: 1 1;
      height: 100%;
      display: grid;
      grid-template-rows: 70px 1fr;
      grid-gap: 20px;
    }
    // .wrapper__head
    &__head {
    }
    // .wrapper__body
    &__body {
      overflow: hidden;
    }
  }
</style>
