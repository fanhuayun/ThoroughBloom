import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    isVisible: false, // 控制 Modal 的显示状态
    title: '提示', // 默认标题
    content: '', // 默认内容
    status: '立即购买'
  }),
  actions: {
    openModal(title = '', status = '', content = '') {
      console.log('111');
      this.isVisible = true;
      this.title = title;
      this.content = content;
      this.status = status;
    },
    closeModal() {
      this.isVisible = false;
    },
    updateContent(newContent) {
      this.content = newContent;
    }
  }
});
