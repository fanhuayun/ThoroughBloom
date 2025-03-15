<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive,onMounted} from 'vue';
import {$t} from "@/locales";
import {FormInst, FormItemRule, NCascader,} from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import dayjs from "dayjs";



defineOptions({
  name: 'Maturitydate'
});

import { useMessage } from 'naive-ui'
import {_RoleList, Get_mark, postrole, Putroleuser, PutUsers} from "@/service/api";

const message = useMessage()
const formRef = ref<FormInst | null>(null)





// 定义 props，接受外部传入的值
let props = defineProps({
  objectId: String,
  maturitydate:Number,
  visible: Boolean
});

const state = reactive({
  data:{
    userid:'',
    maturitydate:null
  },
  rules:{

    maturitydate: {
      type: 'number',
      required: true,
      message: '请选择',
      trigger: ['blur', 'change']
    },

  },

});






watch(props, () => {
  if (props.visible) {
    state.data.userid   =props.objectId
    state.data.maturitydate   =props.maturitydate

  }
})
const emits = defineEmits(['update:visible','submitted']);


function updateVisible(value: boolean) {
  emits('update:visible', value);
}

function handleClose() {
  state.data.userid=""
  state.data.maturitydate=null
  updateVisible(false);
}
async function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const   {data,error}=PutUsers(state.data)
      handleClose()
      emits('submitted')
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}


</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  preset="dialog" >
    <NForm ref="formRef"
           :model="state.data"
           :rules="state.rules" >
      <NFormItem label="到期日期" path="maturitydate">
        <NDatePicker type="date"   v-model:value="state.data.maturitydate"  />
      </NFormItem>


    </NForm>
    <!--    <template #footer>-->
    <NSpace :size="16" justify="end" >
      <NButton @click="handleClose">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
    </NSpace>

  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
