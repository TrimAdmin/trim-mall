<script setup lang="ts">
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import hotkeys from 'hotkeys-js'
import { useMagicKeys } from '@vueuse/core'
import useSettingsStore from '@/store/modules/settings'
import useTabbarStore from '@/store/modules/tabbar'
import type { Tabbar } from '#/global'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'Tabbar'
})

const route = useRoute()
const router = useRouter()

const settingsStore = useSettingsStore()
const tabbarStore = useTabbarStore()

const tabbar = useTabbar()
const mainPage = useMainPage()

const keys = useMagicKeys({ reactive: true })

const activedTabId = computed(() => tabbar.getId())

const tabsRef = ref()
const tabContainerRef = ref()
const tabRef = shallowRef<HTMLElement[]>([])
onBeforeUpdate(() => {
  tabRef.value = []
})

watch(
  () => route,
  (val) => {
    if (settingsStore.settings.tabbar.enable) {
      tabbarStore.add(val).then(() => {
        const index = tabbarStore.list.findIndex((item) => item.tabId === activedTabId.value)
        if (index !== -1) {
          scrollTo(tabRef.value[index].offsetLeft)
          tabbarScrollTip()
        }
      })
    }
  },
  {
    immediate: true,
    deep: true
  }
)

function tabbarScrollTip() {
  if (
    tabContainerRef.value.$el.clientWidth > tabsRef.value.clientWidth &&
    localStorage.getItem('tabbarScrollTip') === undefined
  ) {
    localStorage.setItem('tabbarScrollTip', '')
    ElMessage.info({
      message: '标签栏数量超过展示区域范围，可以将鼠标移到标签栏上，通过鼠标滚轮滑动浏览',
      duration: 5000,
      showClose: true
    })
  }
}

function handlerMouserScroll(event: WheelEvent) {
  if (event.deltaY || event.detail !== 0) {
    tabsRef.value.scrollBy({
      left: (event.deltaY || event.detail) > 0 ? 50 : -50
    })
  }
}

function scrollTo(offsetLeft: number) {
  tabsRef.value.scrollTo({
    left: offsetLeft - 50,
    behavior: 'smooth'
  })
}

function onTabbarContextmenu(event: MouseEvent, routeItem: Tabbar.recordRaw) {
  event.preventDefault()
  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    zIndex: 1050,
    iconFontClass: '',
    customClass: 'contextmenu-custom',
    items: [
      {
        label: '重新加载',
        icon: 'i-ri:refresh-line',
        disabled: routeItem.tabId !== activedTabId.value,
        onClick: () => mainPage.reload()
      },
      {
        label: '关闭标签页',
        icon: 'i-ri:close-line',
        disabled: tabbarStore.list.length <= 1,
        divided: true,
        onClick: () => {
          tabbar.closeById(routeItem.tabId)
        }
      },
      {
        label: '关闭其他标签页',
        disabled: !tabbar.checkCloseOtherSide(routeItem.tabId),
        onClick: () => {
          tabbar.closeOtherSide(routeItem.tabId)
        }
      },
      {
        label: '关闭左侧标签页',
        disabled: !tabbar.checkCloseLeftSide(routeItem.tabId),
        onClick: () => {
          tabbar.closeLeftSide(routeItem.tabId)
        }
      },
      {
        label: '关闭右侧标签页',
        disabled: !tabbar.checkCloseRightSide(routeItem.tabId),
        onClick: () => {
          tabbar.closeRightSide(routeItem.tabId)
        }
      }
    ]
  })
}

