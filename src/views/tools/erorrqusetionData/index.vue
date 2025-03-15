<!-- eslint-disable no-console -->
<script setup lang="tsx">
import {onMounted, reactive, ref, watch} from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import {getdevicedata, geterorrqusetion} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { WEATHER_PRODUCT } from '@/constants/device';
// import { useTable, useTableOperate } from '@/hooks/custom/table';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { localStg } from '@/utils/storage';
import {NPerformantEllipsis} from "naive-ui";



const appStore = useAppStore();
const route = useRoute();
const state = reactive({
  modalInfo: {},
  showModal: false,
  baseInfo: {
    userId: null  ,
    number: null
  },
  columns: [
    {
      key: 'name',
      title: '试卷',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'category',
      title: '大题类型',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'type',
      title: '小题类型',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'question',
      title: '题目',
      align: 'center',
      minWidth: 100,
      width: 440,

      render:row => {
        return <NEllipsis style="max-width: 440px" title="{{content}}">{{
          default: () => row.question,
          tooltip:()=>(
              <div style="text-align: center; width: 440px">
                {row.question}</div>
          )

        }}
        </NEllipsis>}
    },
    {
      key: 'options',
      title: '选项',
      align: 'center',
      width: 150,
      render:  row => (<div style=" width:100px" >{ row.options.map((d) => ( <div style='width:100px' >{d.option+':'+d.text}</div>))}</div>)
    },
    {
      key: 'answer',
      title: '答案',
      align: 'center',
      width: 150,
      render:  row => (<div style=" width:100px" >{ row.answer.map((d) => ( <div style='width:100px' >{d}</div>))}</div>)
    },
    {
      key: 'erorr_questions',
      title: '错误选项',
      align: 'center',
      width: 150,
      render:  row => (<div style=" width:100px" >{ row.erorr_questions.split(',').map((d) => ( <div style='width:100px' >{d}</div>))}</div>)
    },

    {
      key: 'background',
      title: '背景材料',
      align: 'center',
      width: 440,

      render:row => {
        return <NEllipsis style="max-width: 440px" title="{{content}}">{{
          default: () => row.background,
          tooltip:()=>(
              <div style="text-align: center; width: 440px">
                {row.background}</div>
          )

        }}
        </NEllipsis>}
    },
    {
      key: 'createdat',
      title: '时间',
      width: 180,
      align: 'center',
      render: row => dayjs(row.createdat).format('YYYY-MM-DD HH:mm:ss'),
      fixed: 'left'
    },

  ]
});

onMounted(() => {

   state.baseInfo.userId = route.query.userId;
   state.baseInfo.number = route.query.number;

  // state.baseInfo.deviceId = equipId;
});





const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  reloadColumns,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: geterorrqusetion,
  apiParams: {


    userId: route.query.userId,
    number: String(route.query.number),

  },

  showTotal: true,
  columns: () => [...state.columns]
});

// watch(data, newParams => {
//   console.log('当前data:', newParams);
// });

// watch(searchParams, newParams => {
//   console.log('当前搜索参数:', newParams);
// });
const listType = ref(1);
const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  // console.log("checkedRowKeys.value",checkedRowKeys.value);

  onBatchDeleted();
}

function handleDelete(id: number, roles: Array) {
  // request


  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}

function changeListType(newValue) {
  listType.value = newValue;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">

    <NCard  size="small">

      <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :scroll-x="962"
          :min-row-height="48"
          :loading="loading"
          :row-key="row => row.id"
          :pagination="mobilePagination"
          style="height: 500px"
          class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
