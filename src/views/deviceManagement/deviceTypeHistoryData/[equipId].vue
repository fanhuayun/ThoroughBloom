<!-- eslint-disable no-console -->
<script setup lang="tsx">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import {deletething, getproduct, putChannel, putproduct, queryChannel} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { WEATHER_PRODUCT } from '@/constants/device';
import { useTable, useTableOperate } from '@/hooks/custom/table';
import { localStg } from '@/utils/storage';
import Acquisition from './modules/acquisition.vue'
import Thing from './modules/thing.vue'
import Channel from './modules/channel.vue'

const appStore = useAppStore();
const route = useRoute();
const state = reactive({
    product:{},
    save:[],
    other:[]
});
const map=reactive({
    data:{
        '1':'采集通道',
        '2':'资源通道',
    }
})


const acquisition=reactive({
      productId: '',
      showModal: false
    })

const channel=reactive({
      productId: '',
      model: '',
      showModal: false
    })


const thing=reactive({
      item: {},
      model: '',
      product: '',
      showModal: false
    })

onMounted(() => {
  console.log(route)
  const equipId = route.params.equipId;
  prodductinfo(equipId)
  getother(equipId)
  getsave(equipId)
  // state.baseInfo.deviceId = equipId;
});

async function prodductinfo(id){
  const {data,error} =await getproduct(id)
  state.product=data
}



function acquisition_interval() {
  acquisition.productId = state.product.objectId; // 将接收到的 id 存储在 currentId 变量中
  acquisition.showModal = true; // 显示弹窗
}

function acquisitionModalClose(){
  acquisition.productId = '';
  acquisition.showModal = false
}
function otherModalClose(){
  channel.productId = '';
  channel.model = '';
  channel.showModal = false
}
function addother(){
  channel.productId = state.product.objectId;
  channel.model = 'other';
  channel.showModal = true
}
function addsave(){
  channel.productId = state.product.objectId;
  channel.model = 'save';
  channel.showModal = true
}

function thingModalClose(){
  thing.item= {};
  thing.model= '';
  thing.product= '';
  thing.showModal = false
}
function update() {
  const equipId=state.product.objectId
  prodductinfo(equipId)
}
function updateother(model:string) {
  const equipId=state.product.objectId
  if (model=='other'){
    getother(equipId)
  }else if (model=='save'){
    getsave(equipId)
  }
}



async function deletething_model(item:object) {
    const productid=state.product.objectId
  const {data,error} =await deletething({item,productid})
  if (data.status==200){
    update()
  }
}

function putthing(item:object) {
  thing.item = item; // 将接收到的 id 存储在 currentId 变量中
  thing.model = 'edit'; // 将接收到的 id 存储在 currentId 变量中
  thing.product = state.product.objectId; // 将接收到的 id 存储在 currentId 变量中
  thing.showModal = true; // 显示弹窗
}
function addthing() {
   // 将接收到的 id 存储在 currentId 变量中
  thing.model = 'add'; // 将接收到的 id 存储在 currentId 变量中
  thing.product = state.product.objectId; // 将接收到的 id 存储在 currentId 变量中
  thing.showModal = true; // 显示弹窗
}

async function updateproduct(){
  const data= { thing:state.product.thing}
  await putproduct(state.product.objectId,data)
}

async function getother(equipId:string){
    const params = {
        count: 'objectId',
        order: '-createdAt',
        where: {'product':{"__type":"Pointer","className":"Product","objectId":equipId} ,"type":{"$in":["1","3"]}},
    }
    const {data,error} = await queryChannel(params)
    if (data.status==200){
         state.other=data.results
    }
}
async function getsave(equipId:string){
    const params = {
        count: 'objectId',
        order: '-createdAt',
        where: {'product':{"__type":"Pointer","className":"Product","objectId":equipId} ,"type":{"$in":["2"]}},
    }
    const {data,error} = await queryChannel(params)
    if (data.status==200){
         state.save=data.results
    }
}


async function deleteother(channleId:string) {

  const data1={'product':
        {'objects':[{"__type": "Pointer",
            "className": "Product",
            "objectId": state.product.objectId
          }],
          '__op':'RemoveRelation'}}
  const {data,error}=await putChannel(channleId,data1)
  if (data.status==200){
    updateother("other");
  }
}
async function deletesave(channleId:string) {

  const data1={'product':
        {'objects':[{"__type": "Pointer",
            "className": "Product",
            "objectId": state.product.objectId
          }],
          '__op':'RemoveRelation'}}
  const {data,error}=await putChannel(channleId,data1)
  if (data.status==200){
    updateother('save');
  }
}


