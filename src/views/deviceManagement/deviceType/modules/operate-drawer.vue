<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { cropFormRules, cropNaiveForm } from '@/hooks/common/form';
import {postproduct, queryChannel,putproduct} from '@/service/api';
import { $t } from '@/locales';
import {Base64} from 'js-base64'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { localStg } from '@/utils/storage';
import { lyla } from '@lylajs/web'



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
    add: '新增设备类型',
    edit: '修改设备类型'
  };
  return titles[props.operateType];
});


const model  = reactive(createDefaultModel());

function createDefaultModel()  {
  return {
    objectId: '',

    channel:{
      type: 0,
      tdchannel: '',
      taskchannel: '',
      otherchannel: '',
    },
    name: '',
    devType: '',
  };
}



/** the enabled org options */
const channelResource = ref([]);
const message = ref([""]);
const taskchannelList = ref<CommonType.Option[]>([]);
const tdchannelList = ref<CommonType.Option[]>([]);
const otherchannelList = ref<CommonType.Option[]>([]);




function get_message() {
  if (props.operateType == "edit"){

    message.value=props.rowData.login.split(",")
  } else if (props.operateType == "add"){
    message.value=[""]
  }
}


async function Get_Re_Channel() {
  const params = {
    count: 'objectId',
    order: '-createdAt',
    keys: 'count(*)',
    where: {},
  }
  const { data,error } = await queryChannel(params)

  channelResource.value = data.results
  taskchannelList.value = getChannel(data.results, '2', 'INSTRUCT')
  tdchannelList.value =   getChannel(data.results, '2', 'TD')
  otherchannelList.value =getChannel(data.results, '1', '')
}


function getChannel(channelResource, type, cType) {
  let res = []
  channelResource.forEach((item)=>{
    if((item.type== type && (item.cType == cType || cType == ''))){
    res.push({label: item.name, value: item.objectId})
    }
  })

  return res
}
/** the enabled type options */





function closeDrawer() {
  visible.value = false;
}
function deletemessage(indexToRemove) {
  message.value = message.value.filter((_, index) => index !== indexToRemove);
}

function addmessage() {
  message.value.push('')
}
async function  Submit(){
  if (props.operateType == "add") {
    const ranNum = Math.ceil(Math.random() * 25)
    const productSecret = Base64.encode(
        String.fromCharCode(65 + ranNum) +
        Math.ceil(Math.random() * 10000000) +
        Number(new Date())
    )
    const dep=`role:${localStg.get('rolename')}`


    const ACL={}
    ACL[dep] ={
      "read": true,
      "write": true
    }

    const info = {
      content: {},
      profile: {},
      ACL:ACL,
      // 以上两个参数加了可能会出错。出错请在数据库自己加
      dynamicReg: true,
      name: model.name,
      nodeType: 3,
      netType:'CELLULAR',
      icon: '',
      devType: model.devType,
      desc: '',
      thing:  {},
      login: message.value.join(','),
      category: {
        objectId:'5ca6049839',
        __type: 'Pointer',
        className: 'Category',
      },
      producttemplet: {
        objectId: '0',
        __type: 'Pointer',
        className: 'ProductTemplet',
      },
      channel: model.channel,
      topics: {},
      decoder: {},
      config: {
        checkList: [
          "konva",
          "amis"
        ],
        interval: -1
      },
      productSecret: productSecret,
    }
    const {data,error} = await postproduct(info)
    if (data.status==200 && !error){
      window.$message?.success($t('common.addSuccess'));
      closeDrawer();
      emit('submitted')
    }
  } else
    if (props.operateType == "edit") {
    const info={
      login: message.value.join(','),
      channel: model.channel,
    }
    const {data,error} = await putproduct(model.objectId,info)
    if (data.status==200){
      window.$message?.success($t('common.addSuccess'));
      closeDrawer();
      emit('submitted')
    }
  }
}







watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();


    Get_Re_Channel();

    get_message();


  }
});
function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}
</script>
<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" >
        <NFormItem label="名称" path="cropName">
          <NInput v-model:value="model.name" />
        </NFormItem>
        <NFormItem label="设备厂家" path="cropName">
          <NInput v-model:value="model.devType" />
        </NFormItem>
        <NFormItem label="任务通道" path="icon">
          <NSelect v-model:value="model.channel.taskchannel" :options="taskchannelList"  />
        </NFormItem>
        <NFormItem label="存储通道" path="icon">
          <NSelect v-model:value="model.channel.tdchannel" :options="tdchannelList"  />
        </NFormItem>
        <NFormItem label="采集通道" path="icon">
          <NSelect v-model:value="model.channel.otherchannel" :options="otherchannelList"  />
        </NFormItem>
        <NFormItem label="modbus登录报文" path="icon">
          <n-flex vertical>
          <n-table :bordered="false" :single-line="false">
            <thead>
            </thead>
            <tbody>
            <tr v-for="(_ , index) in message">
              <td>
                <n-input  v-model:value="message[index]"  :placeholder="$t('请输入报文') "></n-input>
              </td>
              <td>
                <NButton type="error" @click="deletemessage(index)">
                  {{ "删除" }}
                </NButton>
              </td>
            </tr>
            </tbody>
          </n-table>
          <NButton @click="addmessage"  style="margin: 0 auto"  circle>
            <SvgIcon icon="ic:add" class="mr-1 text-5 text-[#009E64]" />
          </NButton>
          </n-flex>
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
