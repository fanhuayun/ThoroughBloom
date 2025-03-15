<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { localStg } from '@/utils/storage';
import { OracleJobRules, cropNaiveForm } from '@/hooks/common/form';
import { useMessage } from 'naive-ui'
const message = useMessage()
import {
  postMaintenance,
  postthing, putMaintenance,
  putthing

} from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'NoticeOperateDrawer'
});


const selectData=reactive(
    {
      tectStandareds: [
        {label: 'CJ-T 472-2015', value: 'CJ-T 472-2015',},
        {label: 'GB-T 2816-2014', value: 'GB-T 2816-2014',},
        {label: 'GB-T 3216-2016', value: 'GB-T 3216-2016'},
        {label: 'GB-T 12785-2014', value: 'GB-T 12785-2014'},
        {label: 'GB-T 24674-2009', value: 'GB-T 24674-2009'},
        {label: 'GB-T 25409-2010', value: 'GB-T 25409-2010'},
        {label: 'GB-T 26117-2010', value: 'GB-T 26117-2010'},
      ],
      testMethods: [
        {label: '批产(实泵)试验', value: '批产(实泵)试验'},
        {label: '委托校验', value: '委托校验',}
      ],
      point: [
        {label: '相交点', value: 'crossPoint'},
        {label: '保障点', value: 'guaranteePoint',}
      ]
    }
)

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.OracleJob | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = cropNaiveForm();
const { defaultRequiredRule } = OracleJobRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增任务',
    edit: '配置'
  };
  return titles[props.operateType];
});

import type { FormInst, FormItemRule, FormRules } from 'naive-ui'

type Model = Pick<
    'objectId' | 'titile' | 'content' | 'PushHierarchy' | 'startToFinish' | 'status' | 'punlisher'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    objectId: '',
    name:null,
    archives:{
      "datection": {
        "diffe": null, //压变高度
        "samples": null, //样品数量
        "pressure": null, //大气压力
        "standard": null, //执行标准
        "inletArea": null, //进口面积
        "issueTime": null, //签发日期
        "outerArea": null, //出口面积
        "ratedHead": null, //额定扬程
        "testMethod": null,  //试验方式
        "endTectDate": null, //截止日期
        "factorStand": null, //功率因数标准值
        "productDate": null, //生产日期时间
        "productName": null,  //产品名称
        "ratedEffect": null, //机组效率
        "ratedRotate": 2750, //额定转速
        "temperature": null, //介质温度
        "manufacturer": null, //制造单位
        "overtimeDate": null,//样品到期时间
        "samplingTime": null,//采样样时间
        "detectCompany": null, //检测公司
        "inletDiameter": null, //进口直径
        "matchingPower": null, //配套功率
        "benginTectDate": null, //测试日期
        "outletDiameter": null, //出口管径
        "ratedFlowNumber": null, //额定流量
        "inspectedCompany": null, //受检单位
        "maxPowerStandard": null, //最大输入功率标准值
        "ambientTemperature": null, //环境温度
        "experimentalNature": null, //试验性质
        "specificationModels": null //型号规格
      },
      "performance": {
        "checkOption": {
          "choice": [],
          "point": null //guaranteePoint保障点  crossPoint相交点
        },
        "efficiencyDeviation": null,//效率：下偏差(-%)
        "efficiencyUpperDeviation": null,//效率：上偏差(+%)
        "factorDeviation": null,//功率因数：下偏差(-%)
        "factorUpperDeviation": null,//功率因数：上偏差(+%)
        "flowDeviation": null,//流量：下偏差(-%)
        "flowUpperDeviation": null,//流量：上偏差(+%)
        "headDeviation": null,//扬程：下偏差(-%)
        "headUpperDeviation": null,//扬程：上偏差(+%)
        "powerDeviation": null,//功率：下偏差(-%)
        "powerUpperDeviation": null,//功率：上偏差(+%)
        "precisionLevel": null,//验收精度等级
        "pumpFlowRange": [
          null,
          null
        ]//泵流量范围    (泵在规定流量范围内的最大功率不得大于额定功率)
      }
    },
    status:0
  };
}

