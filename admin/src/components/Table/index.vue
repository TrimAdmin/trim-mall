<script setup lang="ts">
import { TableProps } from 'element-plus'
import { PaginationData, PaginationParams, TableColumn } from '#/global'

const props = withDefaults(
  defineProps<
    Omit<TableProps<any>, 'data'> & {
      data: PaginationData
      columns: TableColumn[]
      pageSize?: number
      currentPage?: number
      total?: number
      loading?: boolean
    }
  >(),
  {
    showHeader: true,
    fit: true,
    tooltipEffect: 'dark',
    selectOnIndeterminate: true,
    indent: 16,
    tableLayout: 'fixed',
    className: 'trim-table',
    headerRowClassName: 'trim-table__header',
    height: '500px'
  }
)

const currentPage = ref<number>(props.data ? props.data.page : 0)
const pageSize = ref<number>(props.data ? props.data.limit : 10)

const emits = defineEmits<{
  (e: 'currentChange', data: PaginationParams): void
  (e: 'sizeChange', data: PaginationParams): void
}>()

function handleCurrentChange() {
  emits('currentChange', {
    page: currentPage.value,
    limit: pageSize.value
  })
}

function handleSizeChange() {
  emits('sizeChange', {
    page: currentPage.value,
    limit: pageSize.value
  })
}
</script>

<template>
  <el-card shadow="never">
    <el-table v-loading="loading" v-bind="props" class="w-full" :data="data && (data.list ?? [])" :columns="undefined">
      <template v-for="column in columns" :key="column.field">
        <el-table-column v-bind="column">
          <template #default="slotData">
            <slot v-if="column.slot" :name="column.slot" v-bind="slotData" />
            <span v-else>{{ slotData.row[column.prop] ?? '-' }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="data ? data.total : 0"
      :page-sizes="[1, 10]"
      background
      class="mt-4 flex justify-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<style scoped lang="scss"></style>
