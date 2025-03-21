<script lang="ts" setup>
import {computed, reactive} from 'vue';
import {$t} from '@/locales';
import {loginModuleRecord} from '@/constants/app';
import {useRouterPush} from '@/hooks/common/router';
import {useFormRules, useNaiveForm} from '@/hooks/common/form';
import {useAuthStore} from '@/store/modules/auth';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const {toggleLoginModule} = useRouterPush();
const {formRef, validate} = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: '',
  password: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const {formRules} = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    userName: '',
    password: ''
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    userName: '',
    password: ''
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    userName: '',
    password: ''
  }
]);

async function handleAccountLogin(account: Account) {
  await authStore.login(account.userName, account.password);
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" :show-label="false" size="large">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')"/>
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
        show-password-on="click"
        type="password"
      />
    </NFormItem>
    <NSpace :size="24" vertical>
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
<!--        <NButton quaternary @click="toggleLoginModule('reset-pwd')">-->
<!--          {{ $t('page.login.pwdLogin.forgetPassword') }}-->
<!--        </NButton>-->
      </div>
      <NButton :loading="authStore.loginLoading" block round size="large" type="primary" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
<!--      <div class="flex-y-center justify-between gap-12px">-->
<!--        <NButton block class="flex-1" @click="toggleLoginModule('code-login')">-->
<!--          {{ $t(loginModuleRecord['code-login']) }}-->
<!--        </NButton>-->
<!--        <NButton block class="flex-1" @click="toggleLoginModule('register')">-->
<!--          {{ $t(loginModuleRecord.register) }}-->
<!--        </NButton>-->
<!--      </div>-->
<!--      <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>-->
<!--      <div class="flex-center gap-12px">-->
<!--        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">-->
<!--          {{ item.label }}-->
<!--        </NButton>-->
<!--      </div>-->
    </NSpace>
  </NForm>
</template>

<style scoped></style>