type RuleKey = Extract<keyof Model, 'titile' | 'content' | 'PushHierarchy' | 'startToFinish' | 'status' >;

const rules= {
  name: {
    required: true,
    message: '请输入名称',
    trigger: ['input', 'blur', 'submit']
  },
  archives:{
    "datection": {
      "diffe": {
        required: true,
        message: '请输入压变高度',
        trigger: ['input', 'blur', 'submit']
      }, //压变高度
      "samples": {
        required: true,
        message: '请输入样品',
        trigger: ['input', 'blur', 'submit']
      }, //样品
      "pressure": {
        required: true,
        message: '请输入大气压力',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //大气压力
      "standard": {
        required: true,
        message: '请选择执行标准',
        trigger: ['blur', 'change']
      }, //执行标准
      "inletArea": {
        required: true,
        message: '请输入进口面积',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //进口面积

      "outerArea": {
        required: true,
        message: '请输入出口面积',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //出口面积
      "ratedHead": {
        required: true,
        message: '请输入额定扬程',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //额定扬程
      "testMethod": {
        required: true,
        message: '请输入试验方式',
        trigger: ['blur', 'change']
      },  //试验方式
      "factorStand": {
        required: true,
        message: '请输入功率因数标准值',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //功率因数标准值

      "productName": {
        required: true,
        message: '请输入产品名称',
        trigger: ['input', 'blur', 'submit']
      },  //产品名称
      "ratedEffect": {
        required: true,
        message: '请输入机组效率',
        trigger: ['input', 'blur', 'submit']
      }, //机组效率
      "ratedRotate": {
        required: true,
        message: '请输入额定转速',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //额定转速
      "temperature": {
        required: true,
        message: '请输入介质温度',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //介质温度
      "manufacturer": {
        required: true,
        message: '请输入制造商',
        trigger: ['input', 'blur', 'submit']
      }, //制造商

      "detectCompany": {
        required: true,
        message: '请输入检测公司',
        trigger: ['input', 'blur', 'submit']
      }, //检测公司
      "inletDiameter": {
        required: true,
        message: '请输入进口直径',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //进口直径
      "matchingPower": {
        required: true,
        message: '请输入配套功率',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //配套功率

      "outletDiameter": {
        required: true,
        message: '请输入出口管径',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //出口管径
      "ratedFlowNumber": {
        required: true,
        message: '请输入额定流量',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //额定流量
      "inspectedCompany": {
        required: true,
        message: '请输入受检单位',
        trigger: ['input', 'blur', 'submit']
      }, //受检单位
      "maxPowerStandard": {
        required: true,
        message: '请输入最大输入功率标准值',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //最大输入功率标准值
      "ambientTemperature": {
        required: true,
        message: '请输入环境温度',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      }, //环境温度
      "experimentalNature": {
        required: true,
        message: '请输入试验性质',
        trigger: ['input', 'blur', 'submit']
      }, //试验性质
      "specificationModels": {
        required: true,
        message: '请输入型号规格',
        trigger: ['input', 'blur', 'submit']
      } //型号规格
    },
    "performance": {

      "efficiencyDeviation": {
        required: true,
        message: '请输入效率：下偏差(-%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//效率：下偏差(-%)
      "efficiencyUpperDeviation": {
        required: true,
        message: '请输入效率：上偏差(+%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//效率：上偏差(+%)
      "factorDeviation": {
        required: true,
        message: '请输入功率因数：下偏差(-%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//功率因数：下偏差(-%)
      "factorUpperDeviation": {
        required: true,
        message: '请输入功率因数：上偏差(+%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//功率因数：上偏差(+%)
      "flowDeviation": {
        required: true,
        message: '请输入流量：下偏差(-%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//流量：下偏差(-%)
      "flowUpperDeviation": {
        required: true,
        message: '请输入流量：上偏差(+%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//流量：上偏差(+%)
      "headDeviation": {
        required: true,
        message: '请输入扬程：下偏差(-%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//扬程：下偏差(-%)
      "headUpperDeviation": {
        required: true,
        message: '请输入扬程：上偏差(+%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//扬程：上偏差(+%)
      "powerDeviation": {
        required: true,
        message: '请输入功率：下偏差(-%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//功率：下偏差(-%)
      "powerUpperDeviation": {
        required: true,
        message: '请输入功率：上偏差(+%)',
        trigger: ['input', 'blur', 'submit'],
        validator(_rule: FormItemRule, value: number) {
          return typeof value === 'number'
        }
      },//功率：上偏差(+%)
      "precisionLevel": {
        required: true,
        message: '请输入验收精度等级',
        trigger: ['input', 'blur', 'submit']
      },//验收精度等级

    }
  },
};
const status= ref(false)
function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
    status.value=true
  }
}



function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {

}

const statusOptions = [
  {label: '待发布', value: "0" },
  {label: '进行中', value: "1" },
  {label: '已结束', value: "2" },
]

async function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {

      const json=model
      const {objectId}=model
      delete json.objectId
      if (status.value){
        const {data,error}=putMaintenance(objectId,json)
        if (data.status==200){
          message.success('修改成功');
          closeDrawer();
          emit('submitted')
        }
      }else {
         const {data,error}=await postMaintenance(json)
          if (data.status==200){
            message.success('新增成功');
            closeDrawer();
            emit('submitted')
          }
      }

    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});

function  handleInputChange(value:any){
  model.archives.performance.pumpFlowRange=value
}

</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="720">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <n-grid  :cols="24" :x-gap="24">
          <n-form-item-gi :span="12" label="任务编号" path="name">
            <n-input v-model:value="model.name" :disabled="status"  />
          </n-form-item-gi>
        </n-grid>
        <h1 style="color: red;margin: 10px;font-size: 18px;text-align: center" >检测产品详情</h1>
        <n-grid  :cols="24" :x-gap="24" >
          <n-form-item-gi :span="12" label="生产日期">
            <n-date-picker v-model:value="model.archives.datection.productDate" type="date" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="样品到期时间">
            <n-date-picker v-model:value="model.archives.datection.overtimeDate" type="date" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="抽样时间">
            <n-date-picker v-model:value="model.archives.datection.samplingTime" type="date" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="签发日期">
            <n-date-picker v-model:value="model.archives.datection.issueTime" type="date" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="检测公司" path="archives.datection.detectCompany">
            <n-input v-model:value="model.archives.datection.detectCompany"   />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="产品名称" path="archives.datection.productName">
            <n-input v-model:value="model.archives.datection.productName"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="型号规格" path="archives.datection.specificationModels">
            <n-input v-model:value="model.archives.datection.specificationModels"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="受检单位" path="archives.datection.inspectedCompany">
            <n-input v-model:value="model.archives.datection.inspectedCompany"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="试验性质" path="archives.datection.experimentalNature">
            <n-input v-model:value="model.archives.datection.experimentalNature"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="制造单位" path="archives.datection.manufacturer">
            <n-input v-model:value="model.archives.datection.manufacturer"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="样品数量" path="archives.datection.samples">
            <n-input v-model:value="model.archives.datection.samples"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="执行标准" path="archives.datection.standard">
            <n-select v-model:value="model.archives.datection.standard" :options="selectData.tectStandareds" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="试验方式" path="archives.datection.testMethod">
            <n-select v-model:value="model.archives.datection.testMethod" :options="selectData.testMethods" />
          </n-form-item-gi>
        </n-grid>
        <h1 style="color: red;margin: 10px;font-size: 18px;text-align: center" >技术标准</h1>
        <n-grid>
          <n-form-item-gi :span="12" label="室温" path="archives.datection.ambientTemperature">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.ambientTemperature"  >
              <template #suffix>
                ℃
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="介质温度" path="archives.datection.temperature">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.temperature"  >
              <template #suffix>
                ℃
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="额定流量" path="archives.datection.ratedFlowNumber">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.ratedFlowNumber"  >
              <template #suffix>
                m³/h
              </template>
            </n-input-number>>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="额定扬程" path="archives.datection.ratedHead">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.ratedHead"  >
              <template #suffix>
                m
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="额定转速" path="archives.datection.ratedRotate">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.ratedRotate" disabled="true"  >
              <template #suffix>
                r/min
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="进口面积" path="archives.datection.inletArea">
            <n-input-number   :show-button="false" v-model:value="model.archives.datection.inletArea"  >
              <template #suffix>
                mm²
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="出口面积" path="archives.datection.outerArea">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.outerArea"  >
              <template #suffix>
                mm²
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="配套功率" path="archives.datection.matchingPower">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.matchingPower"  >
              <template #suffix>
                W
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="机组效率" path="archives.datection.ratedEffect">
            <n-input-number   :show-button="false" v-model:value="model.archives.datection.ratedEffect"  >
              <template #suffix>
                %
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="大气压力" path="archives.datection.pressure">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.pressure"  >
              <template #suffix>
                kPa
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="功率因数标准值" path="archives.datection.factorStand">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.factorStand"  />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="进口直径" path="archives.datection.inletDiameter">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.inletDiameter"  >
              <template #suffix>
                mm
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="出口管径" path="archives.datection.outletDiameter">
            <n-input-number   :show-button="false" v-model:value="model.archives.datection.outletDiameter"  >
              <template #suffix>
                mm
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="最大输入功率标准值" path="archives.datection.maxPowerStandard">
            <n-input-number :show-button="false" v-model:value="model.archives.datection.maxPowerStandard"  >
              <template #suffix>
                W
              </template>
            </n-input-number>
          </n-form-item-gi>
        </n-grid>
        <h1 style="color: red;margin: 10px;font-size: 18px;text-align: center" >泵性能</h1>
        <n-grid>

          <n-form-item-gi :span="12" label="验收精度等级" path="archives.performance.precisionLevel">
            <n-input :show-button="false" v-model:value="model.archives.performance.precisionLevel"  >
            </n-input>
          </n-form-item-gi>
          <n-form-item-gi :span="12" >
                (默认为泵输入功率不大于10KW)
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="扬程：上偏差" path="archives.performance.headUpperDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.headUpperDeviation"  >
              <template #suffix>
                (+%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="扬程：下偏差" path="archives.performance.headDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.headDeviation"  >
              <template #suffix>
                (-%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="流量：上偏差" path="archives.performance.flowUpperDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.flowUpperDeviation"  >
              <template #suffix>
                (+%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="流量：下偏差" path="archives.performance.flowDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.flowDeviation"  >
              <template #suffix>
                (-%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="功率：上偏差" path="archives.performance.powerUpperDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.powerUpperDeviation"  >
              <template #suffix>
                (+%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="功率：下偏差" path="archives.performance.powerDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.powerDeviation"  >
              <template #suffix>
                (-%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="效率：上偏差" path="archives.performance.efficiencyUpperDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.efficiencyUpperDeviation"  >
              <template #suffix>
                (+%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="效率：下偏差" path="archives.performance.efficiencyDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.efficiencyDeviation"  >
              <template #suffix>
                (-%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="功率因数：上偏差" path="archives.performance.factorUpperDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.factorUpperDeviation"  >
              <template #suffix>
                (+%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="功率因数：下偏差" path="archives.performance.factorDeviation">
            <n-input-number :show-button="false" v-model:value="model.archives.performance.factorDeviation"  >
              <template #suffix>
                (-%)
              </template>
            </n-input-number>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="判定选择项" >
            <n-checkbox-group v-model:value="model.archives.performance.checkOption.choice">
              <n-space item-style="display: flex;">
                <n-checkbox value="power" label="功率" />
                <n-checkbox value="efficiency" label="效率" />
              </n-space>
            </n-checkbox-group>
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="判定选择项" >
            <n-select v-model:value="model.archives.performance.checkOption.point" :options="selectData.point" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="泵流量范围" >
            <n-input
                pair
                separator="~"
                clearable
                @change="handleInputChange"
            />
          </n-form-item-gi>

        </n-grid>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleValidateButtonClick">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