onMounted(() => {
  hotkeys('alt+left,alt+right,alt+w,alt+1,alt+2,alt+3,alt+4,alt+5,alt+6,alt+7,alt+8,alt+9,alt+0', (e, handle) => {
    if (settingsStore.settings.tabbar.enable && settingsStore.settings.tabbar.enableHotkeys) {
      e.preventDefault()
      switch (handle.key) {
        // 切换到当前标签页紧邻的上一个标签页
        case 'alt+left':
          if (tabbarStore.list[0].tabId !== activedTabId.value) {
            const index = tabbarStore.list.findIndex((item) => item.tabId === activedTabId.value)
            router.push(tabbarStore.list[index - 1].fullPath)
          }
          break
        // 切换到当前标签页紧邻的下一个标签页
        case 'alt+right':
          if (tabbarStore.list.at(-1)?.tabId !== activedTabId.value) {
            const index = tabbarStore.list.findIndex((item) => item.tabId === activedTabId.value)
            router.push(tabbarStore.list[index + 1].fullPath)
          }
          break
        // 关闭当前标签页
        case 'alt+w':
          tabbar.closeById(activedTabId.value)
          break
        // 切换到第 n 个标签页
        case 'alt+1':
        case 'alt+2':
        case 'alt+3':
        case 'alt+4':
        case 'alt+5':
        case 'alt+6':
        case 'alt+7':
        case 'alt+8':
        case 'alt+9': {
          const number = Number(handle.key.split('+')[1])
          tabbarStore.list[number - 1]?.fullPath && router.push(tabbarStore.list[number - 1].fullPath)
          break
        }
        // 切换到最后一个标签页
        case 'alt+0':
          router.push(tabbarStore.list[tabbarStore.list.length - 1].fullPath)
          break
      }
    }
  })
})
onUnmounted(() => {
  hotkeys.unbind('alt+q,alt+e,alt+w,alt+1,alt+2,alt+3,alt+4,alt+5,alt+6,alt+7,alt+8,alt+9,alt+0')
})
</script>

