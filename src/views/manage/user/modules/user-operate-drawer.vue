<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import {PetUserList, PostUser} from '@/service/api';
import { $t } from '@/locales';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}
import { localStg } from '@/utils/storage';
const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<
    'objectId' |'username' | 'nick' | 'phone' | 'email'   | 'emailVerified'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    username: '',
    nick: '',
    phone: '',
    password: '',
    email: '',
    emailVerified: null
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

// const rules: Record<RuleKey, App.Global.FormRule> = {
//   username: defaultRequiredRule,
//   status: defaultRequiredRule
// };

const rules= {
  username:{
    required: true,
    message: '请输入',
    trigger: ['input']
  },
  password: {
    required: true,
    message: '请输入',
    trigger: ['input']
  },
  nick: {
    required: true,
    message: '请输入',
    trigger: ['input']
  },
  email: {
    required: false,
    message: '请输入',
    trigger: ['input']
  },
  phone:{
    required: true,
    message: '请输入',
    trigger: ['input']
  }
}

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);



function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {

  let   {objectId,username,nick,password,phone,email,emailVerified}=model
  if (email|| email===''){
    email=phone+"@qq.com"
  }
 const  body= {
    "username": username,
      "nick": nick,
      "password": password,
      "phone": phone,
      "email": email,
      "department": localStg.get("deptId"),
      "emailVerified": true,
      "tag": {
    "companyinfo": {
      "title": "欢迎登录DG-IoT物联网开发平台",
          "Copyright": "© 2017-2021 DG-IoT Corporation, All Rights Reserved",
          "name": "DG-IoT",
          "logo": "/group1/default/20211019/18/33/4/微信图片_20210705103613.jpg",
          "_pcimg": "/dgiot_file/user/profile/Klht7ERlYn_companyinfo__pcimg.jpeg?timestamp=1635245685140",
          "_mimg": "/dgiot_file/user/profile/Klht7ERlYn_companyinfo__mimg.jpeg?timestamp=1635245663651",
          "homeScreen": "0",
          "backgroundimage": "/dgiot_file/user/profile/4d867367b4_companyinfo_backgroundimage.jpg?timestamp=1665746388806"
    },
    "userinfo": {
      "avatar": "/dgiot_file/user/profile/4d867367b4_userinfo_avatar.jpg?timestamp=1675218327170",
          "sex": "男",
          "phone": "13033443344",
          "parse_deviceid": "3a7eba859e",
          "description": "使用dgiot时有任何问题或建议，请联系dgiot官方FAE，致电13208054333或者扫码微信二维码！"
    },
    "theme": {
      "layout": "horizontal",
          "themeName": "white",
          "columnStyle": "horizontal",
          "fixedHeader": true,
          "showProgressBar": true,
          "showTabs": true,
          "tabsBarStyle": "smooth",
          "showTabsBarIcon": true,
          "showLanguage": true,
          "showRefresh": true,
          "showSearch": true,
          "showTheme": true,
          "showNotice": true,
          "showFullScreen": true,
          "showThemeSetting": true,
          "pictureSwitch": false
    }
  }
  }
 const {data,error}=  await PostUser(body)

  // await validate();
  // request
  if (!error){
    window.$message?.success($t('common.updateSuccess'));
    closeDrawer();
    emit('submitted');
  }
 }

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    // getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.user.userName')" path="username">
          <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput v-model:value="model.password" :placeholder="$t('page.manage.user.form.userEmail')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.nickName')" path="nick">
          <NInput v-model:value="model.nick" :placeholder="$t('page.manage.user.form.nickName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userPhone')" path="phone">
          <NInput v-model:value="model.phone" :placeholder="$t('page.manage.user.form.userPhone')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userEmail')" path="email">
          <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
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
