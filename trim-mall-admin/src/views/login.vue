<route lang="yaml">
meta:
title: 登录
constant: true
layout: false
</route>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import Copyright from '@/layouts/components/Copyright/index.vue'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'Login'
})

const route = useRoute()
const router = useRouter()

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const banner = new URL('../assets/images/login-banner.png', import.meta.url).href
const logo = new URL('../assets/images/logo.png', import.meta.url).href
const title = import.meta.env.VITE_APP_TITLE

const loading = ref(false)
const redirect = ref(route.query.redirect?.toString() ?? settingsStore.settings.home.fullPath)

// 登录
const loginFormRef = ref<FormInstance>()
const loginForm = ref({
  username: localStorage.login_account || '',
  password: '',
  remember: !!localStorage.login_account
})
const loginRules = ref<FormRules>({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' }
  ]
})

function handleLogin() {
  loginFormRef.value &&
    loginFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true
        userStore
          .login(loginForm.value)
          .then(() => {
            loading.value = false
            if (loginForm.value.remember) {
              localStorage.setItem('login_account', loginForm.value.username)
            } else {
              localStorage.removeItem('login_account')
            }
            router.push(redirect.value)
          })
          .catch(() => {
            loading.value = false
          })
      }
    })
}
</script>

<template>
  <div>
    <div class="bg-banner" />
    <div id="login-box">
      <div class="login-banner">
        <img :src="logo" class="logo" />
        <img :src="banner" class="banner" />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" size="large">
        <div class="title-container">
          <div class="title">欢迎使用 {{ title }}</div>
        </div>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
            <template #prefix>
              <SvgIcon name="i-ri:user-3-fill" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" show-password clearable>
            <template #prefix>
              <SvgIcon name="i-ri:lock-2-fill" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" class="w-full" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Copyright />
  </div>
</template>

<style lang="scss" scoped>
[data-mode='mobile'] {
  #login-box {
    position: relative;
    top: inherit;
    left: inherit;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    transform: translateX(0) translateY(0);

    .login-banner {
      width: 100%;
      padding: 20px 0;

      .banner {
        position: relative;
        top: inherit;
        right: inherit;
        display: inherit;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        transform: translateY(0);
      }
    }

    .login-form {
      width: 100%;
      min-height: auto;
      padding: 30px;
    }
  }

  .copyright {
    position: relative;
  }
}

:deep(input[type='password']::-ms-reveal) {
  display: none;
}

.bg-banner {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--g-container-bg), var(--g-bg));
}

#login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  background-color: var(--g-container-bg);
  border-radius: 10px;
  box-shadow: var(--el-box-shadow);
  transform: translateX(-50%) translateY(-50%);

  .login-banner {
    position: relative;
    width: 450px;
    overflow: hidden;
    background-color: var(--g-bg);

    .banner {
      width: 100%;

      @include position-center(y);
    }

    .logo {
      position: absolute;
      top: 20px;
      left: 20px;
      height: 30px;
      border-radius: 4px;
      box-shadow: var(--el-box-shadow-light);
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;
    min-height: 500px;
    padding: 50px;
    overflow: hidden;

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 30px;
        font-size: 1.3em;
        font-weight: bold;
        color: var(--el-text-color-primary);
      }
    }
  }

  .el-form-item {
    margin-bottom: 24px;

    :deep(.el-input) {
      width: 100%;
      height: 48px;
      line-height: inherit;

      input {
        height: 48px;
      }

      .el-input__prefix,
      .el-input__suffix {
        display: flex;
        align-items: center;
      }

      .el-input__prefix {
        left: 10px;
      }

      .el-input__suffix {
        right: 10px;
      }
    }
  }

  :deep(.el-divider__text) {
    background-color: var(--g-container-bg);
  }

  .flex-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .sub-link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    .text {
      margin-right: 10px;
    }
  }
}

.copyright {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  margin: 0;
}
</style>
