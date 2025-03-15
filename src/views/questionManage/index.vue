<script setup lang="tsx">
import {reactive, ref} from 'vue'
import { NButton, NPopconfirm, NImage,NPerformantEllipsis,Ntag } from 'naive-ui';
import {deleteMaintenance, getQuestion, Batch, deletequestion} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import {localStg} from "@/utils/storage";
import NoticeSearch from './modules/search.vue';
import Deleteall from './modules/deleteall.vue';
import md5 from 'js-md5';
import dayjs from "dayjs";
import {enableStatusRecord} from "@/constants/business";
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();
import { lyla } from '@lylajs/web'

import type { UploadCustomRequestOptions,UploadFileInfo } from 'naive-ui'
import Transfer from "@/views/manage/user/modules/transfer.vue";



const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  pagination,
  mobilePagination,
  searchParams,
  fromParams,
  resetSearchParams
} = useTable({
  immediate: undefined,
  apiFn: getQuestion,
  showTotal: true,

  apiParams: {
    count: 'objectId',
    order: '-createdAt',
    limit: 10,
    skip: 0
  },
  columns: () => [

    {
      key: 'objectId',
      title: 'id',
      align: 'center',
      width: 64
    },

    {
      key: 'name',
      title: '试卷',
      align: 'center',
      minWidth: 100
    },
   {
      key: 'category',
      title: '大题类型',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'type',
      title: '小题类型',
      align: 'center',
      minWidth: 100
    },

   {
      key: 'question',
      title: '题目',
      align: 'center',
      minWidth: 100,
     width: 440,

     render:row => {
       return <NEllipsis style="max-width: 440px" title="{{content}}">{{
         default: () => row.question,
         tooltip:()=>(
             <div style="text-align: center; width: 440px">
               {row.question}</div>
         )

       }}
       </NEllipsis>}
    },
    {
      key: 'options',
      title: '选项',
      align: 'center',
      width: 150,
      render:  row => (<div style=" width:100px" >{ row.options.map((d) => ( <div style='width:100px' >{d.option+':'+d.text}</div>))}</div>)
    },
    {
      key: 'answer',
      title: '答案',
      align: 'center',
      width: 150,
      render:  row => (<div style=" width:100px" >{ row.answer.map((d) => ( <div style='width:100px' >{d}</div>))}</div>)
    },

    {
      key: 'background',
      title: '背景材料',
      align: 'center',
      width: 440,

        render:row => {
          return <NEllipsis style="max-width: 440px" title="{{content}}">{{
            default: () => row.background,
            tooltip:()=>(

                <div style="text-align: center; width: 440px">
                  {row.background}</div>
            )

          }}
          </NEllipsis>}
    },

    {
      key: 'startdate',
      title: '创建时间',
      align: 'center',
      minWidth: 130,
      render: (row) => {
        return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
      },
    },

    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NPopconfirm onPositiveClick={() => handleDelete(row.objectId)}>
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
  // request
  // console.log("checkedRowKeys.value",checkedRowKeys.value);

  onBatchDeleted();
}
const goToConsole = ( id: string) => {

  routerPushByKey('tools_questinfo', {
    query: {
      taskId: id,
    }
  });
};


async function handleDelete(id: string) {
  // request
  const {data, error} = await deletequestion(id);
// console.log("data", data)
  if (data.status == 200) {

    getData()
  }
}

function edit(id: number) {
  handleEdit(id);
}

const beforeUpload =(data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
}) => {
    data.fileList=[]
  console.log('data',data)
    if (data.file.file?.type !== 'text/plain') {
        // message.error('只能上传png格式的图片文件，请重新上传')
        window.$message?.warning("只能上传txt文件，请重新上传")
        return false
    }
    return true
}
const content=ref('')

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
  // console.log('data',data)
  // console.log('data',file)
    // formData.append("file", file.file as File);
    let token = localStg.get('sessionToken')
    const reader = new FileReader();

    reader.onload = (e) => {
      content.value = e.target.result;
        const DD=content.value.split('四、案例题')

        let question=[];
      if (DD[1]){
          const questionBlocks = DD[0].split(/\n\s*\n/);

          questionBlocks.forEach(section => {
              // 处理单选题
              section.replaceAll("一、单选题",'')
              section.replaceAll("二、多选题",'')
              section.replaceAll("三、判断题",'')
              // if (section.includes('单选题')) {

                  const parse =parseQuestions(section.split(/\n\s*\n/),  file.name, '单选题',"",1,1)
                  question=[...question,...parse]

              // }
              // 处理多选题
              // else if (section.includes('多选题')) {
              //
              //     const parse =parseQuestions(section.split(/\n\s*\n/),  file.name, '多选题',"",2,2)
              //     question=[...question,...parse]
              // }
              // // 处理判断题
              // else if (section.includes('判断题')) {
              //
              //     const parse =parseQuestions(section.split(/\n\s*\n/),  file.name,'判断题',"",3,3)
              //     question=[...question,...parse]
              // }
              // // 处理案例题


          })

          // const sections1 = DD[1].split(/\n\s*\n/);
          // const sections1 = DD[1].split(/(\n一、|\n二、|\n三、|\n四、)/g)
          //     .filter(s => s.trim() && !s.startsWith('\n一、') && !s.startsWith('\n二、'));

          // sections1.forEach(section1 => {

                  // 处理案例题
                    const parse =parseCaseQuestions(DD[1], file.name )
                    question=[...question,...parse]
              // });


      }

        const body=[]

      question.forEach((item)=>{
         if(item){
             const data = {
                 "path": "/classes/Question",
                 "method": "POST",
                 "body": item
             }
             body.push(data)
         }
     })


      // console.log('question',question)
      update(file.name,body)


    };

    reader.readAsText(file.file as File);

    // content=reader.result




  // const action = 'http://113.45.159.94/upload';
    // let path = `dgiot_file/crop`
    // let time = new Date().getTime()
    // formData.append("scene", "app");
    // formData.append("filename", time + `.png`);
    // formData.append("output", "json");
    // formData.append("path", path);
    // formData.append("auth_token", token);
    // formData.append("code", "");
    // formData.append("submit", "upload");
    // lyla.post(action as string, {
    //     withCredentials,
    //     headers: headers as Record<string, string>,
    //     body: formData,
    // }).then(( json:object) => {
    //     model.image=json.json.path
    // })
};

