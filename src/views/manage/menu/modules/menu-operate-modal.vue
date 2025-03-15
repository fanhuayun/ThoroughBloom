<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { getLocalIcons } from '@/utils/icon';
import {postroute, putroute} from '@/service/api';
import {
  getLayoutAndPage,
  getRoutePathByRouteName, getRoutePathWithParam,
  transformLayoutAndPageToComponent
} from './shared';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = NaiveUI.TableOperateType | 'addChild';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.SystemManage.Menu | null;
  /** all pages */
  allPages: string[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    addChild: $t('page.manage.menu.addChildMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});



const model = reactive(createDefaultModel());

function createDefaultModel()  {
  return {

    objectId: '',
    menuName: '',
    name: '',
    path: '',
    status: '1',
    meta:{
      i18nKey: null,
      icon:'',
      localIcon:'',
      order:0,
      href:'',
      query: [],
      pathParam: '',
      component: '',
      hideInMenu: false,
      layout: '',
      page: '',
      keepAlive: false,
      constant: false,

      activeMenu: null,
      multiTab: false,
      fixedIndexInTab: null,
    },
    iconType: '1',
    menuType: '1',

    route:{
      objectId:"",
      className:"route",
      "__type":"Pointer"
    }
  };
}



const rules = {
  menuName: defaultRequiredRule,
  status: defaultRequiredRule,
  name: defaultRequiredRule,
  path: defaultRequiredRule
};

const disabledMenuType = computed(() => props.operateType === 'edit');

const localIcons = getLocalIcons();
const localIconOptions = localIcons.map<SelectOption>(item => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={item} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: item
}));

const showLayout = ref(true);



const pageOptions = computed(() => {
  const allPages = [...props.allPages];

  if (model.name && !allPages.includes(model.name)) {
    allPages.unshift(model.name);
  }

  const opts: CommonType.Option[] = allPages.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

const layoutOptions: CommonType.Option[] = [
  {
    label: 'base',
    value: 'base'
  },
  {
    label: 'blank',
    value: 'blank'
  }
];

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {

}

function handleInitModel() {
  Object.assign(model, createDefaultModel());
  // model= createDefaultModel()
  if (!props.rowData) return;

  if (props.operateType === 'addChild') {
    const { objectId } = props.rowData;
    const route= {
      objectId:objectId,
      className:"route",
      "__type":"Pointer"
    };

    Object.assign(model, { route });
  }

  if (props.operateType === 'edit') {

    Object.assign(model,  props.rowData);
  }
  console.log("model",model)

  if (model.route.objectId!==""){
    showLayout.value=false
  }


  if (!model.meta.query) {
    model.meta.query = [];
  }

}

function closeDrawer() {
  visible.value = false;
}

function handleUpdateRoutePathByRouteName() {
  if (model.name) {
    model.path = getRoutePathByRouteName(model.name);
  } else {
    model.path = '';
  }
}

const showPage = ref(true);
function handleUpdateI18nKeyByname() {
  if (model.name) {
    model.meta.i18nKey = `route.${model.name}` as App.I18n.I18nKey;
  } else {
    model.meta.i18nKey = null;
  }
}

function handleCreateButton() {
  const buttonItem: Api.SystemManage.MenuButton = {
    code: '',
    desc: ''
  };

  return buttonItem;
}

function getSubmitParams() {
  const { ...params } = model;
  console.log('params',params)

  const layout=params.meta.layout
  const page=params.meta.page
  const pathParam=params.meta.pathParam

  const component = transformLayoutAndPageToComponent(layout, page);
  const path = getRoutePathWithParam(model.path, pathParam);

  params.component = component;
  params.path = path;

  return params;
}

async function handleSubmit() {
  await validate();

  const params = getSubmitParams();
  if (params.route.objectId===''){
    delete params.route;
  }
  delete params.updatedAt;
  delete params.createdAt;
  delete params.children;

  if (props.operateType==='edit'){
    const {objectId}=params;
    delete params.objectId;
    delete params.ACL;

    const {data,error}=await putroute(objectId,params);
    if(!error){
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer();
      emit('submitted');
    }
  }else{

    delete params.objectId;
    const ACL={
      '*':{
        'read':true,
        'write':true
      },
    }
    const {data,error}=await postroute({...params,ACL});
    if(!error){
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer();
      emit('submitted');
    }

  }


  // request

}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    // getRoleOptions();
  }
});

