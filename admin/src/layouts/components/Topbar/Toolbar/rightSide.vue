<script setup lang="ts">
import NavSearch from './NavSearch/index.vue'
import Fullscreen from './Fullscreen/index.vue'
import PageReload from './PageReload/index.vue'
import ColorScheme from './ColorScheme/index.vue'
import SwitchLocale from './SwitchLocale/index.vue'
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'Tools'
})

const router = useRouter()

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const dropdownItems = [
  {
    label: settingsStore.settings.home.title,
    handle: () => router.push({ path: settingsStore.settings.home.fullPath }),
    hide: !settingsStore.settings.home.enable,
    icon: 'ant-design:home-outlined'
  },
  {
    label: '快捷键介绍',
    handle: () => eventBus.emit('global-hotkeys-intro-toggle'),
    hide: settingsStore.mode !== 'pc',
    icon: 'ant-design:info-circle-outlined'
  },
  {
    label: '退出登录',
    handle: () => userStore.logout(),
    divided: true,
    icon: 'ant-design:logout-outlined'
  }
]

const avatarError = ref(true)
watch(
  () => userStore.userInfo.avatar,
  () => {
    if (avatarError.value) {
      avatarError.value = false
    }
  }
)
</script>

<template>
  <div class="flex items-center">
    <NavSearch v-if="settingsStore.settings.toolbar.navSearch" />
    <Fullscreen v-if="settingsStore.settings.toolbar.fullscreen" />
    <PageReload v-if="settingsStore.settings.toolbar.pageReload" />
    <ColorScheme v-if="settingsStore.settings.toolbar.colorScheme" />
    <SwitchLocale />
    <el-dropdown class="flex-center cursor-pointer px-2">
      <div class="flex-center gap-1 text-sm">
        <img
          v-if="userStore.userInfo.avatar && !avatarError"
          :src="userStore.userInfo.avatar"
          :onerror="() => (avatarError = true)"
          class="h-[24px] w-[24px] rounded-full"
        />
        <SvgIcon v-else name="i-carbon:user-avatar-filled-alt" :size="24" class="text-gray-400" />
        {{ userStore.userInfo.nickname ?? userStore.userInfo.username }}
        <SvgIcon name="i-ep:caret-bottom" />
      </div>
      <template #dropdown>
        <template v-for="item in dropdownItems" :key="item.label">
          <el-dropdown-item v-if="!item.hide" :divided="item.divided" @click="item.handle">
            <SvgIcon v-if="item.icon" :name="item.icon" />
            {{ item.label }}
          </el-dropdown-item>
        </template>
      </template>
    </el-dropdown>
  </div>
</template>