// {
//   "requests": [
//   {
//     "path": "string",
//     "method": "POST",
//     "body": {}
//   }
// ]
// }


function parseQuestions(questionBlocks:any ,name:string,category:string ,background:string,index:number,number:number, ){
  const question=questionBlocks.map(block => {
    // 初始化题目对象
    name=name.replaceAll(".txt","")
    name= name.trim()
    const ACLName = `*`
    const ACL = {
      [ACLName]: {"read": true, "write": true}
    };
    const questionObj = { objectId:"", ACL:ACL,type: "",name:name, question: "", options: [], answer: '' ,category:category,background:background,index:index,number:number}
    if (block.split('\n')[0] !== '\r'){

    // 提取题型
    const typeMatch = block.match(/\[(单选题|多选题|判断题)\]/);
    if (typeMatch) {
      questionObj.type = typeMatch[1];
      if (background  === '' || background  === '' ){
        questionObj.category=typeMatch[1];
      }else {

      }
      block = block.replace(typeMatch[0], ""); // 移除题型标记
        // 提取答案
        const answerMatch = block.match(/答案：\s*([^\s]+)/);
        if (answerMatch) {
            questionObj.answer = answerMatch[1].toUpperCase();
            block = block.replace(answerMatch[0], ""); // 移除答案行
        }

        // 分割问题和选项
        const [questionPart, ...optionParts] = block.split('\n').filter(l => l.trim());
        // console.log(block)
        // console.log(block.split('\n'))
        // console.log(questionPart)
        // 处理问题
        //   console.log(questionPart)

        if (questionPart){
            questionObj.question = questionPart.trim();

            // 处理选项（仅选择题）
            if (questionObj.type !== '判断题') {
                optionParts.forEach(line => {
                    const optionMatch = line.match(/^([A-Z])\.\s*(.+)/);
                    if (optionMatch) {
                        const [, key, value] = optionMatch;
                        questionObj.options.push({option: key, text: value.trim()  })
                        // [key] = value.trim();
                    }
                });



            }else{
                questionObj.options=[ {option: '正确', text: '正确'}, {option: '错误', text: '错误'}]
            }
            if (questionObj.type === '单选题' &&  questionObj.category !== '案例题' ){
                questionObj.number=1
                questionObj.index=1
            }else if (questionObj.type === '多选题' &&  questionObj.category !== '案例题' ){
                questionObj.number=2
                questionObj.index=2
            }else if (questionObj.type === '判断题' &&  questionObj.category !== '案例题' ){
                questionObj.number=3
                questionObj.index=3
            }

            if (questionObj.type === '判断题' && questionObj.category === '案例题' ) {
                questionObj.index=6
            }else  if (questionObj.type === '多选题' && questionObj.category === '案例题'){
                questionObj.index=5
            }
            questionObj.objectId= md5(questionObj.question+questionObj.name).substring(0, 10)
            // 处理多选题答案格式
            if (questionObj.type === '多选题') {
                questionObj.answer = questionObj.answer.split('');
            }else {
                questionObj.answer = [questionObj.answer];
            }
            return questionObj;
    }


    }

}
  });
  return question;
}


