<route lang="yaml">
name: home
meta:
title: 主页
icon: ant-design:home-twotone
</route>

<script setup lang="ts">
const title = computed<string>(() => import.meta.env.VITE_APP_TITLE)
</script>

<template>
  <div>
    <PageHeader>
      <template #title>
        <div class="flex items-center gap-4">欢迎使用{{ title }}</div>
      </template>
      <template #content>
        <div class="text-sm/6">
          <div>
            这是一款<b class="text-emphasis">开箱即用</b
            >的中后台框架，同时它也经历过数十个真实项目的技术沉淀，确保框架在开发中可落地、可使用、可维护
          </div>
          <div>注：在作者就职过的公司，本框架已在电商、直播、OA、ERP等多个不同领域的中后台系统中应用并稳定运行</div>
        </div>
      </template>
    </PageHeader>
  </div>
</template>

<style lang="scss" scoped>
.text-emphasis {
  text-emphasis-style: '❤';
}

.ecology {
  @apply flex-1 m-0;

  :deep(.title-container) {
    @apply flex items-center justify-between flex-wrap gap-4;

    .title-info {
      @apply flex items-center gap-4;

      img {
        @apply block w-12 h-12;
      }

      h1 {
        @apply m-0 text-2xl;
      }

      h2 {
        @apply m-0 text-base text-stone-5 font-normal;
      }
    }
  }
}
</style>
