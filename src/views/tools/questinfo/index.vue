<script lang="ts" setup>
import {ref, reactive, toRaw, onMounted, nextTick} from 'vue';
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import { useRoute } from 'vue-router';
const route = useRoute();
import {getMaintenanceitem, sendDataToPumpCriterion} from "@/service/api";
import {localStg} from "@/utils/storage";
import qs from "qs";
const unitRef = reactive({
  unit: {
    "temperature": "℃",
    "flow": "m³/h",
    "pressure_out": "kPa",
    "rotate": "r/min",
    "pinlv": "Hz",
    "vol": "V",
    "current": "A",
    "factor": "",
    "power": "W",
    "water_power": "W",
    "dgshyangchneg": "m",
    "head": "m",
    "effect": "%",
    "conversion_power": "W",
    "conversion_head": "m",
    "conversion_flow": "m³/h"
  }
})

const state=reactive({
  echartLoading:false,
  chartsFlag:false,
  task: {},
  calcData: {},
})

const columns = ref([

  {
    "title": "介质温度(℃)",
    "key": "temperature",
    "width": 126
  },
  {
    "title": "流量(m³/h)",
    "key": "flow",
    "width": 140
  },
  {
    "title": "出口压力(kPa)",
    "key": "pressure_out",
    "width": 154
  },
  {
    "title": "转速(r/min)",
    "key": "rotate",
    "width": 154
  },
  {
    "title": "频率(Hz)",
    "key": "pinlv",
    "width": 112
  },
  {
    "title": "电压(V)",
    "key": "vol",
    "width": 98
  },
  {
    "title": "电流(A)",
    "key": "current",
    "width": 98
  },
  {
    "title": "功率因数",
    "key": "factor",
    "width": 84
  },
  {
    "title": "功率(W)",
    "key": "power",
    "width": 98
  },
  {
    "title": "水功率(W)",
    "key": "water_power",
    "width": 112
  },
  {
    "title": "动扬程(m)",
    "key": "dgshyangchneg",
    "width": 112
  },
  {
    "title": "扬程(m)",
    "key": "head",
    "width": 98
  },
  {
    "title": "机组效率(%)",
    "key": "effect",
    "width": 126
  },
  {
    "title": "换算功率(W)",
    "key": "conversion_power",
    "width": 126
  },
  {
    "title": "换算扬程(m)",
    "key": "conversion_head",
    "width": 126
  },
  {
    "title": "换算流量(m³/h)",
    "key": "conversion_flow",
    "width": 168
  }
]);

const echartsBeng = ref()
const chartsInstance = ref()
const tectReport = ref({
  productDate: (new Date()).valueOf(),
  benginTectDate: (new Date()).valueOf(),
  endTectDate: (new Date()).valueOf(),
  overtimeDate: (new Date()).valueOf(),
  samplingTime: (new Date()).valueOf(),
  issueTime: (new Date()).valueOf(),
  standard: '',
  testMethod: '',
  detectCompany: '',
  productName: '',
  specificationModels: '',
  inspectedCompany: '',
  experimentalNature: '',
  reportId: '',
  manufacturer: '',
  samples: '',
  ratedFlowNumber: '',
  ratedHead: '',
  ratedRotate: '',
  matchingPower: '',
  factorStand: '',
  ambientTemperature: '',
  temperature: '',
  inletArea: '',
  outerArea: '',
  pressure: '',
  maxPowerStandard: '',
  inletDiameter: '',
  outletDiameter: '',
  ratedEffect: '',
})
const pumpPerformanceSetting = ref({
  precisionLevel: '',
  flowUpperDeviation: '5',
  flowDeviation: '5',
  headUpperDeviation: '5',
  headDeviation: '5',
  powerUpperDeviation: '5',
  powerDeviation: '5',
  efficiencyUpperDeviation: '5',
  efficiencyDeviation: '5',
  factorDeviation: '5',
  factorUpperDeviation: '5',
  checkOption: {
    choice: [],
    point: null,
  },
  pumpFlowRange: ['0.8', '1.2']
})

