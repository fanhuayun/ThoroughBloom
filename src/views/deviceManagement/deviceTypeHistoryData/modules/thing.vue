<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, reactive,computed} from 'vue';
import {$t} from "@/locales";
import type { FormInst,FormItemRule, } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
// import {NButton,NTable} from "naive-ui";
import {useTable, useTableOperate} from '@/hooks/common/table';
import {ThingUnit, protocol,putthing,postthing} from "@/service/api";
import {localStg} from "@/utils/storage";
import object from "async-validator/dist-types/validator/object";

import {da} from "date-fns/locale";
defineOptions({
  name: 'Thing'
});

import { useMessage } from 'naive-ui'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const selectData=reactive({
  dataType:[],
  unitType:[],
  originaltype:[
    {value : 'bit', label : '位'},
    {value : 'short16_AB', label : '16位 有符号(AB)'},
    {value : 'short16_BA', label : '16位 有符号(BA)'},
    {value : 'ushort16_AB', label : '16位 无符号(AB)'},
    {value : 'ushort16_BA', label : '16位 无符号(BA)'},
    {value : 'long32_ABCD', label : '32位 有符号(ABCD)'},
    {value : 'long32_CDAB', label : '32位 有符号(CDAB)'},
    {value : 'ulong32_ABCD', label : '32位 无符号(ABCD)'},
    {value : 'ulong32_CDAB', label : '32位 无符号(CDAB)'},
    {value : 'float32_ABCD', label : '32位 浮点数(ABCD)'},
    {value : 'float32_CDAB', label : '32位 浮点数(CDAB)'}
  ],
  accessMode:[{label:'只读',value:'r'},{label:'读写',value:'rw'}],
  isstorage:[{label:'存储',value:true},{label:'不存储',value:false}],
  operatetype:
    [{value : 'readCoils', label : '0X01:读线圈寄存器'},
      {value : 'readInputs', label : '0X02:读离散输入寄存器'},
      {value : 'readHregs', label : '0X03:读保持寄存器'},
      {value : 'readIregs', label : '0X04:读输入寄存器'},
      {value : 'writeCoil', label : '0X05:写单个线圈寄存器'},
      {value : 'writeHreg', label : '0X06:写单个保持寄存器'},
      {value : 'writeCoils', label : '0X0f:写多个线圈寄存器'},
      {value : 'writeHregs', label : '0X10:写多个保持寄存器'}],
  isshow:[{label:'展示',value:true},{label:'不展示',value:false}],
  strategy:[{label:'3',value:'3'},{label:'计算值',value:'计算值'},{label:'主动上报',value:'主动上报'}],
  protocol:[{label:'MODBUSRTU',value:'MODBUSRTU'}],
  isaccumulate:[{label:'积累',value:true},{label:'不积累',value:false}],
})
const enumData=ref([])

const stata=reactive({
  status:false
})


// 定义 props，接受外部传入的值
let props = defineProps({
  thing: Object,
  model:String,
  product:String,
  visible: Boolean
});

const state = reactive({
  productId:'',
  thing:{
    required:true,
    isaccumulate: false,
    isshow: true,
    accessMode: 'r',
    isstorage: true,
    dataSource: {
      "": [],
      _dlinkindex: "",
      operatetype: "readCoils",
      originaltype: "short16_AB",
    },
    moduleType:"properties",
    dataType:{
      das: [],
      precision: 3,
      specs:{}
    },

    dataForm:{
      address: "0X10",
      collection: "%{s}",
      control: "%{d}",
      countcollection: "%{s}",
      countround: "all",
      countstrategy: 20,
      data: "null",
      iscount: "0",
      offset: 0,
      order: 0,
      protocol: "",
      rate: 1,
      round: "all",
      slaveid: "0X10",
      strategy: "主动上报"
    },
  },
  rules:{

    devicetype: {
      required: false
    },
    name: {
      required: true,
      message: '请输入名称',
      trigger: ['input']
    },
    dataType: {
      type:{
        required: true,
        message: '选择数据类型',
        trigger: ['blur', 'change']
      }
    },
    identifier: {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('需求输入')
        }
        else if (!/^[a-z][a-z0-9]*$/.test(value)) {
          return new Error('请以小写字母开头，只能输入小写字母')
        }
        return true
      },
      trigger: ['input']
    }
  },

});



