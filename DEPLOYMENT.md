# 部署指南

本项目使用 GitHub Actions 自动部署到 GitHub Pages。

## 自动部署配置

### 1. GitHub Pages 设置

在 GitHub 仓库中进行以下设置：

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单中找到 **Pages** 选项
3. 在 **Source** 部分选择 **GitHub Actions**
4. 保存设置

### 2. 工作流说明

项目包含以下 GitHub Actions 工作流：

#### `.github/workflows/deploy.yml`
- **触发条件**：推送到 `master` 分支或手动触发
- **功能**：构建 RSPress 文档站点并部署到 GitHub Pages
- **构建输出**：`doc_build/` 目录
- **Node.js 版本**：18

#### `.github/workflows/check-docs.yml`
- **触发条件**：每天上午 9 点 UTC 或手动触发
- **功能**：检查 TanStack Table 官方文档更新

### 3. 部署流程

1. **自动部署**：
   - 推送代码到 `master` 分支
   - GitHub Actions 自动触发构建和部署
   - 部署完成后，网站将在 `https://<username>.github.io/<repository-name>` 可用

2. **手动部署**：
   - 进入仓库的 **Actions** 页面
   - 选择 "Deploy to GitHub Pages" 工作流
   - 点击 "Run workflow" 按钮

### 4. 本地预览

在部署前，可以本地预览构建结果：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 预览构建结果
pnpm run preview
```

### 5. 故障排除

如果部署失败，请检查：

1. **权限设置**：确保仓库的 Actions 权限已启用
2. **Pages 设置**：确保 GitHub Pages 源设置为 "GitHub Actions"
3. **构建日志**：查看 Actions 页面的构建日志，定位具体错误
4. **依赖问题**：确保 `package.json` 中的依赖版本正确

### 6. 自定义域名（可选）

如果需要使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 在文件中添加你的域名（如：`docs.example.com`）
3. 在域名提供商处配置 DNS 记录指向 GitHub Pages

## 技术栈

- **文档框架**：RSPress 2.0.0-beta.18
- **构建工具**：Node.js 18
- **部署平台**：GitHub Pages
- **CI/CD**：GitHub Actions