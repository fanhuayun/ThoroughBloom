import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import {_RoleList, productList} from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';

export const useproduct = defineStore(SetupStoreId.Product, () => {

  const Productdata = reactive({
    data: {},
    selectList: []
  });
  const Roledata = reactive({
    data: {},
    selectList: []
  });

  /** Reset auth store */

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */


  async function getProduct() {
    let map: { [key: string]: string } = {};
    const list = [];
    const { data, error } = await productList({});

      // if (data.status==200){
          data.results.forEach((item: object) => {
              map[item.objectId] = item.name;
              list.push({ label: item.name, value: item.objectId });
          });
      // }
    Productdata.data = map;
    Productdata.selectList = list;
  }
  async function get_Role(){
    const List=[]
    const  {data,error}=await _RoleList({})
    if(data.status=200){
      data.results.forEach((item)=>{
        List.push(    {label: item.depname, value: item.objectId},)
      })

    }
    Roledata.selectList=List

  }


  return {

    Productdata,
    getProduct,
    Roledata,
    get_Role,

  };
});
