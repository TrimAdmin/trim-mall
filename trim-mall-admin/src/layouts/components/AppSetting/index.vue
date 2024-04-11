<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import Message from 'vue-m-message'
import settingsDefault from '@/settings.default'
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'

defineOptions({
  name: 'AppSetting'
})

const route = useRoute()

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const isShow = ref(false)

watch(
  () => settingsStore.settings.menu.menuMode,
  (value) => {
    if (value === 'single') {
      menuStore.setActived(0)
    } else {
      menuStore.setActived(route.fullPath)
    }
  }
)

onMounted(() => {
  eventBus.on('global-app-setting-toggle', () => {
    isShow.value = !isShow.value
  })
})

const { copy, copied, isSupported } = useClipboard()

watch(copied, (val) => {
  if (val) {
    Message.success('复制成功，请粘贴到 src/settings.ts 文件中！', {
      zIndex: 2000
    })
  }
})

function isObject(value: any) {
  return typeof value === 'object' && !Array.isArray(value)
}

// 比较两个对象，并提取出不同的部分
function getObjectDiff(originalObj: Record<string, any>, diffObj: Record<string, any>) {
  if (!isObject(originalObj) || !isObject(diffObj)) {
    return diffObj
  }
  const diff: Record<string, any> = {}
  for (const key in diffObj) {
    const originalValue = originalObj[key]
    const diffValue = diffObj[key]
    if (JSON.stringify(originalValue) !== JSON.stringify(diffValue)) {
      if (isObject(originalValue) && isObject(diffValue)) {
        const nestedDiff = getObjectDiff(originalValue, diffValue)
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff
        }
      } else {
        diff[key] = diffValue
      }
    }
  }
  return diff
}

function handleCopy() {
  copy(JSON.stringify(getObjectDiff(settingsDefault, settingsStore.settings), null, 2))
}

const { store } = useColorMode()

function handleColorSchemeChange(value: any) {
  store.value = value
}
</script>

