import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'TanStack Table 中文文档',
  description: 'TanStack Table 是一个无头的、TypeScript 优先的表格库，为所有框架提供强大的数据网格体验。',
  base: '/tanstack-table-docs/',
  outDir: 'doc_build',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/',
        activeMatch: '^/$'
      },
      {
        text: '开始使用',
        items: [
          { text: '介绍', link: '/introduction' },
          { text: '安装', link: '/installation' },
          { text: '概览', link: '/overview' },
          { text: 'Vanilla JS', link: '/vanilla' }
        ]
      },
      {
        text: '指南',
        link: '/guide/features',
        activeMatch: '^/guide/'
      },
      {
        text: 'API 文档',
        link: '/api/',
        activeMatch: '^/api/'
      },
      {
        text: '框架集成',
        link: '/framework/',
        activeMatch: '^/framework/'
      },
      {
        text: '企业版',
        link: '/enterprise/',
        activeMatch: '^/enterprise/'
      },
      {
        text: '常见问题',
        link: '/faq'
      }
    ],
    sidebar: {
      '/': [
        {
          text: '开始使用',
          items: [
            { text: '介绍', link: '/introduction' },
            { text: '安装', link: '/installation' },
            { text: '概览', link: '/overview' },
            { text: 'Vanilla JS', link: '/vanilla' },
            { text: '常见问题', link: '/faq' }
          ]
        }
      ],
      '/guide/': [
        {
          text: '基础指南',
          items: [
            { text: '功能特性', link: '/guide/features' },
            { text: '表格', link: '/guide/tables' },
            { text: '数据', link: '/guide/data' },
            { text: '列定义', link: '/guide/column-defs' },
            { text: '列', link: '/guide/columns' },
            { text: '行', link: '/guide/rows' },
            { text: '单元格', link: '/guide/cells' },
            { text: '头部', link: '/guide/headers' },
            { text: '头部分组', link: '/guide/header-groups' }
          ]
        },
        {
          text: '功能指南',
          items: [
            { text: '列排序', link: '/guide/sorting' },
            { text: '列过滤', link: '/guide/column-filtering' },
            { text: '全局过滤', link: '/guide/global-filtering' },
            { text: '模糊过滤', link: '/guide/fuzzy-filtering' },
            { text: '过滤器', link: '/guide/filters' },
            { text: '列分面', link: '/guide/column-faceting' },
            { text: '全局分面', link: '/guide/global-faceting' },
            { text: '分页', link: '/guide/pagination' },
            { text: '行选择', link: '/guide/row-selection' },
            { text: '行展开', link: '/guide/expanding' },
            { text: '分组', link: '/guide/grouping' },
            { text: '列可见性', link: '/guide/column-visibility' },
            { text: '列排序', link: '/guide/column-ordering' },
            { text: '列固定', link: '/guide/column-pinning' },
            { text: '行固定', link: '/guide/row-pinning' },
            { text: '固定', link: '/guide/pinning' },
            { text: '列大小调整', link: '/guide/column-sizing' },
            { text: '虚拟化', link: '/guide/virtualization' }
          ]
        },
        {
          text: '高级指南',
          items: [
            { text: '行模型', link: '/guide/row-models' },
            { text: '自定义功能', link: '/guide/custom-features' },
            { text: '迁移指南', link: '/guide/migrating' }
          ]
        }
      ],
      '/api/': [
        {
          text: '核心 API',
          items: [
            { text: '表格', link: '/api/core/table' },
            { text: '列定义', link: '/api/core/column-def' },
            { text: '列', link: '/api/core/column' },
            { text: '行', link: '/api/core/row' },
            { text: '单元格', link: '/api/core/cell' },
            { text: '表头组', link: '/api/core/header-group' },
            { text: '表头', link: '/api/core/header' }
          ]
        },
        {
          text: '功能 API',
          items: [
            { text: '列过滤', link: '/api/features/column-filtering' },
            { text: '列分面', link: '/api/features/column-faceting' },
            { text: '列排序', link: '/api/features/column-ordering' },
            { text: '列固定', link: '/api/features/column-pinning' },
            { text: '列大小调整', link: '/api/features/column-sizing' },
            { text: '列可见性', link: '/api/features/column-visibility' },
            { text: '全局分面', link: '/api/features/global-faceting' },
            { text: '全局过滤', link: '/api/features/global-filtering' },
            { text: '排序', link: '/api/features/sorting' },
            { text: '分组', link: '/api/features/grouping' },
            { text: '展开', link: '/api/features/expanding' },
            { text: '分页', link: '/api/features/pagination' },
            { text: '固定', link: '/api/features/pinning' },
            { text: '过滤器', link: '/api/features/filters' },
            { text: '行固定', link: '/api/features/row-pinning' },
            { text: '行选择', link: '/api/features/row-selection' }
          ]
        }
      ],
      '/framework/': [
        {
          text: '框架集成',
          items: [
            {
              text: 'React',
             
              items: [
                { text: 'React Table', link: '/framework/react/react-table' },
                { text: '表格状态', link: '/framework/react/guide/table-state' }
              ]
            },
            {
              text: 'Vue',
            
              items: [
                { text: 'Vue Table', link: '/framework/vue/vue-table' },
                { text: '表格状态', link: '/framework/vue/guide/table-state' }
              ]
            },
            {
              text: 'Angular',
            
              items: [
                { text: 'Angular Table', link: '/framework/angular/angular-table' },
                { text: '表格状态', link: '/framework/angular/guide/table-state' }
              ]
            },
            {
              text: 'Svelte',
              link: '/framework/svelte/svelte-table',
              items: [
                { text: 'Svelte Table', link: '/framework/svelte/svelte-table' },
                { text: '表格状态', link: '/framework/svelte/guide/table-state' }
              ]
            },
            {
              text: 'Solid',
              link: '/framework/solid/solid-table',
              items: [
                { text: 'Solid Table', link: '/framework/solid/solid-table' },
                { text: '表格状态', link: '/framework/solid/guide/table-state' }
              ]
            },
            {
              text: 'Qwik',
             
              items: [
                { text: 'Qwik Table', link: '/framework/qwik/qwik-table' },
                { text: '表格状态', link: '/framework/qwik/guide/table-state' }
              ]
            },
            {
              text: 'Lit',
             
              items: [
                { text: 'Lit Table', link: '/framework/lit/lit-table' },
                { text: '表格状态', link: '/framework/lit/guide/table-state' }
              ]
            }
          ]
        }
      ],
      '/enterprise/': [
        {
          text: '企业版',
          items: [
            { text: 'AG Grid', link: '/enterprise/ag-grid' }
          ]
        }
      ]
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/TanStack/table',
      },
    ],
    footer: {
       message: 'Released under the MIT License. Copyright © 2024 TanStack'
     },
     search: true,
    editLink: {
      docRepoBaseUrl: 'https://github.com/TanStack/table/tree/main/docs',
      text: '在 GitHub 上编辑此页'
    },
    outlineTitle: '页面导航'
  },
});
