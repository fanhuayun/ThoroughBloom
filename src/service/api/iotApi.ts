import { request } from '../request';


import { autoRegex, convertObjectToArray, filterObjectsByValuePrefix, sumValues } from '@/utils/transfer';

export function queryChannel(params:object) {
  params.where=params.where||{}
  params.where=JSON.stringify(params.where )
  return request({
    url: `iotapi/classes/Channel`,
    method: 'get',
    params
  });
}

export function postChannel(data:object) {
  return request({
    url: `iotapi/classes/Channel`,
    method: 'post',
    data
  });
}
export function resource_types() {
  return request({
    url: `/iotapi/resource_types`,
    method: 'get'
  });
}
export function postChannelcontrol(id:string,status:string) {
  return request({
    url: `iotapi/control/channel?id=${id}&action=${status}`,
    method: 'post'
  });
}

export function putChannel(id:string,data:object) {

  return request({
    url: `iotapi/classes/Channel/${id}`,
    method: 'put',
    data
  });
}


export function deleteChannel(id:string) {
  return request({
    url: `iotapi/classes/Channel/${id}`,
    method: 'delete',
  });
}


export function productList(params:object) {
  params.where=params.where || {}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/Product',
    method: 'get',
    params
  });
}
export function getproduct(id:string) {
  return request({
    url: `iotapi/classes/Product/${id}`,
    method: 'get'
  });
}
export function ThingUnit() {
  return request({
    url: `/iotapi/dlinkjson?type=ThingUnit`,
    method: 'get'
  });
}
export function protocol() {
  return request({
    url: `/iotapi/protocol`,
    method: 'get'
  });
}
export function getpolling(id:string) {
  return request({
    url: `iotapi/polling/?objectId=${id}`,
    method: 'get'
  });
}export function postpolling(data:object) {
  return request({
    url: `iotapi/polling`,
    method: 'post',
    data
  });
}
export function Deleteproduct(id:string) {
  return request({
    url: `iotapi/classes/Product/${id}`,
    method: 'delete',
  });
}
export function postproduct(data:object) {
  return request({
    url: `iotapi/classes/Product`,
    method: 'post',
    data
  });
}
export function putproduct(id:string,data:object) {
  return request({
    url: `iotapi/classes/Product/${id}`,
    method: 'put',
    data
  });
}
export function postthing(data:object) {
  return request({
    url: `iotapi/thing`,
    method: 'post',
    data
  });
}
export function putthing(data:object) {
  return request({
    url: `iotapi/thing`,
    method: 'put',
    data
  });
}
export function deletething(data:object) {
  return request({
    url: `iotapi/thing`,
    method: 'delete',
    data
  });
}
export function getdevice(params:object) {
  params.where=params.where || {}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/Device',
    method: 'get',
    params
  });
}
export function getdeviceinfo(id:string) {

  return request({
      url: `iotapi/classes/Device/${id}`,
    method: 'get',

  });
}

export function postdevice(data:object) {
  return request({
    url: `iotapi/classes/Device`,
    method: 'post',
    data
  });
}

export function putdevice(id:string,data:object) {
  return request({
    url: `iotapi/classes/Device/${id}`,
    method: 'put',
    data
  });
}
export function deletedevice(id:string) {
  return request({
    url: `iotapi/classes/Device/${id}`,
    method: 'delete',
  });
}






export function devicecard(id:string) {
  return request({
    url: `/iotapi/devicecard/${id}`,
    method: 'get',
  });
}



export async function getdevicedata(params: any) {

  const searchParams = {
    include: true,

    order: '-createdat'
  };

  if (params.timeRange && params.timeRange.length > 0) {
    // 如果params中存在timeRange，则添加where条件
    searchParams.where = JSON.stringify([
      { createdat: { gte: params.timeRange[0] } },
      { createdat: { lte: params.timeRange[1] } }
    ]);

  }

  searchParams.skip=params.skip
  try {
    const response = await request({
      url: `/iotapi/device/${params.deviceId}`,
      method: 'get',
      params: searchParams,
      rawRes: true // 传递标志
    });
    // 处理返回结果
    const res = response.data;
    if (res.status === 200) {
      const columns = convertObjectToArray(res.data.columns);
      if (params.onDone) {
        params.onDone(columns);
      }
      return response.data;
    }
    console.error('请求失败，状态码:', response.status);
    return null;
  } catch (error) {
    console.error('请求发生错误:', error);
    return null;
  }
}







export function geterorrqusetion(params:object) {

  return request({
    url: 'iotapi/erorr_questions',
    method: 'get',
    params
  });
}
export function topoList(params:object) {
  params.where=params.where||{}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/View',
    method: 'get',
    params
  });
}