<template>
  <el-drawer v-model="isShow" title="应用配置">
    <el-alert type="error" :closable="false" class="text-sm/6">
      <p class="my-1">
        应用配置可实时预览效果，但只是临时生效，要想真正应用于项目，可以点击下方的「复制配置」按钮，并将配置粘贴到
        src/settings.ts 文件中。
      </p>
      <p class="my-1">注意：在生产环境中应关闭该模块。</p>
    </el-alert>
    <el-divider>颜色主题风格</el-divider>
    <div class="flex items-center justify-center">
      <el-radio-group :model-value="store" @change="handleColorSchemeChange">
        <template
          v-for="item in [
            { icon: 'i-ri:sun-line', label: '明亮', value: 'light' },
            { icon: 'i-ri:moon-line', label: '暗黑', value: 'dark' },
            { icon: 'i-ri:computer-line', label: '系统', value: 'auto' }
          ]"
          :key="item.value"
        >
          <el-radio-button :value="item.value">
            <SvgIcon :name="item.icon" />
            {{ item.label }}
          </el-radio-button>
        </template>
      </el-radio-group>
    </div>
    <el-divider v-if="settingsStore.mode === 'pc'">导航栏模式</el-divider>
    <div v-if="settingsStore.mode === 'pc'" class="menu-mode">
      <el-tooltip content="侧边栏模式 (含主导航)" placement="bottom" :delay="500">
        <div
          class="mode mode-side"
          :class="{ active: settingsStore.settings.menu.menuMode === 'side' }"
          @click="settingsStore.settings.menu.menuMode = 'side'"
        >
          <div class="mode-container" />
        </div>
      </el-tooltip>
      <el-tooltip content="顶部模式" placement="bottom" :delay="500">
        <div
          class="mode mode-head"
          :class="{ active: settingsStore.settings.menu.menuMode === 'head' }"
          @click="settingsStore.settings.menu.menuMode = 'head'"
        >
          <div class="mode-container" />
        </div>
      </el-tooltip>
      <el-tooltip content="侧边栏模式 (不含主导航)" placement="bottom" :delay="500">
        <div
          class="mode mode-single"
          :class="{ active: settingsStore.settings.menu.menuMode === 'single' }"
          @click="settingsStore.settings.menu.menuMode = 'single'"
        >
          <div class="mode-container" />
        </div>
      </el-tooltip>
    </div>
    <el-divider>导航栏</el-divider>
    <div class="setting-item">
      <div class="label">
        主导航切换跳转
        <el-tooltip content="开启该功能后，切换主导航时，页面自动跳转至该主导航下，次导航里第一个导航">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch
        v-model="settingsStore.settings.menu.switchMainMenuAndPageJump"
        :disabled="['single'].includes(settingsStore.settings.menu.menuMode)"
      />
    </div>
    <div class="setting-item">
      <div class="label">
        次导航保持展开一个
        <el-tooltip content="开启该功能后，次导航只保持单个菜单的展开">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.menu.subMenuUniqueOpened" />
    </div>
    <div class="setting-item">
      <div class="label">次导航是否折叠</div>
      <el-switch v-model="settingsStore.settings.menu.subMenuCollapse" />
    </div>
    <div v-if="settingsStore.mode === 'pc'" class="setting-item">
      <div class="label">显示次导航折叠按钮</div>
      <el-switch v-model="settingsStore.settings.menu.enableSubMenuCollapseButton" />
    </div>
    <div class="setting-item">
      <div class="label">是否启用快捷键</div>
      <el-switch
        v-model="settingsStore.settings.menu.enableHotkeys"
        :disabled="['single'].includes(settingsStore.settings.menu.menuMode)"
      />
    </div>
    <el-divider>顶栏</el-divider>
    <div class="setting-item">
      <div class="label">模式</div>
      <HCheckList
        v-model="settingsStore.settings.topbar.mode"
        :options="[
          { label: '静止', value: 'static' },
          { label: '固定', value: 'fixed' },
          { label: '粘性', value: 'sticky' }
        ]"
      />
    </div>
    <div>
      <el-divider>标签栏</el-divider>
      <div class="setting-item">
        <div class="label">是否启用</div>
        <el-switch v-model="settingsStore.settings.tabbar.enable" />
      </div>
      <div class="setting-item">
        <div class="label">是否显示图标</div>
        <el-switch
          v-model="settingsStore.settings.tabbar.enableIcon"
          :disabled="!settingsStore.settings.tabbar.enable"
        />
      </div>
      <div class="setting-item">
        <div class="label">是否启用快捷键</div>
        <el-switch
          v-model="settingsStore.settings.tabbar.enableHotkeys"
          :disabled="!settingsStore.settings.tabbar.enable"
        />
      </div>
    </div>
    <el-divider>工具栏</el-divider>
    <div v-if="settingsStore.mode === 'pc'" class="setting-item">
      <div class="label">面包屑导航</div>
      <el-switch v-model="settingsStore.settings.toolbar.breadcrumb" />
    </div>
    <div class="setting-item">
      <div class="label">
        导航搜索
        <el-tooltip content="对导航进行快捷搜索">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.toolbar.navSearch" />
    </div>
    <div v-if="settingsStore.mode === 'pc'" class="setting-item">
      <div class="label">全屏</div>
      <el-switch v-model="settingsStore.settings.toolbar.fullscreen" />
    </div>
    <div class="setting-item">
      <div class="label">
        页面刷新
        <el-tooltip content="使用框架内提供的刷新功能进行页面刷新">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.toolbar.pageReload" />
    </div>
    <div class="setting-item">
      <div class="label">
        颜色主题
        <el-tooltip content="开启后可在明亮/暗黑模式中切换">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.toolbar.colorScheme" />
    </div>
    <el-divider>页面</el-divider>
    <div class="setting-item">
      <div class="label">是否启用快捷键</div>
      <el-switch v-model="settingsStore.settings.mainPage.enableHotkeys" />
    </div>
    <el-divider>导航搜索</el-divider>
    <div class="setting-item">
      <div class="label">是否启用快捷键</div>
      <el-switch
        v-model="settingsStore.settings.navSearch.enableHotkeys"
        :disabled="!settingsStore.settings.toolbar.navSearch"
      />
    </div>
    <el-divider>底部版权</el-divider>
    <div class="setting-item">
      <div class="label">是否启用</div>
      <el-switch v-model="settingsStore.settings.copyright.enable" />
    </div>
    <div class="setting-item">
      <div class="label">日期</div>
      <el-input v-model="settingsStore.settings.copyright.dates" :disabled="!settingsStore.settings.copyright.enable" />
    </div>
    <div class="setting-item">
      <div class="label">公司</div>
      <el-input
        v-model="settingsStore.settings.copyright.company"
        :disabled="!settingsStore.settings.copyright.enable"
      />
    </div>
    <div class="setting-item">
      <div class="label">网址</div>
      <el-input
        v-model="settingsStore.settings.copyright.website"
        :disabled="!settingsStore.settings.copyright.enable"
      />
    </div>
    <div class="setting-item">
      <div class="label">备案</div>
      <el-input v-model="settingsStore.settings.copyright.beian" :disabled="!settingsStore.settings.copyright.enable" />
    </div>
    <el-divider>主页</el-divider>
    <div class="setting-item">
      <div class="label">
        是否启用
        <el-tooltip content="该功能开启时，登录成功默认进入主页，反之则默认进入导航栏里第一个导航页面">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.home.enable" />
    </div>
    <div class="setting-item">
      <div class="label">
        主页名称
        <el-tooltip content="开启国际化时，该设置无效">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-input v-model="settingsStore.settings.home.title" />
    </div>
    <el-divider>其它</el-divider>
    <div class="setting-item">
      <div class="label">是否启用权限</div>
      <el-switch v-model="settingsStore.settings.app.enablePermission" />
    </div>
    <div class="setting-item">
      <div class="label">
        载入进度条
        <el-tooltip content="该功能开启时，跳转路由会看到页面顶部有进度条">
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.app.enableProgress" />
    </div>
    <div class="setting-item">
      <div class="label">
        动态标题
        <el-tooltip
          content="该功能开启时，页面标题会显示当前路由标题，格式为“页面标题 - 网站名称”；关闭时则显示网站名称，网站名称在项目根目录下 .env.* 文件里配置"
        >
          <SvgIcon name="i-ri:question-line" />
        </el-tooltip>
      </div>
      <el-switch v-model="settingsStore.settings.app.enableDynamicTitle" />
    </div>
    <template v-if="isSupported" #footer>
      <el-button class="w-full" type="primary" @click="handleCopy">
        <SvgIcon name="i-ep:document-copy" class="mr-1" />
        复制配置
      </el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.divider {
  @apply flex items-center justify-between gap-4 my-4 whitespace-nowrap text-sm font-500;

  &::before,
  &::after {
    @apply content-empty w-full h-1px bg-stone-2 dark:bg-stone-6;
  }
}

