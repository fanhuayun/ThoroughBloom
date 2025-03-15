<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';
import {putdevice,postdevice} from '@/service/api';
import { $t } from '@/locales';

import type { UploadCustomRequestOptions } from 'naive-ui'
import { localStg } from '@/utils/storage';
import { lyla } from '@lylajs/web'
import { useproduct } from '@/store/modules/product';
const product = useproduct();

const productOptions = ref<CommonType.Option[]>([]);
productOptions.value=product.Productdata.selectList

const status = ref(false)

defineOptions({
  name: 'OperateDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Crop | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = cropNaiveForm();
const { defaultRequiredRule } = cropFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增设备',
    edit: '修改设备'
  };
  return titles[props.operateType];
});


const model  = reactive(createDefaultModel());

function createDefaultModel()  {
  return {
    objectId: '',
    product:{
      objectId:'',
      'className':"Product",
      '__type':"Pointer"
    },
    isEnable:true,
    name: '',
    devaddr: '',
  };
}




function closeDrawer() {
  visible.value = false;
}

async function  Submit(){
  if (status.value) {
    const info={
      name: model.name
    }
    const {data,error} = await putdevice(model.objectId,info)
    if (data.status==200){
      window.$message?.success('修改成功');
      closeDrawer();
      emit('submitted')
    }
  } else {
    const info={
      name: model.name,
      product: model.product,
      devaddr: model.devaddr,
      isEnable:true
    }
    const {data,error} = await postdevice(info)
    if (data.status==200){
      window.$message?.success('新增成功');
      closeDrawer();
      emit('submitted')
    }
  }
}







watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();




  }
});
function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    status.value= true
    Object.assign(model, props.rowData);
  }
}
</script>
<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" >
        <NFormItem label="设备名称" path="cropName">
          <NInput v-model:value="model.name" />
        </NFormItem>
        <NFormItem label="设备编号" path="cropName" >
          <NInput v-model:value="model.devaddr" :disabled="status" />
        </NFormItem>
        <NFormItem label="设备类型" path="icon" >
          <NSelect v-model:value="model.product.objectId" :options="productOptions" :disabled="status"  />
        </NFormItem>

      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="Submit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
<style scoped></style>
