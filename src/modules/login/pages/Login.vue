<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useCookies } from 'vue3-cookies'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'

  import { LOGIN } from '@/api/auth.api'

  const router = useRouter()
  const { t } = useI18n()
  const { cookies } = useCookies()

  const form = ref({
    email: '',
    password: ''
  })

  const error = ref<boolean>(false)

  const loading = ref<boolean>(false)
  const login = async (): Promise<void> => {
    loading.value = true
    error.value = false
    try {
      const { data } = await LOGIN({
        data: form.value
      })

      cookies.set('Authorization', data)
      router.push('/')
    } catch (err) {
      console.error(err)
      setTimeout(() => {
        error.value = true
      }, 0)
      loading.value = false
    }
  }
  const isPassword = ref(true)
</script>

<template>
  <div class="login">
    <div class="login__background-image">
      <img src="@/assets/img/login.jpeg" alt="" />
    </div>
    <form class="login__wrapper">
      <div class="login__title">{{ t('login.title') }}</div>
      <!-- <div class="login__sub-title">{{ t('login.subTitle') }}</div> -->
      <form @submit.prevent="login" class="login__form">
        <div class="login__input">
          <text-field
            v-model.trim="form.email"
            :disabled="loading"
            :error="error"
            :label="t('login.login')"
            :placeholder="t('login.login')"
          />
        </div>
        <div class="login__input">
          <text-field
            v-model.trim="form.password"
            :disabled="loading"
            :error="error"
            @click:append="isPassword = !isPassword"
            :appendIcon="isPassword ? 'eye' : 'eyeOff'"
            :type="isPassword ? 'password' : 'text'"
            :label="t('login.password')"
            :placeholder="t('login.password')"
            clickable-append
          />
        </div>
        <div class="login__button">
          <my-button :loading="loading" :disabled="loading" :title="t('login.signIn')" block type="submit" />
        </div>
      </form>
    </form>
  </div>
</template>

<style scoped lang="scss">
  .login {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px;
    overflow: hidden;

    &__background-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-position: bottom;
        object-fit: cover;
        transform: scale(1.3);
        margin-left: 70px;
      }
    }
    // .login__wrapper
    &__wrapper {
      background: rgba(255, 255, 255, 0.4);
      border-radius: var(--box-radius);
      padding: 100px 30px;
      max-width: 480px;
      margin-left: 60px;
      position: relative;
      z-index: 10;
      backdrop-filter: blur(12px);
    }
    // .login__title
    &__title {
      font-weight: 700;
      font-size: 20px;
      line-height: 23px;
      text-align: center;
      color: #3b4758;
      margin-bottom: 10px;
    }
    // .login__sub-title
    &__sub-title {
      font-weight: 700;
      font-size: 10px;
      line-height: 12px;
      text-align: center;
      color: var(--dark);
      margin-bottom: 100px;
    }
    // .login__input
    &__input {
      margin-top: 20px;
    }
    // .login__button
    &__button {
      margin-top: 40px;
    }
  }
</style>