<template>
  <div class="tabbar-container">
    <div ref="tabsRef" class="tabs" @wheel.prevent="handlerMouserScroll">
      <TransitionGroup ref="tabContainerRef" name="tabbar" tag="div" class="tab-container">
        <div
          v-for="(element, index) in tabbarStore.list"
          :key="element.tabId"
          ref="tabRef"
          :data-index="index"
          class="tab"
          :class="{
            actived: element.tabId === activedTabId
          }"
          :title="typeof element?.title === 'function' ? element.title() : element.title"
          @click="router.push(element.fullPath)"
          @contextmenu="onTabbarContextmenu($event, element)"
        >
          <div class="tab-dividers" />
          <div class="tab-background" />
          <div class="tab-content">
            <div :key="element.tabId" class="title">
              <SvgIcon
                v-if="settingsStore.settings.tabbar.enableIcon && element.icon"
                :name="element.icon"
                class="icon"
              />
              {{ typeof element?.title === 'function' ? element.title() : element.title }}
            </div>
            <div v-if="tabbarStore.list.length > 1" class="action-icon">
              <SvgIcon name="i-ri:close-fill" @click.stop="tabbar.closeById(element.tabId)" />
            </div>
            <div v-show="keys.alt && index < 9" class="hotkey-number">
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss">
.mx-menu-ghost-host {
  z-index: 1000;

  .mx-context-menu {
    @apply fixed ring-1 ring-stone-2 dark: ring-stone-7 shadow-2xl;

    background-color: var(--g-container-bg);

    .mx-context-menu-items .mx-context-menu-item {
      @apply transition-background-color;

      &:not(.disabled):hover {
        @apply cursor-pointer bg-stone-1 dark: bg-stone-9;
      }

      span {
        color: initial;
      }

      .icon {
        color: initial;
      }

      &.disabled span,
      &.disabled .icon {
        opacity: 0.25;
      }
    }

    .mx-context-menu-item-sperator {
      background-color: var(--g-container-bg);

      &::after {
        @apply bg-stone-2 dark: bg-stone-7;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.tabbar-container {
  position: relative;

  display: inline-flex;
  align-items: center;

  height: var(--g-tabbar-height);

  background-color: var(--el-fill-color);

  transition: background-color 0.3s;

  .tabs {
    // firefox隐藏滚动条
    scrollbar-width: none;

    position: absolute;
    right: 0;
    left: 0;

    overflow-y: hidden;

    white-space: nowrap;

    // chrome隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    .tab-container {
      display: inline-block;

      .tab {
        pointer-events: none;
        cursor: pointer;

        position: relative;

        overflow: hidden;
        display: inline-block;

        width: 150px;
        height: calc(var(--g-tabbar-height) - 10px);
        margin-right: 8px;

        font-size: 14px;
        line-height: calc(var(--g-tabbar-height) - 2px);
        vertical-align: bottom;

        border-radius: 8px;

        &:not(.actived):hover {
          z-index: 3;

          &::before,
          &::after {
            content: none;
          }

          & + .tab .tab-dividers::before {
            opacity: 0;
          }

          .tab-content {
            .title,
            .action-icon {
              color: var(--g-tabbar-tab-hover-color);
            }
          }

          .tab-background {
            background-color: var(--g-tabbar-tab-hover-bg);
          }
        }

        * {
          user-select: none;
        }

        &.actived {
          z-index: 5;

          &::before,
          &::after {
            content: none;
          }

          & + .tab .tab-dividers::before {
            opacity: 0;
          }

          .tab-content {
            .title,
            .action-icon {
              color: var(--g-tabbar-tab-active-color);
            }
          }

          .tab-background {
            background-color: var(--g-container-bg);
          }
        }

        .tab-dividers {
          position: absolute;
          z-index: 0;
          top: 50%;
          right: -1px;
          left: -1px;
          transform: translateY(-50%);

          height: 14px;

          &::before {
            content: '';

            position: absolute;
            top: 0;
            bottom: 0;
            left: 1px;

            display: block;

            width: 1px;

            opacity: 1;
            background-color: var(--g-tabbar-dividers-bg);

            transition:
              opacity 0.2s ease,
              background-color 0.3s;
          }
        }

        &:first-child .tab-dividers::before {
          opacity: 0;
        }

        .tab-background {
          pointer-events: none;

          position: absolute;
          z-index: 0;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          transition:
            opacity 0.3s,
            background-color 0.3s;
        }

        .tab-content {
          pointer-events: all;
          display: flex;
          width: 100%;
          height: 100%;

          .title {
            overflow: hidden;
            display: flex;
            flex: 1;
            gap: 5px;
            align-items: center;

            height: 100%;
            margin-right: 10px;
            padding: 0 10px;

            color: var(--g-tabbar-tab-color);
            white-space: nowrap;

            transition: margin-right 0.3s;

            mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);

            &:has(+ .action-icon) {
              margin-right: 28px;
            }

            .icon {
              flex-shrink: 0;
            }
          }

          .action-icon {
            position: absolute;
            z-index: 10;
            top: 50%;
            right: 0.5em;
            transform: translateY(-50%);

            display: flex;
            align-items: center;
            justify-content: center;

            width: 1.5em;
            height: 1.5em;

            font-size: 12px;
            color: var(--g-tabbar-tab-color);

            border-radius: 50%;

            &:hover {
              @apply ring-1 ring-stone-3 dark: ring-stone-7;

              background-color: var(--g-bg);
            }
          }

          .hotkey-number {
            @apply ring-1 ring-stone-3 dark: ring-stone-7;

            position: absolute;
            z-index: 10;
            top: 50%;
            right: 0.5em;
            transform: translateY(-50%);

            display: flex;
            align-items: center;
            justify-content: center;

            width: 1.5em;
            height: 1.5em;

            font-size: 12px;
            color: var(--g-tabbar-tab-color);

            background-color: var(--g-bg);
            border-radius: 50%;
          }
        }
      }
    }
  }
}

// 标签栏动画
.tabs {
  .tabbar-move,
  .tabbar-enter-active,
  .tabbar-leave-active {
    transition: all 0.3s;
  }

  .tabbar-enter-from,
  .tabbar-leave-to {
    transform: translateY(30px);
    opacity: 0;
  }

  .tabbar-leave-active {
    position: absolute !important;
  }
}
</style>
