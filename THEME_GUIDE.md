# TanStack Table 自定义主题指南

## 🎨 主题概述

我为 TanStack Table 文档网站设计了一个现代化的自定义主题，采用 CSS-only 的方式实现，确保兼容性和性能。

## ✨ 主题特色

### 🎯 设计理念
- **品牌一致性**：使用 TanStack 官方色彩（橙色到蓝色渐变）
- **现代化设计**：采用流行的渐变色、阴影和圆角设计
- **用户体验优先**：注重可读性、导航便利性和视觉层次
- **响应式设计**：完美适配桌面端、平板和移动端

### 🌈 色彩系统
```css
/* 主色调 */
--tanstack-primary: #ff6b35;     /* TanStack 橙色 */
--tanstack-secondary: #4a90e2;   /* TanStack 蓝色 */
--tanstack-accent: #7b68ee;      /* 紫色强调色 */

/* 渐变色 */
--tanstack-gradient-primary: linear-gradient(135deg, #ff6b35 0%, #4a90e2 100%);
```

### 🎭 视觉特效
- **渐变背景**：Hero 区域使用品牌渐变色
- **网格纹理**：Hero 背景添加微妙的网格图案
- **悬停动画**：按钮和卡片的流畅过渡效果
- **阴影层次**：多层次阴影营造深度感
- **动画效果**：淡入上升动画增强视觉体验

## 📁 文件结构

```
/docs/.vitepress/theme/
└── custom.css          # 主题样式文件
```

## 🚀 实现方式

### 1. CSS-Only 方案
选择纯 CSS 实现的原因：
- ✅ **兼容性好**：不依赖复杂的组件重写
- ✅ **性能优异**：无额外 JavaScript 开销
- ✅ **维护简单**：样式集中管理，易于修改
- ✅ **升级友好**：不影响 Rspress 框架升级

### 2. 配置方式
在 `rspress.config.ts` 中引入：
```typescript
const customCSS = path.join(__dirname, 'docs/.vitepress/theme/custom.css');

export default defineConfig({
  // ...
  globalStyles: customCSS,
  // ...
});
```

## 🎨 主要样式组件

### 1. Hero 区域
- **渐变背景**：品牌色彩渐变
- **网格纹理**：SVG 网格图案叠加
- **大标题**：3.5rem 字体，文字阴影
- **行动按钮**：主要、次要、轮廓三种样式

### 2. 功能特性卡片
- **卡片设计**：白色背景，圆角边框
- **悬停效果**：上升动画 + 阴影变化
- **图标展示**：大号 emoji 图标
- **渐进动画**：错开的淡入效果

### 3. 导航栏
- **毛玻璃效果**：半透明背景 + 模糊滤镜
- **品牌标识**：渐变色文字效果
- **边框分隔**：细线分隔增强层次

### 4. 内容区域
- **代码块**：深色背景，语法高亮
- **表格样式**：圆角边框，悬停高亮
- **引用块**：左侧彩色边框，背景色区分
- **链接效果**：下划线悬停动画

### 5. 响应式设计
```css
/* 平板和手机 */
@media (max-width: 768px) {
  .hero h1 { font-size: 2.5rem; }
  .features-grid { grid-template-columns: 1fr; }
}

/* 手机端 */
@media (max-width: 480px) {
  .hero h1 { font-size: 2rem; }
  .btn { width: 100%; }
}
```

## 🛠️ 自定义指南

### 修改品牌色彩
在 `custom.css` 中修改 CSS 变量：
```css
:root {
  --tanstack-primary: #your-color;     /* 主色调 */
  --tanstack-secondary: #your-color;   /* 次要色调 */
  --tanstack-accent: #your-color;      /* 强调色 */
}
```

### 调整间距和尺寸
```css
:root {
  --tanstack-space-xs: 0.25rem;   /* 最小间距 */
  --tanstack-space-sm: 0.5rem;    /* 小间距 */
  --tanstack-space-md: 1rem;      /* 中等间距 */
  --tanstack-space-lg: 1.5rem;    /* 大间距 */
  --tanstack-space-xl: 2rem;      /* 超大间距 */
}
```

### 修改圆角和阴影
```css
:root {
  --tanstack-radius-sm: 0.25rem;  /* 小圆角 */
  --tanstack-radius-md: 0.375rem; /* 中圆角 */
  --tanstack-radius-lg: 0.5rem;   /* 大圆角 */
  --tanstack-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## 🌙 暗色主题支持

主题自动支持暗色模式：
```css
.dark {
  --tanstack-gray-50: #1f2937;
  --tanstack-gray-900: #ffffff;
  /* 其他暗色变量 */
}
```

## 📱 浏览器兼容性

- ✅ Chrome ≥ 88
- ✅ Firefox ≥ 85  
- ✅ Safari ≥ 14
- ✅ Edge ≥ 88

## 🚀 性能优化

### CSS 优化策略
- **CSS 变量**：减少重复代码，便于主题切换
- **现代布局**：使用 Flexbox 和 Grid 布局
- **硬件加速**：transform 和 opacity 动画
- **选择器优化**：避免深层嵌套选择器

### 加载性能
- **单文件引入**：所有样式集中在一个文件
- **无外部依赖**：不依赖外部字体或图片
- **压缩友好**：CSS 结构便于压缩

## 🎯 最佳实践

### 1. 样式组织
- 按功能模块组织样式
- 使用 CSS 变量统一管理
- 保持选择器简洁明了

### 2. 响应式设计
- 移动端优先的设计思路
- 合理的断点设置
- 灵活的网格布局

### 3. 可访问性
- 足够的颜色对比度
- 清晰的焦点指示器
- 语义化的 HTML 结构

## 🔧 故障排除

### 样式不生效
1. 检查 `rspress.config.ts` 中的 `globalStyles` 配置
2. 确认 CSS 文件路径正确
3. 重启开发服务器清除缓存

### 响应式问题
1. 检查媒体查询断点
2. 确认 viewport meta 标签
3. 测试不同设备尺寸

### 兼容性问题
1. 检查 CSS 属性支持情况
2. 添加浏览器前缀
3. 提供降级方案

## 📈 未来扩展

### 可能的增强功能
- **主题切换器**：用户可选择不同主题
- **动画库集成**：更丰富的动画效果
- **组件库**：可复用的 UI 组件
- **国际化支持**：多语言界面适配

### 维护建议
- 定期检查浏览器兼容性
- 关注 Rspress 框架更新
- 收集用户反馈优化体验
- 保持设计趋势同步

## 📞 技术支持

如果在使用过程中遇到问题：
1. 查看 [Rspress 官方文档](https://rspress.dev)
2. 检查浏览器开发者工具
3. 参考本指南的故障排除部分
4. 提交 GitHub Issue 寻求帮助

---

**主题设计目标**：为 TanStack Table 文档网站提供现代化、专业化、用户友好的视觉体验，同时保持良好的性能和兼容性。