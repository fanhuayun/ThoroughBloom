import { transformRecordToOption } from '@/utils/common';

export const onlineStatusRecord = {
  'ONLINE': '在线',
  'OFFLINE': '离线'
};

export const WEATHER_PRODUCT = 'f54acb612d';
export const INSECT_PRODUCT = 'c209bc348c';
export const ENV_INSECT_PRODUCT = 'ab2d8bef2c'; // 自动虫情测报灯
export const onlineStatusOptions = transformRecordToOption(onlineStatusRecord);
