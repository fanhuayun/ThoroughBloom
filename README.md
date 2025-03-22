# 繁花云 (ThoroughBloom)

<div align="center">
  <img src="./public/favicon.svg" alt="繁花云 Logo" width="200" />
  <p>一个完整的开源物联网解决方案</p>

  <a href="https://github.com/fanhuayun/ThoroughBloom/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/fanhuayun/ThoroughBloom" alt="license" />
  </a>
  <a href="https://github.com/fanhuayun/ThoroughBloom/stargazers">
    <img src="https://img.shields.io/github/stars/fanhuayun/ThoroughBloom" alt="stars" />
  </a>
  <a href="https://github.com/fanhuayun/ThoroughBloom/network/members">
    <img src="https://img.shields.io/github/forks/fanhuayun/ThoroughBloom" alt="forks" />
  </a>
  <a href="https://github.com/fanhuayun/ThoroughBloom/issues">
    <img src="https://img.shields.io/github/issues/fanhuayun/ThoroughBloom" alt="issues" />
  </a>
</div>

<p align="center">
  <a href="README_EN.md">English</a> |
  <span>中文</span>
</p>

## 📖 项目介绍

繁花云 (ThoroughBloom) 是一个专注于物联网系统的开源项目组织。我们提供了一套完整的、开源的物联网解决方案，涵盖了从前端到后端的全部代码。繁花云的前端基于 Vue.js 开发，后端则采用了灵活且可扩展的技术栈，所有代码完全免费开源。

ThoroughBloom 是繁花云项目的前端部分，提供了直观、美观且功能强大的用户界面，用于物联网设备的管理、监控和控制。

## ✨ 核心特性

- 📱 **响应式设计**：适配各种设备屏幕，从手机到大屏显示器
- 🌐 **多语言支持**：内置中英文支持，易于扩展其他语言
- 🎨 **可定制主题**：灵活的主题系统，支持明暗模式切换
- 📊 **数据可视化**：强大的图表和仪表盘功能，直观展示设备数据
- 🔔 **实时通知**：设备状态变化和告警的即时推送
- 🔒 **安全可靠**：完善的权限管理和数据安全机制
- 🔌 **设备管理**：全面的物联网设备接入、管理和控制功能
- 🚀 **易于扩展**：模块化设计，便于根据需求扩展功能

## 🛠️ 技术栈

- **前端框架**：Vue 3
- **开发语言**：TypeScript
- **状态管理**：Pinia/Vuex
- **UI 组件库**：naive-ui
- **路由管理**：Vue Router
- **HTTP 客户端**：Axios
- **国际化**：vue-i18n
- **数据可视化**：ECharts/D3.js
- **CSS 预处理器**：SCSS/Less

## 🚀 快速开始

### 环境要求

- Node.js >= 20.x
- pnpm >= 8.x (推荐) 或 npm >= 8.x 或 yarn >= 1.22.x

### 安装步骤

1. 克隆仓库

```bash
# GitHub (国际)
git clone https://github.com/fanhuayun/ThoroughBloom.git
# 或 Gitee (国内推荐)
git clone https://gitee.com/fanhuacloud/ThoroughBloom.git

cd ThoroughBloom
```

2. 安装依赖

```bash
# 推荐使用 pnpm
pnpm install
# 或
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

4. 构建生产版本

```bash
pnpm build
# 或
npm run build
# 或
yarn build
```

## 📚 项目结构

```
src/
├── assets/         # 静态资源文件
├── components/     # 组件库
├── composables/    # 组合式API
├── constants/      # 常量定义
├── enum/           # 枚举定义
├── hooks/          # 自定义钩子
├── layouts/        # 布局组件
├── locales/        # 国际化资源
├── plugins/        # 插件
├── router/         # 路由配置
├── service/        # 服务层/API调用
├── store/          # 状态管理
├── styles/         # 样式文件
├── theme/          # 主题配置
├── typings/        # TypeScript类型定义
├── utils/          # 工具函数
├── views/          # 页面视图
├── App.vue         # 根组件
└── main.ts         # 入口文件
```

## 🔗 相关项目

- [繁花云后端](https://github.com/fanhuayun/backend) - 繁花云的后端服务
- [繁花云文档](https://github.com/fanhuayun/docs) - 详细的项目文档

## 🤝 如何贡献

我们非常欢迎各种形式的贡献，无论是新功能、bug修复还是文档改进。请查看我们的[贡献指南](CONTRIBUTING.md)了解更多信息。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 👥 团队成员

感谢以下贡献者的付出：

<a href="https://github.com/fanhuayun/ThoroughBloom/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fanhuayun/ThoroughBloom" />
</a>


## 交流群

欢迎加入我们的微信交流群，一起讨论和解决问题。请扫描以下二维码加入：

![交流群二维码](https://test.hgjzt.com/files/wxcode.png)

## 📞 联系我们

- 官方网站：[https://thoroughbloom.cn](https://www.thoroughbloom.cn)
- 电子邮件：yezimo69@gmail.com
- GitHub：[https://github.com/fanhuayun/ThoroughBloom](https://github.com/fanhuayun/ThoroughBloom)
- Gitee：[https://gitee.com/fanhuacloud/ThoroughBloom](https://gitee.com/fanhuacloud/ThoroughBloom) (国内推荐)