.menu-mode {
  @apply flex items-center justify-center gap-4 pb-4;

  .mode {
    &::before,
    &::after,
    .mode-container {
      @apply absolute pointer-events-none;
    }

    &::before {
      @apply content-empty bg-ui-primary;
    }

    &::after {
      @apply content-empty bg-ui-primary-light-3;
    }

    &.active {
      @apply ring-ui-primary ring-2;
    }

    .mode-container {
      @apply bg-ui-primary-light-7 border-dashed border-ui-primary;

      &::before {
        @apply content-empty absolute w-full h-full;
      }
    }

    &-side {
      &::before {
        @apply top-2 bottom-2 left-2 w-2 rounded-tl-1 rounded-bl-1;
      }

      &::after {
        @apply top-2 bottom-2 left-4 0.5 w-3;
      }

      .mode-container {
        @apply inset-t-2 inset-r-2 inset-b-2 inset-l-8 rounded-tr-1 rounded-br-1;
      }
    }

    &-head {
      &::before {
        @apply top-2 left-2 right-2 h-2 rounded-tl-1 rounded-tr-1;
      }

      &::after {
        @apply top-4 0.5 left-2 bottom-2 w-3 rounded-bl-1;
      }

      .mode-container {
        @apply inset-t-4 0.5 inset-r-2 inset-b-2 inset-l-5 0.5 rounded-br-1;
      }
    }

    &-single {
      &::after {
        @apply top-2 left-2 bottom-2 w-3 rounded-tl-1 rounded-bl-1;
      }

      .mode-container {
        @apply inset-t-2 inset-r-2 inset-b-2 inset-l-5 0.5 rounded-tr-1 rounded-br-1;
      }
    }

    @apply relative w-16 h-12 rounded-2 ring-1 ring-stone-2 dark:ring-stone-7 cursor-pointer transition;
  }
}

.setting-item {
  @apply flex items-center justify-between gap-4 px-4 py-2 rounded-2 transition hover:bg-stone-1 dark:hover:bg-stone-9;

  .label {
    @apply flex items-center flex-shrink-0 gap-2 text-sm;

    i {
      @apply text-xl text-orange cursor-help;
    }
  }
}

.el-switch {
  @apply h-auto;
}
</style>