watch(props, () => {
  if (props.visible) {

    state.productId=props.product

    model()
    getThingUnit()
    // polling(props.productId)
  }
})

async function getThingUnit(){
  let dataType=[]
  let unitType=[]

  const {data,error}= await ThingUnit()
  if (data.status==200){
    data.dataType.forEach((item)=>{
      dataType = [...dataType,...item.options]
    })
    data.dataNnit.forEach((item1)=>{
      item1.options.forEach((item2)=>{
        unitType.push({label:item2.description,value:item2.symbol})
      })
    })
  }
  selectData.unitType=unitType
  selectData.dataType=dataType


}

function model(){

  if (props.model==="add"){
    stata.status=false
    state.thing= {
      required:true,
      isaccumulate: false,
      isshow: true,
      accessMode: 'r',
      isstorage: true,
      dataSource: {
        "": [],
        _dlinkindex: "",
        operatetype: "readCoils",
        originaltype: "short16_AB",
      },
      moduleType:"properties",
      dataType:{
        das: [],
        precision: 3,
        specs:{}
      },

      dataForm:{
        address: "0X10",
        collection: "%{s}",
        control: "%{d}",
        countcollection: "%{s}",
        countround: "all",
        countstrategy: 20,
        data: "null",
        iscount: "0",
        offset: 0,
        order: 0,
        protocol: "",
        rate: 1,
        round: "all",
        slaveid: "0X10",
        strategy: "主动上报"
      },
    }
  }else if (props.model==="edit"){
    stata.status=true
    state.thing=props.thing

    if(props.thing.dataType.type=='enum'){
      let enumDatalist=[]
      for (let key in props.thing.dataType.specs){
        enumDatalist.push({key,value:props.thing.dataType.specs[key]})
      }
      enumData.value=enumDatalist
    }

  }



}





// console.log(props)
// const htmlContent = ref('<p>测试 <span style="font-family: inherit;"><span class="ql-cursor"></span></span></p >');
// 定义 emits，用于通知父组件弹窗何时关闭
const emits = defineEmits(['update:visible','update']);



// 更新父组件的 visible 状态
function updateVisible(value: boolean) {
  emits('update:visible', value);
}



// 定义一个方法，用于在弹窗关闭时调用
function handleClose() {
  updateVisible(false);
}








function addenum(indexToRemove:number){
  enumData.value.push({});
}
function deleteenum(indexToRemove:number){
  enumData.value = enumData.value.filter((_, index) => index !== indexToRemove);
}
async function updateenum(){
  let map={}
  enumData.value.forEach((item)=>{
    map[item.key]=item.value
  })
  state.thing.dataType.specs=map
}

async function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const productid = state.productId
      let item = state.thing
      item['updateAt'] = Date.now().toString()
      // message.success('验证成功')
      if (stata.status) {
        const {data, error} = await putthing({productid, item})
        if (data.status == 200) {
          updateVisible(false);
          emits('update');
        }

      } else {
        const {data, error} = await postthing({productid, item})
        if (data.status == 200) {
          updateVisible(false);
          emits('update');
        }
      }
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}

