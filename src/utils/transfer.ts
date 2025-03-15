import dayjs from "dayjs";
export function autoRegex(params, keyMapping) {
  return Object.entries(keyMapping).reduce((acc, [paramKey, conditionKey]) => {
    if (params[paramKey] !== '' && params[paramKey] !== undefined && params[paramKey] !== null) {
      acc[conditionKey] = { $regex: params[paramKey] };
    }
    return acc;
  }, {});
}

export function processPestData(pestData: { [key: string]: { addtime: string; sum: number }[] }) {
  const lineTitles: string[] = Object.keys(pestData);
  let XItems: string[] = [];
  const YItems: number[][] = [];

  for (const pestName in pestData) {
    const pestEntries = pestData[pestName];
    const yData: number[] = [];

    pestEntries.forEach(entry => {
      XItems.push(dayjs(entry.addtime * 1000).format('YYYY-MM-DD'));
      yData.push(entry.sum);
    });

    YItems.push(yData);
  }

  // 去除重复的XItems值
  XItems = [...new Set(XItems)];
  return { lineTitles, XItems, YItems };
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// 转换对象为数组
export function convertObjectToArray(obj: any, customKeyName: string = 'key', customTitleName: string = 'title') {
  return Object.entries(obj).map(([key, value]) => ({
    [customKeyName]: key,
    [customTitleName]: value
  }));
};


export function filterObjectsByValuePrefix(arr: any) {
  return arr.filter((obj: any) => {
    const value = obj.value;
    // 检查value是否存在，并且是否以'a'开头，后面紧跟数字
    return typeof value === 'string' && /^[a][0-9]/.test(value);
  });
}

// 累加所有虫子数量
export function sumValues(data) {
  return data.reduce((acc, obj) => {
      Object.keys(obj).forEach(key => {
          if (obj[key] !== null && typeof obj[key] === 'number') {
              acc[key] = (acc[key] || 0) + obj[key];
          }
      });
      return acc;
  }, {});
}
