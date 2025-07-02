# TanStack Table 中文文档网站

这是 TanStack Table 的中文文档网站，基于 RSPress 构建。

## 功能特性

- 📚 完整的 TanStack Table 中文文档翻译
- 🚀 基于 RSPress 的现代文档框架
- 🔄 自动同步官方文档更新
- 📱 响应式设计，支持移动端
- 🔍 全文搜索功能
- 🎨 美观的 UI 界面

## 快速开始

### 环境要求

- Node.js 18+
- pnpm（推荐）或 npm

### 安装依赖

```bash
pnpm install
```

### 开发服务器

启动开发服务器：

```bash
pnpm run dev
```

### 构建生产版本

构建网站：

```bash
pnpm run build
```

### 本地预览

预览生产构建：

```bash
pnpm run preview
```

## 部署

本项目使用 GitHub Actions 自动部署到 GitHub Pages。详细的部署配置和说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 自动部署

- 推送到 `master` 分支时自动触发部署
- 部署完成后可通过 GitHub Pages 访问

### 手动部署

在 GitHub Actions 页面手动触发 "Deploy to GitHub Pages" 工作流。

## 项目结构

```
├── .github/workflows/     # GitHub Actions 工作流
│   ├── deploy.yml        # 部署工作流
│   └── check-docs.yml    # 文档更新检查
├── docs/                 # 文档源文件
│   ├── guide/           # 指南文档
│   ├── api/             # API 文档
│   ├── framework/       # 框架集成文档
│   └── enterprise/      # 企业版文档
├── upstream-docs/        # 官方文档同步
└── rspress.config.ts     # RSPress 配置文件
```

## 贡献指南

欢迎贡献翻译和改进！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 翻译规范

- 保持术语一致性
- 遵循中文技术文档写作规范
- 保留原文的代码示例和链接
- 确保翻译准确性和可读性

## 技术栈

- **文档框架**：[RSPress](https://rspress.dev/)
- **构建工具**：Node.js + pnpm
- **部署平台**：GitHub Pages
- **CI/CD**：GitHub Actions

## 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](./LICENSE) 文件。

## 相关链接

- [TanStack Table 官方文档](https://tanstack.com/table)
- [TanStack Table GitHub](https://github.com/TanStack/table)
- [RSPress 文档](https://rspress.dev/)
