<script setup lang="ts">
import { reactive, ref,onMounted } from 'vue';
import {$t} from "@/locales";
import {UploadCustomRequestOptions, UploadFileInfo} from "naive-ui";
import {localStg} from "@/utils/storage";
import {lyla} from "@lylajs/web";
import {getuserinfo, putuser} from "@/service/api";

const stata = reactive({
  model:{
      nick:"",
      phone:"",
      tag:{
      userinfo:{},
        companyinfo:{}
  }
  },

  rules:{},
  sexoption:[
      { label: '保密', value: '保密' },
      { label: '男', value: '男' },
      { label: '女', value: '女' },
  ]

});



onMounted(() => {
    get_user()
});


async function get_user(){
   const {data,error}= await getuserinfo(    localStg.get('userobjectId'))
    if (!error){

        stata.model=data
    }
}

const beforeUpload =(data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
}) => {
    data.fileList=[]

    // console.log("data.fileList",data.fileList)

    if (data.file.file?.type !== 'image/png') {
        // message.error('只能上传png格式的图片文件，请重新上传')
        window.$message?.warning("只能上传png格式的图片文件，请重新上传")


        return false
    }
    return true
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
    let path = `/dgiot_file/user/profile/`
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
        stata.model.tag.userinfo.avatar=json.json.path
    })

};
async function handleSubmit(){
  const {nick,phone,tag} =stata.model

  const {data,error}=await putuser(localStg.get('userobjectId'),{nick,phone,tag})
  if (!error){
    get_user()
  }
}

</script>





<template>
<NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
    <NFlex>
        <NCard  style="width: 400px">
    <NUpload
            action="http://iot1.dz-ai.com/upload"
            :clear=true
            :show-file-list=false
            @before-upload="beforeUpload"
            :custom-request="upFile"
    >
        <n-space vertical align="center">
            <NAvatar v-if="stata.model.tag.userinfo.avatar" round
                      :size="248"
                      :src="stata.model.tag.userinfo.avatar"
            />
        </n-space>
    </NUpload>
        </NCard>
  <NCard  style="width: 500px">
  <NForm ref="formRef" :model="stata.model" :rules="stata.rules">



    <NFormItem label="用户名称" path="">
      <NInput v-model:value="stata.model.nick"  />
    </NFormItem>
    <NFormItem label="电话" path="">
      <NInput v-model:value="stata.model.phone" disabled  />
    </NFormItem>
      <NFormItem label="简介" path="">
      <NInput v-model:value="stata.model.tag.userinfo.description"  type="textarea" />
    </NFormItem>

    <NFormItem label="table" path="">
      <NInput v-model:value="stata.model.tag.companyinfo.title"  type="textarea" />
    </NFormItem>
    <NFormItem label="性别" path="">
      <NSelect v-model:value="stata.model.tag.userinfo.sex"  :options="stata.sexoption" />
    </NFormItem>


  </NForm>
    <NSpace :size="16">

      <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
    </NSpace>
  </NCard>
    </NFlex>
</NCard>
</template>

<style scoped></style>