const  minStatus= computed(() => {
  if (state.thing.dataType.specs.min < state.thing.dataType.specs.max ){
    return "success"
  }else {
    return 'error'
  }
})
const maxStatus= computed(() => {
  if (state.thing.dataType.specs.min < state.thing.dataType.specs.max ){
    return "success"
  }else {
    return 'error'
  }
})
const stepStatus= computed(() => {
  if ((state.thing.dataType.specs.max -state.thing.dataType.specs.min  ) >state.thing.dataType.specs.step ){
    return "success"
  }else {
    return 'error'
  }
})
const sizeStatus= computed(() => {
  if (state.thing.dataType.specs.size >0 ){
    return "success"
  }else {
    return 'error'
  }
})
const minFeedback= computed(() => {
  if (state.thing.dataType.specs.min < state.thing.dataType.specs.max ){
    return ''
  }else {
    return '最小值必须小于最大值'
  }
})
const maxFeedback= computed(() => {
  if (state.thing.dataType.specs.min < state.thing.dataType.specs.max ){
    return ''
  }else {
    return '最大值必须大于最小值'
  }
})
const stepFeedback= computed(() => {
  if ((state.thing.dataType.specs.max -state.thing.dataType.specs.min  ) >state.thing.dataType.specs.step ){
    return ''
  }else {
    return '步长必须小于最大值和最小值的差值'
  }
})
const sizeFeedback= computed(() => {
  if (state.thing.dataType.specs.size >0  ){
    return ''
  }else {
    return '长度要大于0'
  }
})

function update_originaltype(){
  state.thing.dataForm.originaltype=state.thing.dataSource.originaltype
}

function update_operatetype(){
  state.thing.dataForm.operatetype=state.thing.dataSource.operatetype
}



</script>