watch(
  () => model.name,
  () => {
    handleUpdateRoutePathByRouteName();
    handleUpdateI18nKeyByname();
  }
);
watch(
  () => model.menuType,
  () => {
    showPage.value =  model.menuType === '2'?true:false
  }
);
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NScrollbar class="h-480px pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuType')" path="menuType">
            <NRadioGroup v-model:value="model.menuType" :disabled="disabledMenuType">
              <NRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuName')" path="menuName">
            <NInput v-model:value="model.menuName"  />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.routeName')" path="name">
            <NInput v-model:value="model.name" :placeholder="$t('page.manage.menu.form.routeName')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.routePath')" path="path">
            <NInput v-model:value="model.path"  disabled :placeholder="$t('page.manage.menu.form.routePath')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.pathParam')" path="pathParam">
            <NInput v-model:value="model.meta.pathParam" :placeholder="$t('page.manage.menu.form.pathParam')" />
          </NFormItemGi>
          <NFormItemGi   v-if="showLayout" span="24 m:12" :label="$t('page.manage.menu.layout')" path="layout">
            <NSelect
              v-model:value="model.meta.layout"
              :options="layoutOptions"
              :placeholder="$t('page.manage.menu.form.layout')"
            />
          </NFormItemGi>
          <NFormItemGi v-if="showPage" span="24 m:12" :label="$t('page.manage.menu.page')" path="page">
            <NSelect
              v-model:value="model.meta.page"
              :options="pageOptions"
              :placeholder="$t('page.manage.menu.form.page')"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.i18nKey')" path="i18nKey">
            <NInput v-model:value="model.meta.i18nKey" disabled :placeholder="$t('page.manage.menu.form.i18nKey')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.order')" path="order">
            <NInputNumber v-model:value="model.meta.order" class="w-full" :placeholder="$t('page.manage.menu.form.order')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.iconTypeTitle')" path="iconType">
            <NRadioGroup v-model:value="model.iconType">
              <NRadio
                v-for="item in menuIconTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>

          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.icon')" path="icon">
            <template v-if="model.iconType === '1'">
              <NInput v-model:value="model.meta.icon" :placeholder="$t('page.manage.menu.form.icon')" class="flex-1">

                <template #suffix>
                  <SvgIcon v-if="model.meta.icon" :icon="model.meta.icon" class="text-icon" />

                </template>
              </NInput>

              <a href="https://icones.js.org/" style="color: blue" target="_blank">icon库</a>
            </template>

            <template v-if="model.iconType === '2'">
              <NSelect
                v-model:value="model.meta.icon"
                :placeholder="$t('page.manage.menu.form.localIcon')"
                :options="localIconOptions"
              />
            </template>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuStatus')" path="status">
            <NRadioGroup v-model:value="model.status">
              <NRadio
                v-for="item in enableStatusOptions"
                :key="item.value"
                :value="item.value"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.keepAlive')" path="keepAlive">
            <NRadioGroup v-model:value="model.meta.keepAlive">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.constant')" path="constant">
            <NRadioGroup v-model:value="model.meta.constant">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.href')" path="href">
            <NInput v-model:value="model.meta.href" :placeholder="$t('page.manage.menu.form.href')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.hideInMenu')" path="hideInMenu">
            <NRadioGroup v-model:value="model.meta.hideInMenu">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi
            v-if="model.meta.hideInMenu"
            span="24 m:12"
            :label="$t('page.manage.menu.activeMenu')"
            path="activeMenu"
          >
            <NSelect
              v-model:value="model.meta.activeMenu"
              :options="pageOptions"
              clearable
              :placeholder="$t('page.manage.menu.form.activeMenu')"
            />
          </NFormItemGi>


          <NFormItemGi span="24" :label="$t('page.manage.menu.query')">
            <NDynamicInput
              v-model:value="model.meta.query"
              preset="pair"
              :key-placeholder="$t('page.manage.menu.form.queryKey')"
              :value-placeholder="$t('page.manage.menu.form.queryValue')"
            >
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic:round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>

        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