export function DeleteTopo(id:string) {
  return request({
    url: `/iotapi/classes/View/${id}`,
    method: 'delete',
  });
}


export  function PostTopo(data?:object) {
  return request({
    url: '/iotapi/classes/View',
    method: 'post',
    data
  });
}

export  function Batch(data?:object) {
  return request({
    url: '/iotapi/batch',
    method: 'post',
    data
  });
}


export function getDict(params:object) {
  params.where=params.where || {}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/Dict',
    method: 'get',
    params
  });
}
export function getDictinfo(id:string) {

  return request({
    url: `iotapi/classes/Dict/${id}`,
    method: 'get',

  });
}

export function postDict(data:object) {
  return request({
    url: `iotapi/classes/Dict`,
    method: 'post',
    data
  });
}

export function putDict(id:string,data:object) {
  return request({
    url: `iotapi/classes/Dict/${id}`,
    method: 'put',
    data
  });
}
export function deleteDict(id:string) {
  return request({
    url: `iotapi/classes/Dict/${id}`,
    method: 'delete',
  });
}



export function postrole(data:object) {
  return request({
    url: `iotapi/role`,
    method: 'post',
    data
  });
}


export function _RoleList(params:object) {
  params.where=params.where||{}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/_Role',
    method: 'get',
    params
  });
}
export function _Roledelete(id:string) {

  return request({
    url: `iotapi/classes/_Role/${id}`,
    method: 'delete'
  });
}


export function GetrouteList() {
  return request({
    url: 'iotapi/routes',
    method: 'get',
  });
}
export function Get_route(params:object) {
  return request({
    url: 'iotapi/route',
    method: 'get',
    params
  });
}
export function Get_mark(params:object) {
  return request({
    url: 'iotapi/mark',
    method: 'get',
    params
  });
}
export function put_route(data:object) {
  return request({
    url: 'iotapi/route',
    method: 'put',
    data
  });
}



export function fetchGetUserList(params:object) {
  params.where=params.where||{}
  params.where=JSON.stringify(params.where )
  const userfilter= {where:{}}
  const params1= params

  // if (params.userfilter){
  //
  //   console.log(params.userfilter)
  //   userfilter.where=params.userfilter.where
  //   userfilter.where=JSON.stringify(userfilter.where )
  //
  //   delete params1.userfilter
  // }


  return request({
    url: 'iotapi/roleuser',
    method: 'get',
    params
  });
}
export function Putroleuser(data?:object) {

  return request({
    url: 'iotapi/roleuser',
    method: 'put',
    data
  });
}
export function PetUserList(id:string,data?:object) {

  return request({
    url: `/iotapi/classes/_User/${id}`,
    method: 'put',
    data
  });
}
export function DeleteUser(data?:object) {

  return request({
    url: `/iotapi/user`,
    method: 'delete',
    data
  });
}
export function PostUser(data?:object) {
  return request({
    url: `/iotapi/user`,
    method: 'post',
    data
  });
}


export function PostUsers(data?:object) {
  return request({
    url: `/iotapi/lead_users`,
    method: 'post',
    data
  });
}
export function PutUsers(data?:object) {
  return request({
    url: `/iotapi/lead_users`,
    method: 'put',
    data
  });
}


export function GetPermissionList() {
    return request({
        url: 'iotapi/classes/Permission',
        method: 'get',
    });
}

export function put_role(data:object) {
    return request({
        url: 'iotapi/role',
        method: 'put',
        data
    });
}





export function getclassesroute(params:object) {
    params.where=params.where||{}
    params.where=JSON.stringify(params.where )
    return request({
        url: 'iotapi/classes/route',
        method: 'get',
        params
    });
}
export function postroute(data:object) {
    return request({
        url: 'iotapi/classes/route',
        method: 'post',
        data
    });
}
export function putroute(id:string,data:object) {
    return request({
        url: `iotapi/classes/route/${id}`,
        method: 'put',
        data
    });
}
export function deleteroute(id:string) {
    return request({
        url: `iotapi/classes/route/${id}`,
        method: 'delete'
    });
}


export  function put_project(data?:object) {
  return request({
    url: '/iotapi/project',
    method: 'put',
    data
  });
}


export function putuser(id:string,data:object) {
  return request({
    url: `iotapi/classes/_User/${id}`,
    method: 'put',
    data
  });
}export function getuserinfo(id:string) {
  return request({
    url: `iotapi/classes/_User/${id}`,
    method: 'get',
  });
}