async function determine(){
  // if(value === 'charts'){
    state.echartLoading = true


    const{data,error}=await sendDataToPumpCriterion({id:state.task.objectId, unit:unitRef.unit})
    if (data.status==200){
      state.calcData=data.data

      drawChart(data.data.cross_point)
      state.echartLoading = false
    }

  // }
}

const drawChart = (crossPoint: any) => {
  state.chartsFlag = false


  let source = toRaw(state.task.info.data)
  let deviation = pumpPerformanceSetting.value.pumpFlowRange ? parseFloat(pumpPerformanceSetting.value?.pumpFlowRange[1]) : 0
  let provisionsFlow = tectReport.value.ratedFlowNumber ? parseFloat(tectReport.value.ratedFlowNumber) : 0
  let chartSource = source.map(item => {
    return [item.flow, item.head, item.power, item.effect]
  })

  state.chartsFlag = true
  nextTick(() => {
    setCharts(chartSource, crossPoint)
  })

}
const setCharts = (source: any, crossPoint: any) => {
  // deviation: number
  let deviation = 0
  echarts.registerTransform(ecStat.transform.regression);
  let chartDom = echartsBeng.value
  chartsInstance.value = echarts.init(chartDom);
  chartsInstance.value.clear()
  let xAxiosValue = source.map((item: any) => item[0])

  // 分别提取三个不同的数据集
  const data1 = source.map((item: any) => [item[0], item[1]]);
  const data2 = source.map((item: any) => [item[0], item[2]]);
  const data3 = source.map((item: any) => [item[0], item[3]]);

// 对每个数据集进行回归
  const regression1 = ecStat.regression('polynomial', data1, 3);
  const regression2 = ecStat.regression('polynomial', data2, 3);
  const regression3 = ecStat.regression('polynomial', data3, 3);

  // 获取回归表达式
  const expression1 = regression1.expression
  const expression2 = regression2.expression
  const expression3 = regression3.expression

  // 计算扬程和效率的交点

  let polynomialExpression1 = expression1.replace('y = ', '');
  let polynomialExpression3 = expression3.replace('y = ', '');

  polynomialExpression1 = polynomialExpression1.replace(/(\d)x/g, '$1*x'); // 替换 x^n 和 x 为 x* 和 x*
  polynomialExpression1 = polynomialExpression1.replace(/(\d)x\^(\d)/g, '$1*x^$2'); // 确保 x^n 格式正确

  polynomialExpression3 = polynomialExpression3.replace(/(\d)x/g, '$1*x'); // 替换 x^n 和 x 为 x* 和 x*
  polynomialExpression3 = polynomialExpression3.replace(/(\d)x\^(\d)/g, '$1*x^$2'); // 确保 x^n 格式正确

  // // 定义多项式函数
  // const polynomial1_middle_y = mathjs.evaluate(polynomialExpression1, {x: provisionsFlow})
  // const polynomial3_middle_y = mathjs.evaluate(polynomialExpression3, {x: provisionsFlow})
  // const polynomial1_deviation_y = mathjs.evaluate(polynomialExpression1, {x: (provisionsFlow + deviation)}) // 加上偏差值
  // const m = tectReport.value.ratedHead / tectReport.value.ratedFlowNumber

  // 输出解
  let option = {
    title: {
      text: '泵性能曲线(Performance curve)',
      left: 'center'
    },
    grid: {
      left: 0,
      containLabel: true
    },
    legend: {
      orient: 'vertical',  // 垂直布局
      top: 60,
      right: 10,
      data: ['扬程', '功率', '效率'],
      itemWidth: 10,       // 图例标记的宽度
      itemHeight: 10,      // 图例标记的高度
      textStyle: {
        fontSize: 10,       // 图例文本的字体大小
      },
      borderColor: "#000000",
      borderWidth: 1,
    },
    xAxis: {
      name: `Q(${unitRef.unit['flow']})`, // x轴单位
      type: 'value',
      nameLocation: 'end',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
    },
    yAxis: [
      {
        name: 'E(%)',
        nameLocation: 'end',
        position: 'left',
        min: 0,
        max: 100,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      {
        name: `H(${unitRef.unit['head']})`,
        nameLocation: 'end',
        offset: 40,
        position: 'left',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },

        // max: function (value: any) {
        //   let dataMax = value.max;
        //   let interval = 5; // 设定跨度
        //   return Math.ceil(dataMax / interval) * interval; // 确保最大值是跨度的整数倍
        // },
        // interval: 5
      },
      {
        name: `P(${unitRef.unit['power']})`,
        nameLocation: 'end',
        offset: 80,
        position: 'left',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        // max: function (value: any) {
        //   let dataMax = value.max;
        //   return Math.ceil(dataMax / interval) * interval; // 确保最大值是跨度的整数倍
        // },
      },
      {
        name: `E(${unitRef.unit['effect']})`,
        nameLocation: 'end',
        position: 'left',
        min: 0,
        max: 100,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
      }
    ],
    series: [
      // 第一组散点及其回归线
      {
        name: '扬程',
        animation: false,
        type: 'scatter',
        data: data1,
        itemStyle: {
          color: "#1D1DE5",
        },
        yAxisIndex: 1,
        z: 10,
      },
      {
        name: '扬程曲线',
        type: 'line',
        smooth: true,
        animation: false,
        yAxisIndex: 1,
        data: regression1.points,
        itemStyle: {
          color: '#1D1DE5'
        },
        symbolSize: 0.1,
        encode: {x: 0, y: 1}
      },
      // 第二组散点及其回归线
      {
        name: '功率',
        type: 'scatter',
        animation: false,
        data: data2,
        yAxisIndex: 2,
        itemStyle: {
          color: "#D31212",
        },
        z: 10,
        symbol: 'rect', // 点的形状
      },
      {
        name: '功率曲线',
        type: 'line',
        smooth: true,
        animation: false,
        data: regression2.points,
        yAxisIndex: 2,
        itemStyle: {
          color: "#D31212",
        },
        symbolSize: 0.1,
        encode: {x: 0, y: 1},
      },
      // 第三组散点及其回归线
      {
        name: '效率',
        type: 'scatter',
        animation: false,
        data: data3,
        yAxisIndex: 0,
        itemStyle: {
          color: "#D26916",
        },
        symbolSize: 12,
        z: 10,
        symbol: 'path://M50,10 L61,35 L87,35 L66,50 L74,75 L50,60 L26,75 L34,50 L13,35 L39,35 Z',
      },
      {
        name: '效率曲线',
        animation: false,
        type: 'line',
        smooth: true,
        data: regression3.points,
        itemStyle: {
          color: "#F9A60D",
        },
        yAxisIndex: 0,
        symbolSize: 0.1,
        encode: {x: 0, y: 1}
      },
      {
        name: 'Vertical Lines',
        type: 'line',
        markLine: {
          symbol: 'none', // 隐藏标记
          label: {
            show: false // 不显示标签
          },
          data: [
            {
              xAxis: tectReport.value.ratedFlowNumber,
              lineStyle: {
                color: 'green',
                type: 'line',
                width: 2
              },
              emphasis: {
                disabled: true, // 禁用鼠标悬停效果
                lineStyle: {
                  color: 'green', // 保持颜色不变
                  type: 'line',
                  width: 2
                }
              }
            },
            {
              xAxis: crossPoint[0],
              lineStyle: {
                color: 'black',
                type: 'dashed',
                width: 2
              },
              emphasis: {
                disabled: true, // 禁用鼠标悬停效果
                lineStyle: {
                  color: 'black', // 保持颜色不变
                  type: 'dashed',
                  width: 2
                }
              }
            },
          ],
        }
      },
      {
        // 偏差线和扬程的交点与(0,0)组成的函数
        name: '偏差线和扬程的交线',
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 0,
        data: [
          [0, 0], // 第一个点
          crossPoint  // 第二个点 前面的值要加上偏差值
        ],
        lineStyle: {
          color: 'black' // 线条颜色
        },
      },
      {
        // 扬程偏差值
        name: '流量和扬程的交线',
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 0,
        z: 20, // 设置渲染顺序，数值越大，层级越高
        zlevel: 10, // 设置图层级别，数值越大，层级越高
        data: [
          [tectReport.value.ratedFlowNumber, tectReport.value.ratedHead * (1 + pumpPerformanceSetting.value.headUpperDeviation / 100.0)],
          [tectReport.value.ratedFlowNumber, tectReport.value.ratedHead * (1 - pumpPerformanceSetting.value.headDeviation / 100.0)]
        ],
        lineStyle: {
          color: '#1D1DE5' // 线条颜色
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: [16, 2], // 细长的矩形作为水平线段
          animation: false,    // 禁用动画
          data: [
            // 垂直线端点的水平线段
            {coord: [tectReport.value.ratedFlowNumber, tectReport.value.ratedHead * (1 + pumpPerformanceSetting.value.headUpperDeviation / 100.0)]}, // 左端点的垂直线段
            {coord: [tectReport.value.ratedFlowNumber, tectReport.value.ratedHead * (1 - pumpPerformanceSetting.value.headDeviation / 100.0)]}, // 右端点的垂直线段
          ],
          itemStyle: {
            color: '#1D1DE5', // 设置为与正常状态相同的颜色
          },
          emphasis: {
            scale: false, // 禁止缩放
            label: {
              show: false  // 禁用标签
            }
          }
        }
      },
      {
        // 流量偏差值
        name: '流量和扬程的交线',
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 0,
        data: [
          [tectReport.value.ratedFlowNumber * (1 + pumpPerformanceSetting.value.flowUpperDeviation / 100.0), tectReport.value.ratedHead],
          [tectReport.value.ratedFlowNumber * (1 - pumpPerformanceSetting.value.flowDeviation / 100.0), tectReport.value.ratedHead]
        ],
        lineStyle: {
          color: 'blue' // 线条颜色
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: [2, 16], // 细长的矩形作为水平线段
          animation: false,    // 禁用动画
          data: [
            // 垂直线端点的水平线段
            {coord: [tectReport.value.ratedFlowNumber * (1 + pumpPerformanceSetting.value.flowUpperDeviation / 100.0), tectReport.value.ratedHead]}, // 左端点的垂直线段
            {coord: [tectReport.value.ratedFlowNumber * (1 - pumpPerformanceSetting.value.flowDeviation / 100.0), tectReport.value.ratedHead]}, // 右端点的垂直线段
          ],
          itemStyle: {
            color: '#1D1DE5', // 设置为与正常状态相同的颜色
          },
          emphasis: {
            scale: false, // 禁止缩放
            label: {
              show: false  // 禁用标签
            }
          }
        }
      },
      pumpPerformanceSetting.value?.checkOption.choice.includes('power') ? {
        // 功率容差上半段
        name: '功率容差上',
        type: 'line',
        yAxisIndex: 2,
        symbolSize: 0,
        z: 20, // 设置渲染顺序，数值越大，层级越高
        zlevel: 10, // 设置图层级别，数值越大，层级越高
        data: [
          [tectReport.value.ratedFlowNumber, tectReport.value.matchingPower],
          [tectReport.value.ratedFlowNumber, tectReport.value.matchingPower * (1 + pumpPerformanceSetting.value.powerUpperDeviation / 100.0)]
        ],
        lineStyle: {
          color: '#D31212' // 线条颜色
        },
        markPoint: pumpPerformanceSetting.value.powerUpperDeviation !== '0' ? {
          symbol: 'rect',
          symbolSize: [16, 2], // 细长的矩形作为水平线段
          animation: false,    // 禁用动画
          data: [
            // 垂直线端点的水平线段
            {coord: [crossPoint[0], tectReport.value.matchingPower * (1 + pumpPerformanceSetting.value.powerUpperDeviation / 100.0)]}, // 左端点的垂直线段
          ],
          itemStyle: {
            color: '#D31212', // 设置为与正常状态相同的颜色
          },
          emphasis: {
            scale: false, // 禁止缩放
            label: {
              show: false  // 禁用标签
            }
          }
        } : null
      } : null,
      pumpPerformanceSetting.value?.checkOption.choice.includes('power') ? {
        // 功率容差下半段
        name: '功率容差下',
        type: 'line',
        yAxisIndex: 2,
        symbolSize: 0,
        z: 20, // 设置渲染顺序，数值越大，层级越高
        zlevel: 10, // 设置图层级别，数值越大，层级越高
        data: [
          [crossPoint[0], tectReport.value.matchingPower],
          [crossPoint[0], tectReport.value.matchingPower * (1 - pumpPerformanceSetting.value.powerDeviation / 100.0)]
        ],
        lineStyle: {
          color: '#D31212'
        },
        // markPoint: pumpPerformanceSetting.value.powerDeviation !== '0' ? {
        //   symbol: 'rect',
        //   symbolSize: [16, 2],
        //   animation: false,
        //   data: [
        //     // 垂直线端点的水平线段
        //     {coord: [tectReport.value.ratedFlowNumber, tectReport.value.matchingPower * (1 - pumpPerformanceSetting.value.powerDeviation / 100.0)]},
        //   ],
        //   itemStyle: {
        //     color: '#D31212',
        //   },
        //   emphasis: {
        //     scale: false,
        //     label: {
        //       show: false
        //     }
        //   }
        // } : null
      } : null,
      pumpPerformanceSetting.value?.checkOption.choice.includes('efficiency') ? {
        // 效率容差上半段
        name: '效率容差上',
        type: 'line',
        yAxisIndex: 0,
        symbolSize: 0,
        z: 20, // 设置渲染顺序，数值越大，层级越高
        zlevel: 10, // 设置图层级别，数值越大，层级越高
        data: [
          [crossPoint[0], tectReport.value.ratedEffect],
          [crossPoint[0], tectReport.value.ratedEffect * (1 + pumpPerformanceSetting.value.efficiencyUpperDeviation / 100.0)]
        ],
        lineStyle: {
          color: '#F9A60D' // 线条颜色
        },
        // markPoint: pumpPerformanceSetting.value.efficiencyUpperDeviation !== 0 ? {
        //   symbol: 'rect',
        //   symbolSize: [16, 2], // 细长的矩形作为水平线段
        //   animation: false,    // 禁用动画
        //   data: [
        //     // 垂直线端点的水平线段
        //     {coord: [tectReport.value.ratedFlowNumber, tectReport.value.ratedEffect * (1 + pumpPerformanceSetting.value.efficiencyUpperDeviation / 100.0)]}, // 左端点的垂直线段
        //   ],
        //   itemStyle: {
        //     color: '#F9A60D', // 设置为与正常状态相同的颜色
        //   },
        //   emphasis: {
        //     scale: false, // 禁止缩放
        //     label: {
        //       show: false  // 禁用标签
        //     }
        //   }
        // } : null
      } : null,
      pumpPerformanceSetting.value?.checkOption.choice.includes('efficiency') ? {
        // 效率容差下半段
        name: '效率容差下',
        type: 'line',
        yAxisIndex: 0,
        symbolSize: 0,
        z: 20, // 设置渲染顺序，数值越大，层级越高
        zlevel: 10, // 设置图层级别，数值越大，层级越高
        data: [
          [crossPoint[0], tectReport.value.ratedEffect],
          [crossPoint[0], tectReport.value.ratedEffect * (1 - pumpPerformanceSetting.value.efficiencyDeviation / 100.0)]
        ],
        lineStyle: {
          color: '#F9A60D'
        },
        markPoint: pumpPerformanceSetting.value.efficiencyDeviation !== 0 ? {
          symbol: 'rect',
          symbolSize: [16, 2],
          animation: false,
          data: [
            // 垂直线端点的水平线段
            {coord: [tectReport.value.ratedFlowNumber, tectReport.value.ratedEffect * (1 - pumpPerformanceSetting.value.efficiencyDeviation / 100.0)]},
          ],
          itemStyle: {
            color: '#F9A60D',
          },
          emphasis: {
            scale: false,
            label: {
              show: false
            }
          }
        } : null
      } : null
    ]
  };

  option && chartsInstance.value.setOption(option);
}