function parseCaseQuestions(text:any ,name:string) {
  let cases = [];
  const caseBlocks = text.split(/【背景材料】/g).slice(1);
    console.log(caseBlocks.length)
  caseBlocks.forEach(block => {
    // const caseObj = {
    //   background: '',
    //   questions: []
    // };

    // 提取背景描述
    const bgMatch = block.match(/([\s\S]+?)\n\[/);

    // console.log('bgMatch',bgMatch)
    const questionObj= { type: "",name:name, question: "", options: [], answer: '' ,category:'案例题',background:''}
    if (bgMatch) {
      questionObj.background = bgMatch[1].trim()||"";

      block=block.replaceAll(bgMatch[1],"");

      const cases11=parseQuestions(block.split(/\n\s*\n/),  name,'案例题', questionObj.background,4,4)
      cases =[...cases , ...cases11]
      // block = block.slice(bgMatch[0].length);
    }


  });

  return cases;
}

async function update(name:string,body:any){
  name=name.replaceAll(".txt","")
  const list=[]
  // const params={
  //   where:{name}
  // }
  // const {data,error} =await getQuestion(params)
  // if (data.status==200){
  //   data.results.forEach((item)=>{
  //     const D = {
  //       "path": `/classes/Question/${item.objectId}`,
  //       "method": "DELETE",
  //       body:{}
  //     }
  //     list.push(D)
  //   })
  //  const error1 =await batch_(list)
  //
  //   if (!error1){
      const error2 =await batch_(body)
      if (!error2){
        // getData()
        location.reload();
      }
    // }
  // }

  return data

}


async function batch_(B:any){
  const body={ "requests": B}
  const{data,error}=await Batch(body)
  // if (!error){
  //   getData()
  // }
  return error

}

const delete_ = reactive({
  showModal:false,

})
function opendelete_(){

  delete_.showModal = true

  // console.log(transfer  )
}
function delete_ModalClose(){

  delete_.showModal = false

  // console.log(transfer  )
}

</script>

<template>
<div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
  <NoticeSearch v-model:model="searchParams" @reset="resetSearchParams" @search="fromParams" />
  <NCard :title="'题库'" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
    <template #header-extra>
        <NUpload

                :clear=true
                :show-file-list=false
                @before-upload="beforeUpload"
                :custom-request="upFile"
        >
            <n-space vertical align="center">
                <n-button>上传</n-button>
            </n-space>
        </NUpload>
      <NButton type="error" ghost size="small" @click="opendelete_">
        删除试卷
      </NButton>



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
      :striped="true"
      class="sm:h-full"
    />
    <Deleteall
        :visible="delete_.showModal"    @update:visible="delete_ModalClose" @submitted="getData"
      />
  </NCard>
</div>
</template>

<style scoped></style>
