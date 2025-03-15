<script setup>
import { computed } from 'vue'; // 新增 computed 引入

import { useThemeStore } from '@/store/modules/theme';
const themeStore = useThemeStore();
function hexToRgba(hex, alpha) {
  // 移除可能的#号并转换为大写
  hex = hex.replace('#', '').toUpperCase();

  // 检查是否是有效的十六进制颜色值
  if (hex.length !== 6) {
    throw new Error('Invalid hex color value');
  }

  // 提取RGB分量
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // 确保alpha值在0到1之间
  alpha = Math.max(0, Math.min(1, alpha));

  // 返回rgba字符串
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Props
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: '这里是弹窗内容'
  },
  okText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  show: {
    type: Boolean,
    default: false
  },
  handleOk: {
    type: Function,
    default: () => {}
  }
});
// 新增 update:show 事件
const emit = defineEmits(['ok', 'cancel', 'close', 'update:show']);

// 新增计算属性实现双向绑定
const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
});

// 修改关闭处理逻辑
function handleClose() {
  isVisible.value = false;
  emit('close');
}

function handleCancel() {
  emit('cancel');
  isVisible.value = false; // 取消后自动关闭
}
</script>

<template>
  <NModal v-model:show="isVisible" :mask-closable="true" :esc-to-close="true" class="custom-modal" @close="handleClose">
    <div
      class="container"
      :style="{
        background:
          title === '联系我们'
            ? '#ffffff'
            : `linear-gradient(180deg, ${hexToRgba(themeStore.themeColors.primary, 1)} 0%, rgba(255, 255, 255, 1) 100%)`
      }"
    >
      <div class="header">
        <div class="title">{{ title }}</div>
        <img src="../../../assets/imgs/x.png" @click="handleClose" />
      </div>

      <slot name="contentArea">这里是默认弹窗内容</slot>
      <div class="footer gap-4">
        <NButton
          v-if="title === '方案咨询'"
          type="primary"
          :color="hexToRgba(themeStore.themeColors.primary, 1)"
          @click="handleOk"
        >
          立即提交
        </NButton>
        <NButton :color="hexToRgba(themeStore.themeColors.primary, 1)" ghost @click="handleCancel">关闭</NButton>
      </div>
    </div>
  </NModal>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: end;
  margin-top: auto; // 确保按钮在最底部
}
.container {
  display: flex;
  flex-direction: column;
  border-radius: 2rem;
  width: 960px;
  justify-content: space-between; // 增加这一行
  min-height: 500px;
  padding: 32px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
    }
    .title {
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 500;
      font-size: 28px;
      color: #150f1a;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }
}

::v-deep .corp-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  width: fit-content;
  height: 32px;
  background: #714898;
  border-radius: 8px 8px 8px 8px;
  color: rgba(255, 255, 255, 1);
}

::v-deep .corp-content-text {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;

  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
::v-deep .corp-content-tip {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ea5a5a;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
</style>
