<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import {deleteroute, getclassesroute, GetrouteList} from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';
import {watch} from "vue";
import {da} from "date-fns/locale";
import { useMessage } from 'naive-ui'
const message = useMessage()
const appStore = useAppStore();

const { bool: visible, setTrue: openModal } = useBoolean();

const wrapperRef = ref<HTMLElement | null>(null);

const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useTable({
  apiFn: GetrouteList,
  columns: () => [
    {
      key: 'objectId',
      title: $t('page.manage.menu.id'),
      align: 'center'
    },
    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      render: row => {
        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          1: 'default',
          2: 'primary'
        };

        const label = $t(menuTypeRecord[row.menuType]);

        return <NTag type={tagMap[row.menuType]}>{label}</NTag>;
      }
    },
    {
      key: 'menuName',
      title: $t('page.manage.menu.menuName'),
      align: 'center',
      minWidth: 120,
      render: row => {


        const label = $t(row.meta.i18nKey);

        return <span>{label}</span>;
      }
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => {
        const icon = row.iconType === '1' ? row.meta.icon : undefined;

        const localIcon = row.iconType === '2' ? row.meta.icon : undefined;

        return (
            <div class="flex-center">
              <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
            </div>
        );
      }
    },
    {
      key: 'name',
      title: $t('page.manage.menu.routeName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'path',
      title: $t('page.manage.menu.routePath'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.menu.menuStatus'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'meta.hideInMenu',
      title: $t('page.manage.menu.hideInMenu'),
      align: 'center',
      width: 80,
      render: row => {
        const hide: CommonType.YesOrNo = row.meta.hideInMenu ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'error',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[hide]);

        return <NTag type={tagMap[hide]}>{label}</NTag>;
      }
    },
    {
      key: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center',
      render: row => {
        if (row.route){

          return <NTag >{row.route.objectId}</NTag>;

        }
      }
    },
    {
      key: 'meta.order',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
          <div class="flex-center justify-end gap-8px">
            {row.menuType === '1' && (
                <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
                  {$t('page.manage.menu.addChildMenu')}
                </NButton>
            )}
            <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.objectId)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                    <NButton type="error" ghost size="small">
                      {$t('common.delete')}
                    </NButton>
                )
              }}
            </NPopconfirm>
          </div>
      )
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

async function handleDelete(id: string) {
  // request
  console.log(id);
  const count= await getroute(id)

  if (count>0){
    message.error("请先删除子项")
  }else{
    const {data,error}=await deleteroute(id)
    if (!error){
      onDeleted();
    }
  }

}

async function  getroute(id:string) {
  const  params={
    count: 'objectId',
    where:{
      route:id
    }
  };

 const {data,error}=await getclassesroute(params)
  if (data.status==200){
    return data.count
  }



}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

const allPages = ref<string[]>([]);

// async function getAllPages() {
//   const { data: pages } = await fetchGetAllPages();
//   allPages.value = pages || [];
// }

// function init() {
//   getAllPages();
// }

watch(data, newdata => {
  // let data1={}
  // let data2={}
  // data.value.forEach((item)=>{
  //
  //
  //         if(item.route){
  //           if (data1[item.route.objectId].children){
  //             data1[item.route.objectId].children.pust(item)
  //           }else {
  //             data1[item.route.objectId].children=[item]
  //           }
  //         }else {
  //           data1[item.objectId]=item
  //         }
  //
  //     }
  // )
  // for (const data1Key in data1) {
  //   if(data1[data1Key].route){
  //     (data1[data1[data1Key].route.objectId])
  //   }
  // }
  // data.value=Object.values(data1)
  // console.log('当前data:', data);
});


</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
        />
      </template>
      <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :cascade="false"
          :flex-height="!appStore.isMobile"
          :scroll-x="1088"
          :loading="loading"
          :row-key="row => row.objectId"
          remote
          :pagination="pagination"
          class="sm:h-full"
      />
      <MenuOperateModal
          v-model:visible="visible"
          :operate-type="operateType"
          :row-data="editingData"
          :all-pages="allPages"
          @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
