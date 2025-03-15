<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';
import {PostTopo, putthing, postthing, put_project} from '@/service/api';
import { $t } from '@/locales';
import type { UploadCustomRequestOptions } from 'naive-ui'
import { localStg } from '@/utils/storage';
import { lyla } from '@lylajs/web'
import { useproduct } from '@/store/modules/product';
const product = useproduct();
import { useMessage } from 'naive-ui'
const message = useMessage()
import type { UploadFileInfo } from 'naive-ui'
defineOptions({
  name: 'CropOperateDrawer'
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
    add: '新增视图',

  };
  return titles[props.operateType];
});

type Model = Pick<
    'objectId'  | 'institution' | 'name' | 'image'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {

    objectId: '',
    name: '',
    product: {
      objectId:'',
      'className':"Product",
      '__type':"Pointer"
    },
    hmi: {
      "views": [
        {
          "variables": {},
          "type": "svg",
          "svgcontent": "<svg width=\"460\" height=\"360\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\">\n <filter id=\"blur-filter\" x=\"-3\" y=\"-3\" width=\"200\" height=\"200\">\n  <feGaussianBlur stdDeviation=\"3\"/>\n </filter>\n <g>\n  <title>Layer 1</title>\n </g>\n</svg>",
          "property": {
            "events": [],
            "actions": []
          },
          "profile": {
            "width": 460,
            "margin": 10,
            "height": 360,
            "gridType": "fixed",
            "bkcolor": "#ffffffff",
            "align": "topCenter"
          },
          "name": "1",
          "items": {},
          "id": "v_101394988-01a12"
        }
      ],
      "layout": {
        "autoresize": false,
        "start": "v_11112413811-8534",
        "navigation": {
          "mode": "void",
          "type": "block",
          "bkcolor": "#F4F5F7",
          "fgcolor": "#1D1D1D",
          "items": [],
          "logo": false
        },
        "header": {
          "bkcolor": "#ffffff",
          "fgcolor": "#000000",
          "fontSize": 13,
          "itemsAnchor": "left",
          "loginInfo": "nothing"
        },
        "showdev": true,
        "zoom": "enabled",
        "inputdialog": "false",
        "hidenavigation": "true",
        "theme": "",
        "loginonstart": false,
        "loginoverlaycolor": "none",
        "show_connection_error": true,
        "customStyles": ""
      }
    },
    graphs: [],
    charts: [],
    version: "1.01",
    scripts:[],
    render:[],
    devices: {
      "0": {
        "type": "Server",
        "tags": {},
        "property": {
          "delay": 10
        },
        "name": "",
        "id": "0",
        "enabled": true
      }
    },
    server: {
      "type": "Server",
      "property": {
        "delay": 10
      },
      "name": "",
      "id": "0",
      "enabled": true
    }
  };
}

/** the enabled org options */
const productOptions = ref<CommonType.Option[]>([]);



productOptions.value = product.Productdata.selectList





function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
    await validate();
    const {data, error} = await PostTopo(model)

    if (data.status==200){
            window.$message?.success($t('common.addSuccess'));
            closeDrawer();
            emit('submitted')
    }


}


async function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      model.product
      model.devices['0'].name=product.Productdata.data[model.product.objectId]
      model.server.name=product.Productdata.data[model.product.objectId]



      const dep=`role:${localStg.get('rolename')}`


      model.ACL={}
      model.ACL[dep] ={
        "read": true,
        "write": true
      }

      const {data, error} = await put_project(model)
      if (data.status==200){
        window.$message?.success($t('common.addSuccess'));
        closeDrawer();
        emit('submitted')
      }
      message.info('新增成功')
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}


watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();

  }
});







const beforeUpload =(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  data.fileList=[]

  console.log("data.fileList",data.fileList)

  if (data.file.file?.type !== 'image/png') {
    // message.error('只能上传png格式的图片文件，请重新上传')
    window.$message?.warning("只能上传png格式的图片文件，请重新上传")


    return false
  }
  return true
}
function handleInitModel() {



  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}


const state = reactive({

  rules:{

    name: {
      required: true,
      message: '请输入名称',
      trigger: ['input']
    },
    product: {
      objectId:{
        required: true,
        message: '选择设备类型',
        trigger: ['blur', 'change']
      }
    }
  },

});

</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model"  :rules="state.rules">
        <NFormItem label="标题" path="name" >
          <NInput v-model:value="model.name"  placeholder="输入标题名称" />
        </NFormItem>

        <NFormItem label="设备类型" path="product.objectId">
          <NSelect v-model:value="model.product.objectId" :options="productOptions" placeholder="选择设备类型" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
