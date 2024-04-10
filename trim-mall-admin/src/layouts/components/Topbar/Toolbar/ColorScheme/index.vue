<script setup lang="ts">
defineOptions({
  name: 'ColorScheme'
})

const { system, store } = useColorMode()

function toggleColorScheme(event: MouseEvent) {
  const { startViewTransition } = useViewTransition(() => {
    store.value = store.value === 'auto' ? system.value : store.value === 'dark' ? 'light' : 'dark'
  })

  startViewTransition()?.ready.then(() => {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: store.value !== 'dark' ? clipPath : clipPath.reverse()
      },
      {
        duration: 300,
        easing: 'ease-out',
        pseudoElement: store.value !== 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)'
      }
    )
  })
}
</script>

<template>
  <HDropdown class="flex-center cursor-pointer px-2 py-1">
    <SvgIcon
      :name="
        {
          auto: 'i-ri:computer-line',
          light: 'i-ri:sun-line',
          dark: 'i-ri:moon-line'
        }[store]
      "
      @click="toggleColorScheme"
    />
    <template #dropdown>
      <HTabList
        v-model="store"
        :options="[
          { icon: 'i-ri:sun-line', label: '', value: 'light' },
          { icon: 'i-ri:moon-line', label: '', value: 'dark' },
          { icon: 'i-ri:computer-line', label: '', value: 'auto' }
        ]"
        class="m-3"
      />
    </template>
  </HDropdown>
</template>
