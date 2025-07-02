# Reka UI 文档网站布局设计文档

## 📋 目录
- [整体架构](#整体架构)
- [布局模式](#布局模式)
- [组件层级](#组件层级)
- [响应式设计](#响应式设计)
- [样式系统](#样式系统)
- [配置说明](#配置说明)
- [最佳实践](#最佳实践)

## 🏗️ 整体架构

### 布局层次结构
```
TooltipProvider (全局提示提供者)
└── Layout.vue (主布局容器)
    ├── Header (粘性头部)
    │   ├── Logo + Search (左侧区域)
    │   └── Navbar (右侧导航)
    └── Main (主要内容区域)
        ├── Home.vue (首页布局)
        ├── Showcase.vue (展示页布局)
        └── Docs.vue (文档页布局)
```

### 核心布局特征
- **基础结构**: 上下二栏布局 (Header + Main)
- **文档页面**: 左中右三栏布局 (Sidebar + Content + Aside)
- **响应式适配**: 移动端自动折叠为单栏/双栏
- **最大宽度**: 1440px 居中对齐

## 📄 布局模式

### 1. 首页布局 (`layout: 'home'`)

```vue
<template>
  <div class="h-full flex flex-col justify-between flex-1 w-full">
    <main>
      <!-- Hero 区域 -->
      <section class="grid justify-items-center gap-8 p-5">
        <div class="mt-2 grid w-full max-w-4xl justify-items-center">
          <!-- 标题、描述、CTA按钮 -->
        </div>
      </section>
      
      <!-- 组件演示区域 -->
      <section class="relative h-[40rem] mt-12 overflow-hidden">
        <div class="w-[90rem] h-[32rem] rounded-3xl border bg-card/20">
          <!-- 绝对定位的交互式组件演示 -->
        </div>
      </section>
      
      <!-- 特性展示区域 -->
      <section class="px-4 py-12 md:py-24 max-w-screen-xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <!-- 特性卡片网格 -->
        </div>
      </section>
    </main>
  </div>
</template>
```

**特点:**
- Hero区域：品牌展示 + 核心价值主张
- 交互演示：浮动的组件演示效果
- 特性展示：网格布局的功能介绍

### 2. 文档页布局 (`默认布局`)

```vue
<template>
  <div class="w-full">
    <!-- 背景装饰 -->
    <div class="absolute top-0 left-0 pointer-events-none">
      <img src="/new-bg.png" alt="backdrop">
    </div>
    
    <!-- 文档顶部工具栏 -->
    <DocTopbar />
    
    <!-- 三栏主体布局 -->
    <main class="flex">
      <!-- 左侧导航栏 -->
      <aside class="hidden md:block w-[17rem] sticky top-[7.25rem]">
        <DocSidebar :items="activeSection.items" />
      </aside>
      
      <!-- 中间内容区域 -->
      <div class="px-6 md:px-24 py-6 md:py-12 flex-1">
        <!-- 移动端目录折叠 -->
        <CollapsibleRoot class="block xl:hidden mb-4">
          <CollapsibleTrigger>On this page</CollapsibleTrigger>
          <CollapsibleContent>
            <DocOutline collapsible />
          </CollapsibleContent>
        </CollapsibleRoot>
        
        <!-- 文章内容 -->
        <article class="prose prose-stone dark:prose-invert max-w-none">
          <Content />
        </article>
        
        <DocFooter />
      </div>
      
      <!-- 右侧辅助栏 -->
      <div class="hidden xl:flex w-64 sticky top-[7.25rem] flex-col">
        <DocOutline />
        <DocCommunity />
        <DocCarbonAds />
      </div>
    </main>
  </div>
</template>
```

**特点:**
- 左栏：可折叠的分层导航
- 中栏：Prose样式的文章内容
- 右栏：页面目录 + 社区链接 + 广告

### 3. 展示页布局 (`layout: 'showcase'`)

```vue
<template>
  <div class="max-w-[1440px] w-full h-full grow">
    <Showcase />
  </div>
</template>
```

## 🧩 组件层级

### Header 组件结构

```
Header (68px高度，粘性定位)
├── Container (max-w-[1440px], 水平居中)
│   ├── LeftSection (Logo + Search)
│   │   ├── Logo (品牌标识)
│   │   │   ├── Image (Logo图标)
│   │   │   └── Title (网站标题)
│   │   └── SearchTrigger (搜索入口)
│   └── RightSection (导航区域)
│       └── Navbar
│           ├── DesktopNav (lg+显示)
│           │   ├── NavLinks (主导航)
│           │   ├── ThemeToggle (主题切换)
│           │   └── SocialLinks (社交链接)
│           └── MobileNav (lg-隐藏)
│               └── DropdownMenu (折叠菜单)
```

### Sidebar 组件结构

```
DocSidebar
├── CollapsibleRoot (分组容器)
│   ├── CollapsibleTrigger (分组标题)
│   └── CollapsibleContent (分组内容)
│       └── DocSidebarItem[] (导航项列表)
│           ├── Link (简单链接)
│           └── Nested (嵌套子项)
```

### Content 组件结构

```
Content Area
├── MobileTOC (移动端目录，xl-隐藏)
├── CategoryLabel (分类标签)
├── Article (文章容器)
│   └── VitePress Content (Markdown渲染)
└── DocFooter (文档页脚)
    ├── LastUpdated (最后更新时间)
    ├── EditLink (编辑链接)
    └── Navigation (上一页/下一页)
```

## 📱 响应式设计

### 断点系统

| 断点 | 宽度 | 布局特征 |
|------|------|----------|
| `sm` | 640px+ | 基础样式调整 |
| `md` | 768px+ | 显示左侧边栏 |
| `lg` | 1024px+ | 显示完整导航栏 |
| `xl` | 1280px+ | 显示右侧辅助栏 |

### 响应式布局适配

#### 导航栏适配
```css
/* 桌面端：完整导航栏 */
.navbar-desktop {
  @apply hidden lg:flex items-center;
}

/* 移动端：折叠菜单 */
.navbar-mobile {
  @apply lg:hidden;
}
```

#### 侧边栏适配
```css
/* 文档侧边栏：中等屏幕以上显示 */
.doc-sidebar {
  @apply hidden md:block w-[17rem];
}

/* 右侧辅助栏：大屏幕以上显示 */
.doc-aside {
  @apply hidden xl:flex w-64;
}
```

#### 内容区域适配
```css
/* 内容区域内边距 */
.content-area {
  @apply px-6 md:px-24 py-6 md:py-12;
}

/* 移动端目录 */
.mobile-toc {
  @apply block xl:hidden mb-4;
}
```

## 🎨 样式系统

### CSS 变量主题

#### 亮色主题
```css
:root {
  /* 主色调 */
  --primary: 142.1 76.2% 36.3%;      /* 绿色主色 */
  --primary-foreground: 355.7 100% 97.3%;
  
  /* 背景色 */
  --background: 0 0% 100%;           /* 纯白背景 */
  --foreground: 240 10% 3.9%;       /* 深色文字 */
  
  /* 功能色 */
  --muted: 40 6% 91%;               /* 静音灰 */
  --muted-foreground: 240 3.8% 46.1%;
  --border: 240 5.9% 90%;           /* 边框色 */
  --card: 60 8% 97%;                /* 卡片背景 */
  
  /* 语义色 */
  --destructive: 0 84.2% 60.2%;     /* 危险色 */
  --code: 24 9.8% 10%;              /* 代码背景 */
}
```

#### 暗色主题
```css
.dark {
  --background: 141 17% 5%;          /* 深绿背景 */
  --foreground: 0 0% 95%;           /* 浅色文字 */
  --primary: 151 62% 59%;           /* 亮绿主色 */
  --muted: 0 0% 15%;               /* 深灰静音 */
  --border: 240 3.7% 15.9%;        /* 深色边框 */
  --card: 24 9.8% 10%;             /* 深色卡片 */
}
```

### 字体系统
```css
@font-face {
  font-family: "Geist";
  src: url("/fonts/Geist[wght].ttf");
}

@font-face {
  font-family: "GeistMono";
  src: url("/fonts/GeistMono[wght].ttf");
}

:root {
  --font-geist-sans: "Geist";
  --font-geist-mono: "GeistMono";
}
```

### 代码块样式
```css
.vp-code {
  @apply px-6 py-4 my-0 
         bg-[hsl(24_9.8%_10%)] 
         border border-[hsl(0_0%_15%)] 
         rounded-lg;
}

/* 差异高亮 */
.diff.add {
  @apply bg-green-600/15;
}

.diff.remove {
  @apply bg-red-500/20 opacity-70;
}

/* 行高亮 */
.highlighted {
  @apply bg-[hsl(0_0%_15%)];
}
```

### Prose 样式系统
```css
.prose {
  @apply prose-stone dark:prose-invert max-w-none;
}

/* 自定义块样式 */
.custom-block {
  @apply rounded-xl p-6 border border-muted;
}
```

## ⚙️ 配置说明

### VitePress 核心配置

```typescript
// .vitepress/config.ts
export default defineConfig({
  // 基础配置
  cleanUrls: true,
  title: rekaName,
  description: rekaDescription,
  titleTemplate: rekaShortName,
  
  // 主题配置
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/docs/overview/getting-started' },
      { text: 'Examples', link: '/examples/checkbox-group' },
      { text: 'Showcase', link: '/showcase' },
      {
        text: `v${version}`,
        items: [
          { text: 'Release Notes', link: releases },
          { text: legacyVersion, link: legacyLink },
        ],
      },
    ],
    
    sidebar: [
      {
        text: 'Overview',
        icon: 'lucide:rocket',
        items: [...]
      },
      // ...更多侧边栏配置
    ],
    
    outline: { level: [2, 3] },
    logo: '/logo.svg',
  },
  
  // 构建配置
  vite: {
    css: {
      postcss: {
        plugins: [tailwind, autoprefixer, postcssIsolateStyles()]
      }
    }
  }
})
```

### 主题注册

```typescript
// .vitepress/theme/index.ts
export default {
  Layout,
  enhanceApp({ app }) {
    // 全局组件注册
    for (const path in baseModules)
      app.component(path.match(regex)?.[1] ?? '', baseModules[path]?.default)
    
    // 特殊组件注册
    app.component('EmbedIframe', EmbedIframe)
    app.component('ComponentPreview', ComponentPreview)
    app.component('InstallationTabs', InstallationTabs)
  },
} satisfies Theme
```

### Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './docs/**/*.{js,ts,vue,md}',
    './components/**/*.vue',
    './.vitepress/**/*.{js,ts,vue}'
  ],
  
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ...更多色彩变量
      },
      
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      }
    }
  }
}
```

## 🚀 最佳实践

### 1. 性能优化

#### 组件懒加载
```typescript
// 动态导入组件
const baseModules = import.meta.glob('../../components/*.vue', { eager: true })
const tableModules = import.meta.glob('../../components/tables/*.vue', { eager: true })
```

#### 图片优化
```vue
<!-- WebP格式 + 懒加载 -->
<img 
  loading="lazy"
  src="/image.webp" 
  alt="description"
  decoding="async"
>
```

#### CSS优化
```css
/* 硬件加速 */
.scroll-area {
  transform: translateZ(0);
  will-change: scroll-position;
}

/* 滚动性能 */
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
```

### 2. 可访问性

#### 语义化HTML
```vue
<main role="main">
  <article>
    <header>
      <h1>{{ title }}</h1>
    </header>
    <section>
      <Content />
    </section>
  </article>
</main>
```

#### 键盘导航
```vue
<CollapsibleTrigger 
  @keydown.space.prevent="toggle"
  @keydown.enter.prevent="toggle"
  aria-expanded="false"
>
```

#### ARIA 属性
```vue
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" :aria-current="isActive ? 'page' : false">
```

### 3. 响应式最佳实践

#### 移动优先设计
```css
/* 基础样式（移动端） */
.container {
  @apply px-4;
}

/* 渐进增强（桌面端） */
@media (min-width: 768px) {
  .container {
    @apply px-8;
  }
}
```

#### 弹性布局
```css
.layout {
  @apply flex flex-col min-h-screen;
}

.content {
  @apply flex-1; /* 占据剩余空间 */
}
```

### 4. 主题切换最佳实践

#### CSS变量方案
```css
:root, [data-theme="light"] {
  --bg: 255 255 255;
}

[data-theme="dark"] {
  --bg: 18 18 18;
}

.bg-primary {
  background: rgb(var(--bg));
}
```

#### Vue组合式API
```typescript
const { isDark, toggle } = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})
```

## 📊 布局性能指标

### Core Web Vitals 目标
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms

### 优化策略
1. **关键资源预加载**: 字体、关键CSS
2. **图片优化**: WebP格式、适当尺寸、懒加载
3. **代码分割**: 路由级别的代码分割
4. **缓存策略**: 静态资源长期缓存

---

*这份文档涵盖了Reka UI文档网站的完整布局设计架构，可作为类似项目的参考模板和最佳实践指南。*