async function gettask(){
  const {data,error}=await getMaintenanceitem(route.query.taskId);
  if (!error){
    state.task=data
    tectReport.value = state.task.archives.datection
    pumpPerformanceSetting.value = state.task.archives.performance
    determine()
  }

}


onMounted(() => {
  gettask()
});
</script>

<template>

<!--  <NTabs animated type="line" trigger="click" :on-update:value="determine">-->
  <NTabs animated type="line" trigger="click" >
    <NTabPane display-directive="show" name="realtimeData" tab="记录数据">

      <NDataTable v-if="state.task.info"
                  size="small"
                  ref="dataTableStore"
                  :scroll-x="2800"
                  :min-height="300"

                  :columns="columns"
                  :data="state.task.info.data"/>
    </NTabPane>
    <NTabPane display-directive="show" name="charts" tab="图表">
      <n-spin size="medium" :show="state.echartLoading">
        <n-flex justify="center">
          <n-space vertical style="height: 650px; width: 1000px" align="center">
            <n-empty v-if="!state.chartsFlag" size="large" description="图表未生成" style="height: 400px"></n-empty>
            <div ref="echartsBeng" style="width: 900px;height: 500px" v-if="state.chartsFlag"></div>
            <n-grid :cols="24" style="width: 1000px">
              <n-gi :span="2" style="border: 1px solid">
                <n-space
                    align="center"
                    justify="center"
                    style="font-size: 24px;height: 100%;color: #80003C;">备注
                </n-space>
              </n-gi>
              <n-gi :span="11" style="border: 1px solid;border-right: 0;padding: 10px">
                <div class="remark-container">
                  电泵效率标准值：{{ state.calcData.rated_effect }};容差：{{ state.calcData.effect_deviation }}
                  功率因数标准值：{{ state.calcData.factor_standard }};容差：{{ state.calcData.factor_deviation }}
                </div>
                <div class="remark-container">
                  最大输入功率标准值({{ state.calcData.range_low }}~{{ state.calcData.range_high }}):
                  Qsp:{{ state.calcData.max_power_standard }}
                </div>
                <div class="remark-container">
                  规定扬程:{{ state.calcData.rated_head }},容差:{{ state.calcData.head_deviation }}，
                  规定流量：{{ state.calcData.rated_flow }}，容差：{{ state.calcData.flow_deviation }}
                </div>
              </n-gi>
              <n-gi :span="11" style="border: 1px solid;border-left: 0;padding: 10px">
                <div class="remark-container">
                  相交点电泵效率:{{ state.calcData.cross_effect }} {{ state.calcData.effect_check }}
                  功率因数：
                </div>
                <div class="remark-container">
                  最大输入功率({{ state.calcData.range_low }}~{{ state.calcData.range_high }}): Qsp:{{state.calcData.max_power}}；
                  {{ state.calcData.power_check }}；相交点输入功率：{{ state.calcData.cross_power }}
                </div>
                <div class="remark-container">
                  规定流量点扬程: {{ state.calcData.flow_point_head }}
                  规定扬程点流量: {{ state.calcData.head_point_flow }} 容差判定：{{ state.calcData.guarantee_check }}
                </div>
              </n-gi>
            </n-grid>
          </n-space>
        </n-flex>
      </n-spin>
    </NTabPane>
  </NTabs>
</template>

<style scoped></style>
