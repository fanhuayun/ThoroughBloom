# 贡献指南 | Contribution Guidelines

[English](#contribution-guidelines) | [中文](#贡献指南-1)

## Contribution Guidelines

Thank you for your interest in contributing to ThoroughBloom! This document provides guidelines and instructions for contributing to our project. We welcome contributions of all forms, including code, documentation, bug reports, feature requests, and more.

### Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

### How to Contribute

There are many ways to contribute to ThoroughBloom:

1. **Report bugs**: If you find a bug, please create an issue in our [issue tracker](https://github.com/fanhuayun/ThoroughBloom/issues) with detailed information about the bug, steps to reproduce it, and your environment.

2. **Suggest features**: If you have an idea for a new feature or improvement, please create an issue in our [issue tracker](https://github.com/fanhuayun/ThoroughBloom/issues) with a detailed description of your suggestion.

3. **Improve documentation**: Help us improve our documentation by fixing typos, adding examples, or clarifying explanations.

4. **Contribute code**: We welcome code contributions through pull requests.

### Development Setup

To set up the development environment:

1. Fork the repository on [GitHub](https://github.com/fanhuayun/ThoroughBloom) or [Gitee](https://gitee.com/fanhuacloud/ThoroughBloom).

2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ThoroughBloom.git
   # or
   git clone https://gitee.com/YOUR_USERNAME/ThoroughBloom.git
   ```

3. Install dependencies:
   ```bash
   cd ThoroughBloom
   pnpm install
   ```

4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

5. Make your changes and commit them with a clear commit message.

### Pull Request Process

1. Ensure your code follows our coding standards and passes all tests.
2. Update the documentation if necessary.
3. Make sure your commits have clear and descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the `main` branch of the ThoroughBloom repository.
6. Describe your changes in the pull request description.
7. Wait for a maintainer to review your pull request. They may ask for changes or clarification.

### Coding Standards

- Follow the existing code style in the project.
- Write clear, readable, and maintainable code.
- Add comments where necessary, especially for complex logic.
- Write tests for your code when applicable.

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): add user authentication system

Implement JWT-based authentication for user login and registration.
```

### License

By contributing to ThoroughBloom, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

## 贡献指南

感谢您对繁花云（ThoroughBloom）的贡献兴趣！本文档提供了为我们的项目做贡献的指南和说明。我们欢迎各种形式的贡献，包括代码、文档、错误报告、功能请求等。

### 行为准则

通过参与本项目，您同意遵守我们的[行为准则](CODE_OF_CONDUCT.md)。请在贡献前阅读它。

### 如何贡献

有多种方式可以为繁花云做贡献：

1. **报告错误**：如果您发现了错误，请在我们的[问题跟踪器](https://github.com/fanhuayun/ThoroughBloom/issues)中创建一个问题，详细说明错误信息、重现步骤和您的环境。

2. **建议功能**：如果您有新功能或改进的想法，请在我们的[问题跟踪器](https://github.com/fanhuayun/ThoroughBloom/issues)中创建一个问题，详细描述您的建议。

3. **改进文档**：通过修复拼写错误、添加示例或澄清解释来帮助我们改进文档。

4. **贡献代码**：我们欢迎通过拉取请求贡献代码。

### 开发环境设置

要设置开发环境：

1. 在[GitHub](https://github.com/fanhuayun/ThoroughBloom)或[Gitee](https://gitee.com/fanhuacloud/ThoroughBloom)上fork仓库。

2. 克隆您的fork：
   ```bash
   git clone https://github.com/您的用户名/ThoroughBloom.git
   # 或
   git clone https://gitee.com/您的用户名/ThoroughBloom.git
   ```

3. 安装依赖：
   ```bash
   cd ThoroughBloom
   pnpm install
   ```

4. 为您的更改创建一个新分支：
   ```bash
   git checkout -b feature/您的功能名称
   # 或
   git checkout -b fix/您的错误修复
   ```

5. 进行更改并提交它们，附上清晰的提交消息。

### 拉取请求流程

1. 确保您的代码遵循我们的编码标准并通过所有测试。
2. 如有必要，更新文档。
3. 确保您的提交有清晰描述性的消息。
4. 将您的更改推送到您的fork。
5. 向繁花云仓库的`main`分支提交拉取请求。
6. 在拉取请求描述中描述您的更改。
7. 等待维护者审查您的拉取请求。他们可能会要求更改或澄清。

### 编码标准

- 遵循项目中现有的代码风格。
- 编写清晰、可读和可维护的代码。
- 在必要时添加注释，特别是对于复杂的逻辑。
- 在适用的情况下为您的代码编写测试。

### 提交消息指南

我们遵循[约定式提交](https://www.conventionalcommits.org/)规范的提交消息：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的页脚]
```

类型包括：
- `feat`：新功能
- `fix`：错误修复
- `docs`：文档更改
- `style`：代码风格更改（格式化等）
- `refactor`：既不修复错误也不添加功能的代码更改
- `perf`：性能改进
- `test`：添加或修复测试
- `chore`：对构建过程或辅助工具的更改

示例：
```
feat(auth): 添加用户认证系统

实现基于JWT的用户登录和注册认证。
```

### 许可证

通过为繁花云做贡献，您同意您的贡献将根据项目的[MIT许可证](LICENSE)进行许可。
