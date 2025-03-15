<script setup>
import { onMounted, reactive, ref } from 'vue';
import ResourceCard from './modules/ResourceCard.vue';
import CustomModal from './modules/custom-modal.vue';
import { useModalStore } from './stores/modal.js';

const modalStore = useModalStore();
const formData = reactive({
  name: '',
  phone: '',
  company: '',
  hangye: null,
  qiyexingzhi: '设备厂商',
  xuqiu: ''
});

// 定义错误信息
const errors = ref({
  name: '',
  phone: '',
  company: ''
});

const switchXinzhi = item => {
  formData.qiyexingzhi = item.label;
};

const hangyeList = [
  {
    label: '工业',
    value: '工业'
  },
  {
    label: '农业',
    value: '农业'
  }
];

const xingzhiList = [
  { label: '设备厂商', value: '设备厂商' },
  { label: '集成商', value: '集成商' },
  { label: '方案商', value: '方案商' },
  { label: '软件开发商', value: '软件开发商' },
  { label: '个人', value: '个人' },
  { label: '其他', value: '其他' }
];

// 校验规则
const validateForm = () => {
  let valid = true;
  errors.value = { name: '', phone: '', company: '', hangye: '', qiyexingzhi: '', xuqiu: '' };

  // 检查姓名
  if (!formData.name) {
    errors.value.name = '姓名不能为空';
    valid = false;
  }

  // 检查手机号
  if (!formData.phone) {
    errors.value.phone = '手机号不能为空';
    valid = false;
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.value.phone = '手机号格式不正确';
    valid = false;
  }

  // 检查公司名称
  if (!formData.company) {
    errors.value.company = '公司名称不能为空';
    valid = false;
  }

  // 检查所属行业
  if (!formData.hangye) {
    errors.value.hangye = '所属行业不能为空';
    valid = false;
  }

  // 检查企业性质
  if (!formData.qiyexingzhi) {
    errors.value.qiyexingzhi = '企业性质不能为空';
    valid = false;
  }

  // 检查需求
  if (!formData.xuqiu) {
    errors.value.xuqiu = '需求不能为空';
    valid = false;
  }

  return valid;
};

// 提交表单
const submitForm = () => {
  if (validateForm()) {
    console.log('提交成功:', formData);
    alert('提交成功！');
  } else {
    console.log('校验失败', errors.value);
  }
};

const handleExternalOk = () => {
  submitForm();
};

const handleOk = () => {
  console.log('确认按钮点击');
};

const state = reactive({
  menuList: [
    {
      id: '1',
      title: '专项单品资源',
      list: [
       {
          id:  1,
          title: '数据采集服务',
          introduce:
            '针对非本平台的网关，我们提供了统一接入平台的方案，通过设备类型创建，物模型创建，组态创建等标准创建方式让用户轻松上手，可以让用户便捷的看到自己的设备状态及相关业务内容',
          detail: `
      <div class='corp-tip'>基础套餐</div>
      <div class='corp-content-text'>繁花云为新用户，提供了每1种设备类型、免费3个设备接入的设备数量，如需后续设备接入需要缴纳50元/台/3年，如果您一次性接入接入非常多的设备可以联系我们的技术支持人员。</div>
      <div class='corp-tip'>增值服务</div>
      <div class='corp-content-text'>我们为用户提供了全新的组态编辑器及呈现页面，您可以通过组态编辑器编辑自己想要的组态业务图，能够让用户更好的接受业务。</div>
      <div class='corp-tip'>温馨提示</div>
      <div class='corp-content-text'>我们为用户提供了良好的学习环境，大家可以加入我们的技术群，在群里中学习物联网相关技术，我们也为用户提供良好的设备及技术服务。</div>
      `,
          opreationItem: []
        }
      ]
    },
    {
      id: '2',
      title: '私有化项目资源',
      list: [{
          id:   1,
          title: '私有化项目资源相关内容',
          introduce:
            '繁花云私有化部署，将应用端、服务端打包交付给企业，快速灵活的打造企业的专属管理系统。数据私有化、系统私有化，多重安全保障。企业可根据自身业务灵活拓展平台，打造属于自己的平台方案',
          detail: `
        `,
          opreationItem: [
            {
              label: '私有化申请'
            }
          ]
        }
      ]
    }
  ]
});
</script>