<template>
  <!-- 使用 internalVisible 替代原来的 v-model:show -->
  <NModal :show="props.visible" @update:show="updateVisible"  style="width: 1400px" preset="dialog" title="物模型配置">
    <n-form
      ref="formRef"
      inline
      :label-width="80"
      :model="state.thing"
      :rules="state.rules"
      size="large"
    >   <n-flex justify="space-around" size="large">
      <n-grid  :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="类型" path="devicetype">
          <n-input v-model:value="state.thing.devicetype" placeholder="输入类型" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="功能名称" path="name">
          <n-input v-model:value="state.thing.name"  placeholder="输入名称" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="标识符" path="identifier">
          <n-input  v-model:value="state.thing.identifier"  :disabled="stata.status" placeholder="输入标识符" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据类型" path="dataType.type">
          <n-select v-model:value="state.thing.dataType.type" :options="selectData.dataType" :disabled="stata.status" placeholder="选择数据类型" />
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="读写类型" path="accessMode">
          <n-select v-model:value="state.thing.accessMode" :options="selectData.accessMode" />
        </n-form-item-gi>

        <n-form-item-gi :span="12" label="是否存储" path="storage">
          <n-select v-model:value="state.thing.isstorage" :options="selectData.isstorage" />
        </n-form-item-gi>

        <n-form-item-gi :span="12" label="是否展示" path="show">
          <n-select v-model:value="state.thing.isshow" :options="selectData.isshow" />
        </n-form-item-gi>

        <n-form-item-gi :span="12" label="是否积累" path="accumulate">
          <n-select v-model:value="state.thing.isaccumulate" :options="selectData.isaccumulate" />
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24" v-if="state.thing.dataType.type=='int' || state.thing.dataType.type=='long'  ">

        <n-form-item-gi :span="12" label="取值范围(最小值)"    :validation-status="minStatus" :feedback="minFeedback" >
          <n-input-number v-model:value="state.thing.dataType.specs.min" placeholder="输入最小值" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="取值范围(最大值)" :validation-status="maxStatus" :feedback="maxFeedback">
          <n-input-number v-model:value="state.thing.dataType.specs.max" placeholder="输入最大值" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="步长"  :validation-status="stepStatus" :feedback="stepFeedback">
          <n-input-number v-model:value="state.thing.dataType.specs.step" placeholder="输入步长"  />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="计量单位" path="identifier">
          <n-select v-model:value="state.thing.dataType.unit" :options="selectData.unitType"  filterable tag placeholder="选择计量单位" />
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24" v-if="state.thing.dataType.type=='float'|| state.thing.dataType.type=='double'">
        <n-form-item-gi :span="12" label="小数点位数" path="dataType.specs.precision">
          <n-input-number v-model:value="state.thing.dataType.specs.precision" placeholder="" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="取值范围(最小值)" path="dataType.specs.min">
          <n-input-number v-model:value="state.thing.dataType.specs.min" placeholder="输入最小值" :validation-status="minStatus" :feedback="minFeedback" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="取值范围(最大值)" path="dataType.specs.max">
          <n-input-number v-model:value="state.thing.dataType.specs.max" placeholder="输入最大值" :validation-status="maxStatus" :feedback="maxFeedback" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="步长" path="dataType.specs.max">
          <n-input-number v-model:value="state.thing.dataType.specs.step" placeholder="输入步长" :validation-status="stepStatus" :feedback="stepFeedback" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="计量单位" path="identifier">
          <n-select v-model:value="state.thing.dataType.unit" :options="selectData.unitType"  filterable tag placeholder="选择计量单位" />
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24" v-if="state.thing.dataType.type=='text'">
        <n-form-item-gi :span="12" label="数据长度" path="dataType.specs.size">
          <n-input-number v-model:value="state.thing.dataType.specs.size" :validation-status="sizeStatus" :feedback="sizeFeedback" placeholder="" />
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24" v-if="state.thing.dataType.type=='enum'">
        <n-form-item-gi :span="12" label="枚举项" path="dataType.specs.size">
          <!--          <NSpace :size="16" justify="end" style="margin-top:30px " >-->
          <!--            <NButton type="primary" @click="addenum">{{ $t('common.confirm') }}</NButton>-->
          <!--          </NSpace>-->
          <n-flex>
            <n-table >
              <thead>
              <tr>
                <th>库存值</th>
                <th>展示值</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(item, index) in enumData" :key="index">

                <td><n-input v-model:value="item.key" @change="updateenum"  placeholder=""  /></td>
                <td><n-input v-model:value="item.value"  @change="updateenum" placeholder="" /></td>
                <td>
                  <NButton type="error" @click="deleteenum(index)">
                    {{ "删除" }}
                  </NButton>
                </td>
              </tr>
              </tbody>
            </n-table>
            <NButton @click="addenum"  style="margin: 0 auto"  circle>
              <SvgIcon icon="ic:add" class="mr-1 text-5 text-[#009E64]" />
            </NButton>
          </n-flex>
        </n-form-item-gi>
      </n-grid>
      <n-grid  :cols="24" :x-gap="24">
        <n-form-item-gi :span="12"  label="制定采集策略" path="dataForm.strategy" >
          <n-select v-model:value="state.thing.dataForm.strategy" :options="selectData.strategy"  filterable tag placeholder="选择策略" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="采集公式" path="dataForm.collection" >
          <n-input v-model:value="state.thing.dataForm.collection"  type="textarea" placeholder="%{s}代表本值" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="协议选择" path="dataForm.protocol" >
          <n-select v-model:value="state.thing.dataForm.protocol"  :options="selectData.protocol"/>
        </n-form-item-gi>
      </n-grid>
      <n-grid v-if="state.thing.dataForm.protocol=='MODBUSRTU'"   :cols="24" :x-gap="24">
        <n-form-item-gi :span="12"  label="从机地址" >
          <n-input v-model:value="state.thing.dataSource.slaveid"    />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="寄存器功能码"  >
          <n-select v-model:value="state.thing.dataSource.operatetype" :options="selectData.operatetype"    @update:value="update_operatetype" placeholder="选择策略" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="寄存器起始地址" >
          <n-input v-model:value="state.thing.dataSource.address"    />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="寄存器个数" >
          <n-input v-model:value="state.thing.dataSource.registersnumber"    />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据格式" >
          <n-select v-model:value="state.thing.dataSource.originaltype" :options="selectData.originaltype"  @update:value="update_originaltype" placeholder="选择策略" />
        </n-form-item-gi>
      </n-grid>




      <!--      <n-grid  :cols="24" :x-gap="24">-->
      <!--        <n-form-item-gi :span="12" >-->
      <!--          <n-button attr-type="button" @click="handleValidateButtonClick">-->
      <!--            验证-->
      <!--          </n-button>-->
      <!--        </n-form-item-gi>-->
      <!--      </n-grid>-->
    </n-flex>
    </n-form>

    <NSpace :size="16" justify="end" style="margin-top:30px " >
      <NButton @click="handleClose">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
    </NSpace>
  </NModal>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
