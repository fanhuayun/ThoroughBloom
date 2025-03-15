<script setup lang="ts">
import { PropType, defineEmits, ref } from 'vue';
defineOptions({ name: 'HoverDropdown', inheritAttrs: false });
interface Option {
  label: string;
  value: string | number;
}
// 定义 props
const props = defineProps<{
  options: Option[];
}>();

const emit = defineEmits<{
  (e: 'select', payload: { value: string | number; extraData?: any }): void;
}>();

// 控制下拉菜单显示/隐藏
const isDropdownVisible = ref(false);

const showDropdown = () => {
  isDropdownVisible.value = true;
};

const hideDropdown = () => {
  isDropdownVisible.value = false;
};

// 点击选项事件
const handleOptionClick = (option: Option, extraData?: any) => {
  emit('select', { value: option.value, extraData });
  hideDropdown();
};
</script>

<template>
  <div class="dropdown-container" @mouseenter="showDropdown" @mouseleave="hideDropdown">
    <!-- 触发按钮插槽 -->
    <slot name="trigger">
      <button class="dropdown-trigger">悬停我</button>
    </slot>

    <!-- 下拉菜单 -->
    <Transition name="fade">
      <div v-if="isDropdownVisible" class="dropdown-menu">
        <ul>
          <li
            v-for="(option, index) in options"
            :key="index"
            class="h-10 flex items-center justify-center"
            @click="handleOptionClick(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-container {
  display: inline-block;
  position: relative;
}

.dropdown-trigger {
  background-color: #3498db;
  color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-menu {
  padding: 4px;
  overflow: hidden;
  color: #000000;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  width: fit-content;
  min-width: 6rem;
  margin-top: 4px;
  z-index: 1000;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  cursor: pointer;
  border-radius: 8px;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
