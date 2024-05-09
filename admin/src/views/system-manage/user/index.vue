<script setup lang="ts">
import user from '@/api/modules/user'
import { PaginationData, PaginationParams, TableColumn } from '#/global'

const { t } = useI18n()
const tableData = ref<PaginationData>({} as PaginationData)
const columns: TableColumn[] = [
  {
    prop: 'username',
    label: t('user.username')
  },
  {
    prop: 'nickname',
    label: t('user.nickname')
  },
  {
    prop: 'email',
    label: t('user.email')
  },
  {
    prop: 'mobilePhone',
    label: t('user.mobile-phone')
  },
  {
    prop: 'status',
    label: t('user.status'),
    slot: 'status'
  }
]

const [loading, setLoading] = useToggle()

async function init(params?: PaginationParams) {
  setLoading(true)
  const { data } = await user.getUserPage(params)
  tableData.value = data
  setLoading(false)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <Table :data="tableData" :columns="columns" :loading="loading" @current-change="init" @size-change="init">
      <template #status="{ row }">
        <el-tag v-if="row.status === 'ENABLE'" type="success">
          {{ $t('enum.enable') }}
        </el-tag>
        <el-tag v-else type="danger">
          {{ $t('enum.disable') }}
        </el-tag>
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped></style>