<template>
  <div class="content">
    <div class="bg-icon">
    </div>
    <div class="logo">
      <SystemLogo class="text-140px text-primary" />
    </div>
    <div class="text-primary bigTitle">专项单品资源</div>
    <ResourceCard v-for="(item, index) in state.menuList" :key="index" :items="item.list" />
    <CustomModal
      v-model:show="modalStore.isVisible"
      :title="modalStore.title"
      :content="modalStore.content"
      :handle-ok="handleExternalOk"
    >
      <template #contentArea>
        <div v-if="modalStore.status === '了解详情'" class="corp-content" v-html="modalStore.content" />
        <div v-if="modalStore.status === '立即购买'" class="buy-content mb-10">
          <div class="mt-4 flex items-center gap-x-4">
            <label class="w-24 text-right text-gray-700">您的姓名*</label>
            <NInput
              v-model:value="formData.name"
              type="text"
              placeholder="请输入您的姓名"
              class="h-10 flex-1 rounded-md bg-white outline-none"
            />
          </div>
          <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
          <div class="mt-4 flex items-center gap-x-4">
            <label class="w-24 text-right text-gray-700">手机号*</label>
            <NInput
              v-model:value="formData.phone"
              type="text"
              placeholder="请输入手机号"
              class="h-10 flex-1 rounded-md bg-white outline-none"
            />
          </div>
          <span v-if="errors.name" class="text-red-500">{{ errors.phone }}</span>
          <div class="mt-4 flex items-center gap-x-4">
            <label class="w-24 text-right text-gray-700">公司名称*</label>
            <NInput
              v-model:value="formData.company"
              type="text"
              placeholder="请输入公司名称"
              class="h-10 flex-1 rounded-md bg-white outline-none"
            />
          </div>
          <span v-if="errors.name" class="text-red-500">{{ errors.company }}</span>
          <div class="mt-4 flex items-center gap-x-4">
            <label class="w-24 text-right text-gray-700">所属行业*</label>
            <NSelect
              v-model:value="formData.hangye"
              :options="hangyeList"
              placeholder="请选择所属行业"
              class="h-10 flex-1 rounded-md outline-none"
            />
          </div>
          <span v-if="errors.name" class="text-red-500">{{ errors.hangye }}</span>
          <div class="mt-4 flex items-center gap-x-4">
            <label class="w-24 text-right text-gray-700">企业性质*</label>
            <div class="flex flex-1 gap-2 rounded-md p-2 outline-none">
              <div
                v-for="(item, index) in xingzhiList"
                :key="index"
                class="qiyexingzhi"
                :class="{
                  selected: formData.qiyexingzhi === item.label
                }"
                @click="switchXinzhi(item)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
          <span v-if="errors.name" class="text-red-500">{{ errors.qiyexingzhi }}</span>
          <div class="mt-4 flex items-center gap-x-4">
            <label class="w-24 text-right text-gray-700">您的需求*</label>
            <NInput
              v-model:value="formData.xuqiu"
              type="textarea"
              :autosize="{
                minRows: 3
              }"
              placeholder="请输入您的需求"
              class="flex-1 rounded-md bg-white p-2 outline-none"
            />
          </div>
          <span v-if="errors.name" class="text-red-500">{{ errors.xuqiu }}</span>
        </div>

        <div v-if="modalStore.status === '联系我们'" class="call-content">
          <div class="call-cell">
            <div class="bigtip">技术支持热线</div>
            <div class="smalltip mt-1">繁花云技术问题解答</div>
            <div class="phone">
              <img src="../../assets/imgs/phone.png" />
              <div class="phone-right">
                <div class="top-text">售前支持</div>
                <div class="bottom-text">13208054333</div>
              </div>
            </div>
            <div class="phone">
              <img src="../../assets/imgs/phone.png" />
              <div class="phone-right">
                <div class="top-text">售后支持</div>
                <div class="bottom-text">18574790770</div>
              </div>
            </div>
          </div>
          <div class="call-cell justify-between">
            <div class="bigtip">繁花云合作</div>
            <div class="mingpian">
              <div class="code">
                <img src="../../assets/imgs/wechatcode.png" />
              </div>
              <div class="mingpian-text">
                <div class="mingzi">叶子墨</div>
                <div class="puple-text">13208054333</div>
                <div class="puple-text">yezimo69@gmail.com</div>
              </div>
            </div>
          </div>
          <div class="call-cell justify-between">
            <div class="bigtip">繁花云代理加盟</div>
            <div class="mingpian">
              <div class="code">
                <img src="../../assets/imgs/wechatcode.png" />
              </div>
              <div class="mingpian-text">
                <div class="mingzi">叶子墨</div>
                <div class="puple-text">13208054333</div>
                <div class="puple-text">yezimo69@gmail.com</div>
            </div>
            </div>
          </div>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<style lang="scss" scoped>
.qiyexingzhi {
  width: 66px;
  height: 36px;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  color: #6a646f;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 4px 12px;
  cursor: pointer;
  &.selected {
    color: #714898 !important;
    background: rgba(239, 230, 247, 1) !important;
  }
}
.mingzi {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: bold;
  font-size: 16px;
  color: #150f1a;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 8px;
}
.puple-text {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #714898;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
.mingpian {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .code {
    position: absolute;
    left: 50%;
    transform: translate(-50%) translateY(-70%);
    top: 0;
    img {
      width: 92px;
      height: 92px;
    }
  }
  .mingpian-text {
    width: 204px;
    height: 124px;
    background: #ffffff;
    border-radius: 16px 16px 16px 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
.call-content {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  .bigtip {
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: bold;
    font-size: 20px;
    color: #150f1a;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .smalltip {
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #9d97a2;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .call-cell {
    display: flex;
    flex-direction: column;
    width: 288px;
    height: 300px;
    background: linear-gradient(180deg, #f1e6ff 0%, #f9f7fa 100%);
    border-radius: 16px 16px 16px 16px;
    padding: 24px;
  }
  .phone {
    margin-top: 16px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 78px;
    background: #ffffff;
    border-radius: 16px 16px 16px 16px;
    padding: 16px;
    img {
      width: 20px;
      height: 20px;
    }
    .phone-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 16px;
      .top-text {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: bold;
        font-size: 14px;
        color: #714898;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .bottom-text {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: bold;
        font-size: 16px;
        color: #150f1a;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
.corp-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}
.bigTitle {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  margin-top: 1.2rem;
  font-size: 1.75rem;

  line-height: 0px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-bottom: 4rem;
}

.logo {
  width: 9.125rem;
  height: 9.125rem;
  margin-top: 1rem;
}

.logo > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片覆盖整个容器 */
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  min-width: 100%;
  isolation: isolate;
  position: relative;
}

.bg-icon {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  pointer-events: none;
}

.bg-icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片覆盖整个容器 */
}
</style>
