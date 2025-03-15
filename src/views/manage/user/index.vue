<script setup lang="tsx">
import {NButton, NPopconfirm, NTag, UploadCustomRequestOptions, UploadFileInfo} from 'naive-ui';
import {DeleteUser, fetchGetUserList, PostUsers} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';
import Transfer from './modules/transfer.vue';
import Examination from './modules/examination.vue';
import Maturitydate from './modules/maturitydate.vue';
import {localStg} from "@/utils/storage";
import { ref ,reactive} from 'vue'
const appStore = useAppStore();
import dayjs from "dayjs";
const status=ref({
  'false': {
    "value":"禁用",
    "status":"warning"
  },
  "true":{ "value":"正常",
    "status":"primary"
  },
})
const bind=ref({
  'false': {
    "value":"未绑定",
    "status":"warning"
  },
  "true":{ "value":"绑定",
    "status":"primary"
  },
})

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
    fromParams,
  resetSearchParams
} = useTable({
  immediate: undefined,
  apiFn: fetchGetUserList,
  showTotal: true,

  apiParams: {
    include: true,
      order: '-createdAt',
      limit: 10,
      skip: 0,
    where:  {objectId: localStg.get('deptId') }
  },
  columns: () => [

    {
      key: 'objectId',
      title: "id",
      align: 'center',
      width: 64
    },
    {
      key: 'username',
      title: $t('page.manage.user.userName'),
      align: 'center',
      minWidth: 100
    },

    {
      key: 'nick',
      title: $t('page.manage.user.nickName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'phone',
      title: $t('page.manage.user.userPhone'),
      align: 'center',
      width: 120
    },
    {
      key: 'roles',
      title: '角色',
      align: 'center',
      width:320,
        render:  row => (<div >{ row.roles.map((d) => (<div>{d.depname}</div>))}</div>)
    },
    {
      key: 'email',
      title: $t('page.manage.user.userEmail'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'bind',
      title: '微信openid绑定',
      align: 'center',
      minWidth: 200,
      render: (row) => {
        if (row.tag.wechat){
          let status1=String(row.tag.wechat.openid && row.tag.wechat.openid !== '' ? true :false)
          return <NTag type={bind.value[status1].status}>{bind.value[status1].value}</NTag>;
        }else {
         return <NTag type={bind.value['false'].status}>{bind.value['false'].value}</NTag>;
        }
      }
    },    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 200,
      render: (row) => {
        if (row.maturitydate){
          let status1=String(row.maturitydate-Date.now()>0)
          return <NTag type={status.value[status1].status}>{status.value[status1].value}</NTag>;
        }
      }
    },
    {
      key: 'maturitydate',
      title: '到期时间',
      align: 'center',
      minWidth: 200,
      render: (row) => {
        if (row.maturitydate){

          return dayjs(row.maturitydate).format("YYYY-MM-DD HH:mm:ss");
        }
      }
    },

    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 330,
      render: row => (
        <div class="flex-center gap-8px">


          <NButton type="primary" ghost size="small" onClick={() => openMaturitydate(row)}>
            设置到期时间
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => openExamination(row)}>
            查看考试记录
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => openTransfer(row)}>
            转换角色
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row)}>
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


const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {

  onBatchDeleted();
}

async function handleDelete(item:object) {

  const body={
    department:item.roles[0].objectId,
    username:item.username

  }

  const {data,error}=await DeleteUser(body)
  if (!error){
    onDeleted();
  }
}



const transfer = reactive({
  showModal:false,
  objectId:"",
  depname:"",
})
function openTransfer(item:object){
  const list=[]
  item.roles.forEach((item1)=>{
    list.push(item1.depname)
  })

  transfer.objectId= item.objectId;
  transfer.depname= list;
  transfer.showModal = true

  // console.log(transfer  )
}
function TransferModalClose(){
  transfer.showModal=false,
  transfer.objectId=""
  transfer.depname=""
}
const examination = reactive({
  showModal:false,
  objectId:"",
  name:"",

})
function openExamination(item:object){

  examination.objectId= item.objectId;
  examination.name= item.nick;
  examination.showModal = true
}
function ExaminationModalClose(){
      examination.showModal=false,
      examination.objectId=""
      examination.name=""
}
const maturitydate = reactive({
  showModal:false,
  objectId:"",
    maturitydate:null,

})
function openMaturitydate(item:object){
  maturitydate.objectId= item.objectId;
  maturitydate.maturitydate= item.maturitydate||null;
  maturitydate.showModal = true
}
function MaturitydateModalClose(){
  maturitydate.showModal=false,
  maturitydate.objectId=""
  maturitydate.maturitydate=null
}
const beforeUpload =(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  data.fileList=[]

  return true
}
const stata=reactive({
  data:{
    results:[]
  }
})

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

  let token = localStg.get('sessionToken')
  let reader = new FileReader();

  reader.onload = (e) => {
    e.target.result;
    const List=[]
    const questionBlocks = e.target.result.split(/\n/);
    // console.log( 'questionBlocks',questionBlocks)
    questionBlocks.forEach((item)=>{
      const [nick,username,password,deId,..._]=item.split(/\t/)
      if (nick && username && password && deId ){
        const  D= {
          "username": username,
          "nick": nick,
          "password": password,
          "phone": username,
          "email": username+"@qq.com",
          "department": deId.replaceAll('\r',''),
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
        List.push(D)
      }

    })

    stata.data.results=List
    if(List.length>0){

      opostusers()
    }

  };



  reader.readAsText(file.file as File);
  reader=null
};
async function opostusers(){

   const {data,error}= await PostUsers(stata.data)
    if (!error){
      // getData()
        location.reload();
    }
}


</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="fromParams" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
        />
        <n-button size="small" type="primary" style="margin-left: 12px">
        <NUpload
            :clear=true
            :show-file-list=false
            @before-upload="beforeUpload"
            :custom-request="upFile"
        >
            <n-button size="small" type="primary" >上传</n-button>
        </NUpload>
        </n-button>
      </template>
      <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :scroll-x="962"
          :loading="loading"
          remote
          :row-key="row => row.id"
          :pagination="mobilePagination"
          class="sm:h-full"
      />
      <UserOperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          @submitted="getDataByPage"
      />
      <Transfer :visible="transfer.showModal"  :objectId="transfer.objectId" :depname="transfer.depname"  @update:visible="TransferModalClose" @submitted="getData"/>
      <Examination :visible="examination.showModal"  :objectId="examination.objectId" :name="examination.name"   @update:visible="ExaminationModalClose" />
      <Maturitydate :visible="maturitydate.showModal"  :objectId="maturitydate.objectId" :maturitydate="maturitydate.maturitydate"   @update:visible="MaturitydateModalClose" @submitted="getData" />

    </NCard>
  </div>
</template>
<style scoped></style>
