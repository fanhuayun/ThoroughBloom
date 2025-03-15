import { request } from '../request';





export function getMaintenance(params:object) {
  params.where=params.where || {}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/Maintenance',
    method: 'get',
    params
  });
}
export function getQuestion(params:object) {
  params.where=params.where || {}
  params.where=JSON.stringify(params.where )
  return request({
    url: 'iotapi/classes/Question',
    method: 'get',
    params
  });
}
export function getMaintenanceitem(id:string) {

  return request({
    url: `iotapi/classes/Maintenance/${id}`,
    method: 'get'
  });
}

export function postMaintenance(data:object) {
  return request({
    url: `iotapi/classes/Maintenance`,
    method: 'post',
    data
  });
}

export function putMaintenance(id:string,data:object) {
  return request({
    url: `iotapi/classes/Maintenance/${id}`,
    method: 'put',
    data
  });
}
export function deleteMaintenance(id:string) {
  return request({
    url: `iotapi/classes/Maintenance/${id}`,
    method: 'delete',
  });
}
export function deletequestion(id:string) {
  return request({
    url: `iotapi/classes/Question/${id}`,
    method: 'delete',
  });
}


export function sendDataToPumpCriterion(data:object) {
  return request({
    url: `iotapi/pump_criterion`,
    method: 'post',
    data
  });
}