</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <n-card :title="state.product.name" style="margin-bottom: 16px">
      <n-tabs type="line" animated   >
        <n-tab-pane name="info" tab="类型信息">
          <n-card title="mqtt信息" style="margin-bottom: 16px">
            <n-table :bordered="false" :single-line="false">
              <thead>
              <tr>
                <th>username</th>
                <th>password</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{state.product.objectId}}</td>
                <td>{{state.product.productSecret}}</td>
              </tr>
              </tbody>
            </n-table>
          </n-card>

        </n-tab-pane>
        <n-tab-pane name="thing" tab="物模型配置">
          <NSpace :size="16" justify="end" >
            <NButton  @click="acquisition_interval" >采集间隔</NButton>
            <NButton type="primary" @click="addthing()" >新增物模型</NButton>
          </NSpace>
          <n-scrollbar style="max-height: 700px">
          <n-table >
            <thead>
            <tr>
              <th>类型</th>
              <th>策略</th>
              <th>协议</th>
              <th>标识符</th>
              <th>单位</th>
              <th>功能名称</th>
              <th>是否展示</th>
              <th>是否存储</th>
              <th>数据类型</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in state.product.thing.properties">
              <td>{{item.devicetype}}</td>
              <td>{{item.dataForm.strategy}}</td>
              <td>{{item.dataForm.protocol}}</td>
              <td>{{item.identifier}}</td>
              <td>{{item.dataType.unit}}</td>
              <td>{{item.name}}</td>
              <td>
                <n-switch v-if="item" v-model:value="item.isshow"  @change="updateproduct()"/>
              </td>
              <td>
                <n-switch v-if="item" v-model:value="item.isstorage"  @change="updateproduct()"/>
              </td>
              <td>{{item.dataType.type}}</td>
              <td>
                  <NSpace :size="16" >
                      <NButton type="primary" @click="putthing(item)" >编辑物模型</NButton>
                      <NButton type="error" @click="deletething_model(item)">
                          {{ "删除" }}
                      </NButton>
                  </NSpace>
              </td>
            </tr>
            </tbody>
          </n-table>
          </n-scrollbar>

        </n-tab-pane>
        <n-tab-pane name="other" tab="物接入">
            <NSpace :size="16" justify="end" >
                <NButton type="primary" @click="addother()" >选择通道</NButton>
            </NSpace>
            <n-scrollbar style="max-height: 700px">
                <n-table >
                    <thead>
                    <tr>
                        <th>通道编号</th>
                        <th>通道名称</th>
                        <th>通道类型</th>
                        <th>服务类型</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in state.other">
                        <td>{{item.objectId}}</td>
                        <td>{{item.name}}</td>
                        <td>{{map.data[item.type]}}</td>
                        <td>{{item.cType}}</td>
                        <td>
                            <NSpace :size="16" >
                                <NButton type="error" @click="deleteother(item.objectId)">
                                    {{ "删除" }}
                                </NButton>
                            </NSpace>
                        </td>
                    </tr>
                    </tbody>
                </n-table>
            </n-scrollbar>

        </n-tab-pane>
        <n-tab-pane name="save" tab="物存储">
            <NSpace :size="16" justify="end" >
                <NButton type="primary" @click="addsave()" >选择通道</NButton>
            </NSpace>
            <n-scrollbar style="max-height: 700px">
                <n-table >
                    <thead>
                    <tr>
                        <th>通道编号</th>
                        <th>通道名称</th>
                        <th>通道类型</th>
                        <th>服务类型</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in state.save">
                        <td>{{item.objectId}}</td>
                        <td>{{item.name}}</td>
                        <td>{{map.data[item.type]}}</td>
                        <td>{{item.cType}}</td>
                        <td>
                            <NSpace :size="16" >
                                <NButton type="error" @click="deletesave(item.objectId)">
                                    {{ "删除" }}
                                </NButton>
                            </NSpace>
                        </td>
                    </tr>
                    </tbody>
                </n-table>
            </n-scrollbar>

        </n-tab-pane>
      </n-tabs>
    </n-card>
  <Acquisition :visible="acquisition.showModal" :productId="acquisition.productId" @update:visible="acquisitionModalClose"> </Acquisition>
  <Channel :visible="channel.showModal" :model="channel.model" :productId="channel.productId" @update:visible="otherModalClose"  @update="updateother"> </Channel>
  <Thing :visible="thing.showModal" :product="thing.product" :model="thing.model" :thing="thing.item" @update:visible="thingModalClose" @update="update"  > </Thing>
  </div>

</template>

<style scoped></style>
