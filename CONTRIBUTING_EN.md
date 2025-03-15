# Contribution Guidelines

Thank you for your interest in contributing to ThoroughBloom! This document provides guidelines and instructions for contributing to our project. We welcome contributions of all forms, including code, documentation, bug reports, feature requests, and more.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

There are many ways to contribute to ThoroughBloom:

1. **Report bugs**: If you find a bug, please create an issue in our [issue tracker](https://github.com/fanhuayun/ThoroughBloom/issues) with detailed information about the bug, steps to reproduce it, and your environment.

2. **Suggest features**: If you have an idea for a new feature or improvement, please create an issue in our [issue tracker](https://github.com/fanhuayun/ThoroughBloom/issues) with a detailed description of your suggestion.

3. **Improve documentation**: Help us improve our documentation by fixing typos, adding examples, or clarifying explanations.

4. **Contribute code**: We welcome code contributions through pull requests.

## Development Setup

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

## Pull Request Process

1. Ensure your code follows our coding standards and passes all tests.
2. Update the documentation if necessary.
3. Make sure your commits have clear and descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the `main` branch of the ThoroughBloom repository.
6. Describe your changes in the pull request description.
7. Wait for a maintainer to review your pull request. They may ask for changes or clarification.

## Coding Standards

- Follow the existing code style in the project.
- Write clear, readable, and maintainable code.
- Add comments where necessary, especially for complex logic.
- Write tests for your code when applicable.
- Ensure your code is compatible with the project's supported platforms and browsers.
- Follow Vue.js best practices for component design and state management.

## Commit Message Guidelines

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

## Branch Naming Convention

When creating branches, please follow this naming convention:

- `feature/short-description` - For new features
- `fix/issue-description` - For bug fixes
- `docs/what-changed` - For documentation changes
- `refactor/what-changed` - For code refactoring
- `test/what-tested` - For test additions or changes

## Testing

- Write unit tests for new features and bug fixes.
- Ensure all tests pass before submitting a pull request.
- Consider adding integration tests for complex features.

## Documentation

- Update documentation to reflect your changes.
- Document new features, APIs, and important changes.
- Use clear and concise language.
- Include examples where appropriate.

## Review Process

- All pull requests will be reviewed by at least one maintainer.
- Feedback may be given on code style, bugs, performance, etc.
- Changes may be requested before a pull request is merged.
- Be responsive to feedback and questions.

## License

By contributing to ThoroughBloom, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
