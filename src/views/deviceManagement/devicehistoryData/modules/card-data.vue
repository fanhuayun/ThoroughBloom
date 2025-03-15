<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import {devicecard} from '@/service/api';
import { $t } from '@/locales';
import {defineProps} from "vue/dist/vue";
import bus from '@/utils/bus'

defineOptions({
  name: 'CardData'
});
let props = defineProps({
  deviceId: String, // 假设这是你要传递的地图的 id
});

const colorList = [
  {
    start: '#DBF0E4',
    end: '#ffb347'
  },
  {
    start: '#DBF0E4',
    end: '#50c878'
  },
  {
    start: '#F2D9D9',
    end: '#31d3a7'
  },
  {
    start: '#DBF0E4',
    end: '#4346f2'
  },
  {
    start: '#DBF0E4',
    end: '#6b54f2'
  },
  {
    start: '#F2D9D9',
    end: '#c878f2'
  },
  {
    start: '#F7F2E4',
    end: '#f29144'
  },
  {
    start: '#DBF0E4',
    end: '#ff9e64'
  },
  {
    start: '#F7F2E4',
    end: '#59a64d'
  },
  {
    start: '#F7F2E4',
    end: '#31d3a7'
  },
  {
    start: '#DBF0E4',
    end: '#f59d02'
  },
  {
    start: '#F2D9D9',
    end: '#50c878'
  },
  {
    start: '#F2D9D9',
    end: '#c12100'
  },
  {
    start: '#DBF0E4',
    end: '#ffb347'
  },
  {
    start: '#F2D9D9',
    end: '#31d3a7'
  },
  {
    start: '#DBF0E4',
    end: '#4346f2'
  },
  {
    start: '#F2D9D9',
    end: '#c878f2'
  },
  {
    start: '#F7F2E4',
    end: '#f29144'
  },
  {
    start: '#F7F2E4',
    end: '#59a64d'
  },
  {
    start: '#F7F2E4',
    end: '#f29144'
  },
  {
    start: '#DBF0E4',
    end: '#31d3a7'
  },
  {
    start: '#F2D9D9',
    end: '#59a64d'
  },
  {
    start: '#DBF0E4',
    end: '#f59d02'
  },
  {
    start: '#F2D9D9',
    end: '#c12100'
  },
  {
    start: '#DBF0E4',
    end: '#ffb347'
  },
  {
    start: '#F2D9D9',
    end: '#31d3a7'
  },
  {
    start: '#F7F2E4',
    end: '#50c878'
  },
  {
    start: '#F2D9D9',
    end: '#c12100'
  }
];


const state = reactive({
  cardData: [

  ]
});


onMounted(async () => {


  let topic = `$dg/user/realtimecard/${props.deviceId}`

  const {data, error} = await devicecard(props.deviceId)
  // const result = data.data
  //     .map((dd: any, i: any) => ({
  //       ...dd,
  //       ...{
  //         color: colorList[i % colorList.length]
  //       } // 分配颜色
  //     }))
  let result= {}
  data.data.forEach((item,i)=>{
    if (result[item.devicetype]){
      result[item.devicetype].push({...item,...{color: colorList[i % colorList.length]}})
    }else{
      result[item.devicetype]=[{...item,...{color: colorList[i % colorList.length]}}]
    }
  })

  state.cardData = result

  bus.off(topic)
  bus.on(topic, (e) => {
    // const {data} = JSON.parse(decode(e))
    // let resData = deepClone(data)
      let result1= {}

    e.data.forEach((item1,i1)=>{
      if (result1[item1.devicetype]){
        result1[item1.devicetype].push({...item1,...{color: colorList[i1 % colorList.length]}})
      }else{
        result1[item1.devicetype]=[{...item1,...{color: colorList[i1 % colorList.length]}}]
      }
    })
    state.cardData = result1
  });
})
  const changeGradientStartColor = (color: any) => {
    // 检查颜色是否包含 'rgba'，如果是，则直接使用
    let newGradient;
    if (color.includes('rgba')) {
      newGradient = `linear-gradient(90deg, ${color} 0%, #F3F7F7 100%)`;
    } else {
      // 假设是十六进制颜色，直接使用
      newGradient = `linear-gradient(90deg, ${color} 0%, #F3F7F7 100%)`;
    }
    return newGradient;
  };

  interface GradientBgProps {
    gradientColor: string;
  }

  const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>()

</script>

<template>
  <div>
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-4 px-4 pb-4 pt-4 text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <n-scrollbar style="max-height: 700px">
    <div  v-for="(value, key) in state.cardData" :key="key">
    <h3 class="text-7 text-[#0C1210] mb-4">{{ key }}</h3>
    <NGrid cols="s:1 m:2 l:6" responsive="screen" :x-gap="24" :y-gap="24">
      <NGi v-for="item in value" :key="item.identifier">
        <GradientBg :gradient-color="changeGradientStartColor(item.color.start)" class="flex-1 rounded-4">
          <h3 class="text-3.5 text-[#0C1210]">{{ item.name }}</h3>
          <div class="flex justify-between pt-12px">
            <div class="flex text-5 font-bold text-black items-center">{{item.number}}<div class="ml-2">{{item.unit}}</div></div>
          </div>
          <h4 class="text-3.5 text-[#0C1210]"> 更新时间:{{ item.time }}</h4>
        </GradientBg>
      </NGi>
    </NGrid>
    </div>
    </n-scrollbar>
  </div>
</template>

<style scoped></style>
