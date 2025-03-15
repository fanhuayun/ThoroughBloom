<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';

import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
import { lyla } from '@lylajs/web'


import type { UploadFileInfo } from 'naive-ui'

import type { UploadCustomRequestOptions } from 'naive-ui'
import {postDict} from "@/service/api";
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
    add: $t('page.farmManage.crop.addCrop'),
    edit: $t('page.farmManage.crop.editCrop')
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
    image: ''
  };
}

type RuleKey = Extract<keyof Model,     'objectId'  | 'institution' | 'name' | 'image' >;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  institution: defaultRequiredRule,

};

/** the enabled org options */
const orgOptions = ref<CommonType.Option[]>([]);

async function getOrgOptions() {




}

/** the enabled type options */

const state = reactive({
  uploadMessage: [],
})




function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // console.log("title",title)


    const {image} =model


    const ACLName = `*`
    const ACL = {
      [ACLName]: {"read": true, "write": true}
    };
    const {data, error} = await postDict({class:"carousel", ACL,  type:"carousel", title:image} )
    if (data.status==200){
      window.$message?.success($t('common.addSuccess'));
      closeDrawer();
      emit('submitted')
    }


}






watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getOrgOptions();

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

const upFile = ({
                  file,

                  data,
                  headers,
                  withCredentials,
                  onFinish,
                  onError,
                  onProgress
                }: UploadCustomRequestOptions) => {
  const formData = new FormData();
  formData.append("file", file.file as File);
  let token = localStg.get('sessionToken')
  const action = 'https://test.hgjzt.com/upload';
  let path = `dgiot_file/crop`
  let time = new Date().getTime()
  formData.append("scene", "app");
  formData.append("filename", time + `.png`);
  formData.append("output", "json");
  formData.append("path", path);
  formData.append("auth_token", token);
  formData.append("code", "");
  formData.append("submit", "upload");
  lyla.post(action as string, {
    withCredentials,
    headers: headers as Record<string, string>,
    body: formData,
  }).then(( json:object) => {
    model.image=json.json.path
  })
};

</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">



        <NImage :src=model.image width= "150" />
        <NFormItem :label="$t('page.farmManage.crop.cropImg')" path="icon">
          <NUpload
              action="https://test.hgjzt.com/upload"
              :clear=true
              :show-file-list=false
              @before-upload="beforeUpload"
              :custom-request="upFile"
          >
            <n-space vertical align="center">
              <n-button>上传文件</n-button>
            </n-space>
          </NUpload>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
