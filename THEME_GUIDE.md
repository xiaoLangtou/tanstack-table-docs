# TanStack Table 文档网站自定义主题指南

## 概述

本文档介绍了为 TanStack Table 文档网站创建的基于 Rspress 2.0 的自定义主题方案。该主题通过扩展默认主题实现，采用现代化设计理念，提供了优雅的视觉体验和良好的用户交互。

## 特色功能

### 🎨 设计特色
- **品牌色彩系统**：采用 TanStack 橙色 (#ff6b35) 作为主色调
- **现代渐变效果**：多层次渐变背景和视觉特效
- **响应式设计**：完美适配桌面端和移动端
- **暗色主题支持**：自动适配系统主题偏好

### 🚀 功能增强
- **自定义 Hero 区域**：首页增强展示区域
- **智能文档提示**：页面底部友好提示信息
- **品牌化导航**：导航栏增加品牌标识
- **优化的代码展示**：增强的代码块和语法高亮

## 实现方式

### 1. 主题结构

基于 Rspress 2.0 的主题扩展方式，项目结构如下：

```
├── theme/
│   ├── index.tsx          # 主题入口文件
│   └── styles/
│       └── custom.css     # 自定义样式文件
├── rspress.config.ts      # Rspress 配置文件
└── docs/                  # 文档内容
```

### 2. 配置文件设置

在 `rspress.config.ts` 中指定自定义主题路径：

```typescript
import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'TanStack Table 中文文档',
  theme: path.join(__dirname, 'theme'), // 指定主题目录
  // ... 其他配置
});
```

### 3. 主题入口文件

`theme/index.tsx` 文件通过扩展默认主题的 Layout 组件实现：

```tsx
import { Layout as BasicLayout } from 'rspress/theme';
import './styles/custom.css';

const Layout = () => (
  <BasicLayout
    beforeNavTitle={<span>🚀</span>}
    afterHero={/* 自定义 Hero 内容 */}
    beforeDocFooter={/* 自定义文档页脚 */}
    bottom={/* 自定义底部内容 */}
  />
);

const setup = () => {
  // 全局初始化逻辑
};

export { Layout, setup };
export * from 'rspress/theme';
```

### 4. 样式文件位置

自定义样式文件位于：`theme/styles/custom.css`

## 主要样式组件

### 色彩系统

```css
:root {
  /* 品牌色彩 */
  --tanstack-primary: #ff6b35;
  --tanstack-primary-light: #ff8c5a;
  --tanstack-primary-dark: #e55a2b;
  --tanstack-secondary: #4f46e5;
  --tanstack-accent: #06b6d4;
  
  /* 渐变色 */
  --tanstack-gradient: linear-gradient(135deg, var(--tanstack-primary) 0%, var(--tanstack-secondary) 100%);
  --tanstack-hero-gradient: linear-gradient(135deg, #ff6b35 0%, #4f46e5 50%, #06b6d4 100%);
}
```

### 插槽组件

#### Hero 区域增强
- 位置：首页 Hero 部分之后
- 功能：展示产品特色和价值主张
- 样式：渐变背景 + 网格纹理

#### 文档页脚提示
- 位置：正文页 Footer 部分之前
- 功能：提供帮助链接和友好提示
- 样式：卡片式设计 + 左侧强调边框

#### 底部版权信息
- 位置：整个页面最底部
- 功能：显示版权和许可信息
- 样式：渐变背景 + 居中布局

## 响应式设计

### 断点设置
- **桌面端**：> 768px
- **移动端**：≤ 768px

### 移动端优化
```css
@media (max-width: 768px) {
  .custom-hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-gradient h2 {
    font-size: 2rem;
  }
}
```

## 自定义指南

### 修改品牌色彩

在 `theme/styles/custom.css` 中修改 CSS 变量：

```css
:root {
  --tanstack-primary: #your-color;
  --tanstack-primary-light: #your-light-color;
  --tanstack-primary-dark: #your-dark-color;
}
```

### 添加新的插槽内容

在 `theme/index.tsx` 中添加更多插槽：

```tsx
const Layout = () => (
  <BasicLayout
    // 现有插槽...
    beforeDoc={<YourCustomComponent />}
    afterDoc={<AnotherCustomComponent />}
  />
);
```

### 自定义组件样式

1. 在 CSS 文件中定义样式类
2. 在 JSX 组件中使用 className
3. 遵循 BEM 命名规范

## 暗色主题支持

主题自动检测系统主题偏好，并提供暗色模式变量：

```css
.dark {
  --tanstack-primary: #ff8c5a;
  --tanstack-primary-light: #ffab7a;
  --tanstack-primary-dark: #ff6b35;
}
```

## 浏览器兼容性

- **现代浏览器**：Chrome 88+, Firefox 85+, Safari 14+
- **CSS 特性**：CSS 变量、Grid 布局、Flexbox
- **JavaScript**：ES2020+ 语法支持

## 性能优化

### CSS 优化
- 使用 CSS 变量减少重复代码
- 合理使用 CSS 选择器，避免过度嵌套
- 利用 GPU 加速的 transform 和 opacity 属性

### 资源加载
- 样式文件通过主题入口统一加载
- 避免内联样式，提高缓存效率
- 使用 SVG 图标替代位图

## 最佳实践

### 开发建议
1. **模块化设计**：将样式按功能模块分离
2. **语义化命名**：使用有意义的 CSS 类名
3. **渐进增强**：确保基础功能在所有环境下可用
4. **可访问性**：遵循 WCAG 2.1 AA 标准

### 维护建议
1. **版本控制**：记录主题变更历史
2. **文档更新**：及时更新使用说明
3. **测试验证**：在多种设备和浏览器中测试
4. **性能监控**：定期检查加载性能

## 故障排除

### 常见问题

#### 主题不生效
- 检查 `rspress.config.ts` 中的 `theme` 配置
- 确认主题目录结构正确
- 验证 `index.tsx` 文件导出格式

#### 样式冲突
- 使用更具体的 CSS 选择器
- 检查样式加载顺序
- 利用 CSS 层叠优先级规则

#### 构建错误
- 检查 TypeScript 类型定义
- 确认所有依赖项已安装
- 查看控制台错误信息

### 调试技巧

1. **开发者工具**：使用浏览器开发者工具检查元素
2. **CSS 变量检查**：在控制台查看 CSS 变量值
3. **组件树分析**：使用 React DevTools 分析组件结构

## 未来扩展

### 计划功能
- **主题切换器**：用户可选择不同主题风格
- **动画效果**：添加页面过渡和交互动画
- **国际化支持**：多语言主题适配
- **插件系统**：支持第三方主题插件

### 技术升级
- **CSS-in-JS**：考虑使用 styled-components
- **设计系统**：建立完整的设计令牌系统
- **组件库**：抽象可复用的主题组件

## 贡献指南

欢迎为主题改进贡献代码！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码变更
4. 编写测试用例
5. 提交 Pull Request

## 许可证

本主题基于 MIT 许可证开源，详见 [LICENSE](LICENSE) 文件。

---

**最后更新**：2024年12月
**版本**：1.0.0
**兼容性**：Rspress 2.0.0-beta.18+