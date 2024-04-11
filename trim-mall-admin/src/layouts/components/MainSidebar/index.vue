<script setup lang="ts">
import Logo from '../Logo/index.vue'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'

defineOptions({
  name: 'MainSidebar'
})

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const { switchTo } = useMenu()
</script>

<template>
  <Transition name="main-sidebar">
    <div
      v-if="
        settingsStore.settings.menu.menuMode === 'side' ||
        (settingsStore.mode === 'mobile' && settingsStore.settings.menu.menuMode !== 'single')
      "
      class="main-sidebar-container"
    >
      <Logo :show-title="false" class="sidebar-logo" />
      <!-- 侧边栏模式（含主导航） -->
      <div class="menu flex flex-col of-hidden transition-all">
        <template v-for="(item, index) in menuStore.allMenus" :key="index">
          <div
            class="menu-item relative transition-all"
            :class="{
              active: index === menuStore.actived
            }"
          >
            <div
              v-if="item.children && item.children.length !== 0"
              class="group menu-item-container h-full w-full flex cursor-pointer items-center justify-between gap-1 py-4 text-[var(--g-main-sidebar-menu-color)] transition-all hover:(bg-[var(--g-main-sidebar-menu-hover-bg)] text-[var(--g-main-sidebar-menu-hover-color)]) px-2!"
              :class="{
                'text-[var(--g-main-sidebar-menu-active-color)]! bg-[var(--g-main-sidebar-menu-active-bg)]!':
                  index === menuStore.actived
              }"
              :title="typeof item.meta?.title === 'function' ? item.meta?.title() : item.meta?.title"
              @click="switchTo(index)"
            >
              <div class="w-full inline-flex flex-1 flex-col items-center justify-center gap-[2px]">
                <SvgIcon
                  v-if="item.meta?.icon"
                  :name="item.meta?.icon"
                  :size="20"
                  class="menu-item-container-icon transition-transform group-hover:scale-120"
                  async
                />
                <span
                  class="w-full flex-1 truncate text-center text-sm transition-height transition-opacity transition-width"
                >
                  {{ typeof item.meta?.title === 'function' ? item.meta?.title() : item.meta?.title }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.main-sidebar-container {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;

  width: var(--g-main-sidebar-width);

  color: var(--el-text-color-primary);

  background-color: var(--el-bg-color-page);
  box-shadow: 1px 0 0 0 var(--el-border-color-lighter);

  transition:
    background-color 0.3s,
    color 0.3s,
    box-shadow 0.3s;

  .sidebar-logo {
    background-color: var(--el-bg-color-page);
    transition: background-color 0.3s;
  }

  .menu {
    // firefox隐藏滚动条
    scrollbar-width: none;

    overflow: hidden auto;
    overscroll-behavior: contain;
    flex: 1;

    width: initial;

    // chrome隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    :deep(.menu-item) {
      .menu-item-container {
        padding-block: 8px;
        color: var(--el-text-color-primary);

        &:hover {
          color: var(--el-text-color-primary);
          background-color: var(--el-color-primary-light-8);
        }

        .menu-item-container-icon {
          font-size: 24px !important;
        }
      }

      &.active .menu-item-container {
        color: var(--el-color-primary) !important;
        background-color: var(--el-color-primary-light-7) !important;
      }
    }
  }
}

// 主侧边栏动画
.main-sidebar-enter-active,
.main-sidebar-leave-active {
  transition: 0.3s;
}

.main-sidebar-enter-from,
.main-sidebar-leave-to {
  transform: translateX(calc(var(--g-main-sidebar-width) * -1));
}
</style>
