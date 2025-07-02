---
title: Angular Table
---

`@tanstack/angular-table` 适配器是对核心表格逻辑的包装器。它的主要工作是以 "Angular 信号" 的方式管理状态，提供类型以及单元格/标题/页脚模板的渲染实现。

## 导出

`@tanstack/angular-table` 重新导出了 `@tanstack/table-core` 的所有 API 以及以下内容：

### `createAngularTable`

接受一个选项函数或返回表格选项的计算值，并返回一个表格。

```ts
import {createAngularTable} from '@tanstack/angular-table'

export class AppComponent {
  data = signal<Person[]>([])

  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  }))
}

// ...在模板中渲染您的表格

```

### `FlexRender`

一个用于渲染具有动态值的单元格/标题/页脚模板的 Angular 结构指令。

FlexRender 支持 Angular 支持的任何类型的内容：

- 字符串，或通过 `innerHTML` 的 HTML 字符串
- [TemplateRef](https://angular.dev/api/core/TemplateRef)
- 包装在 `FlexRenderComponent` 中的 [Component](https://angular.dev/api/core/Component)

您可以直接使用 `cell.renderValue` 或 `cell.getValue` API 来渲染表格的单元格。但是，这些 API 只会输出原始单元格值（来自访问器函数）。如果您使用 `cell: () => any` 列定义选项，您将需要使用适配器中的 `FlexRenderDirective`。

单元格列定义是**响应式的**并在**注入上下文**中运行，然后您可以注入服务或使用信号来自动修改渲染的内容。

#### 示例

```ts
@Component({
  imports: [FlexRenderDirective],
  //...
})
class YourComponent {}
```

```angular-html

<tbody>
@for (row of table.getRowModel().rows; track row.id) {
  <tr>
    @for (cell of row.getVisibleCells(); track cell.id) {
      <td>
        <ng-container
          *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
        >
          <!-- 如果您想渲染一个简单的字符串 -->
          {{ cell }}
          <!-- 如果您想渲染一个 HTML 字符串 -->
          <div [innerHTML]="cell"></div>
        </ng-container>
      </td>
    }
  </tr>
}
</tbody>
```

#### 渲染组件

要将组件渲染到特定的列标题/单元格/页脚中，您可以传递一个用您的 `ComponentType` 实例化的 `FlexRenderComponent`，并能够包含输入、输出和自定义注入器等参数。

```ts
import {flexRenderComponent} from "./flex-render-component";
import {ChangeDetectionStrategy, input, output} from "@angular/core";

@Component({
  template: `
    ...
  `,
  standalone: true,
  changeDetectionStrategy: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'clickEvent.emit($event)'
  }
})
class CustomCell {
  readonly content = input.required<string>();
  readonly cellType = input<MyType>();

  // 一个将为每次单元格点击发出的输出
  readonly clickEvent = output<Event>();
}

class AppComponent {
  columns: ColumnDef<unknown>[] = [
    {
      id: 'custom-cell',
      header: () => {
        const translateService = inject(TranslateService);
        return translateService.translate('...');
      },
      cell: (context) => {
        return flexRenderComponent(
          MyCustomComponent,
          {
            injector, // 可选注入器
            inputs: {
              // 必需输入，因为我们使用 `input.required()`
              content: context.row.original.rowProperty,
              // cellType? - 可选输入
            },
            outputs: {
              clickEvent: () => {
                // 做一些事情
              }
            }
          }
        )
      },
    },
  ]
}
```

在底层，这利用了 [ViewContainerRef#createComponent](https://angular.dev/api/core/ViewContainerRef#createComponent) API。因此，您应该使用 @Input 装饰器或 input/model 信号来声明您的自定义输入。

您仍然可以通过 `injectFlexRenderContext` 函数访问表格单元格上下文，该函数根据您传递给 `FlexRenderDirective` 的 props 返回上下文值。

```ts

@Component({
  // ...
})
class CustomCellComponent {
  // 单元格组件的上下文
  readonly context = injectFlexRenderContext<CellContext<TData, TValue>>();
  // 标题/页脚组件的上下文
  readonly context = injectFlexRenderContext<HeaderContext<TData, TValue>>();
}
```

或者，您可以通过将组件类型传递给相应的列定义，将组件渲染到特定的列标题、单元格或页脚中。这些列定义将与 `context` 一起提供给 `flexRender` 指令。

```ts
class AppComponent {
  columns: ColumnDef<Person>[] = [
    {
      id: 'select',
      header: () => TableHeadSelectionComponent<Person>,
      cell: () => TableRowSelectionComponent<Person>,
    },
  ]
}
```

```angular-html
<ng-container
  *flexRender="
    header.column.columnDef.header;
    props: header.getContext();
    let headerCell
  "
>
  {{ headerCell }}
</ng-container>
```

在 `flexRender` 指令中提供的 `context` 属性将可供您的组件访问。您可以明确定义组件所需的上下文属性。在此示例中，提供给 flexRender 的上下文是 HeaderContext 类型。输入信号 `table`（它是 HeaderContext 的属性，与 `column` 和 `header` 属性一起）然后被定义为在组件中使用。如果您的组件需要任何上下文属性，请随时使用它们。请注意，使用这种方法时，只支持输入信号来定义对上下文属性的访问。

```angular-ts
@Component({
  template: `
    <input
      type="checkbox"
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="table().getIsSomeRowsSelected()"
      (change)="table().toggleAllRowsSelected()"
    />
  `,
  // ...
})
export class TableHeadSelectionComponent<T> {
  //column = input.required<Column<T, unknown>>()
  //header = input.required<Header<T, unknown>>()
  table = input.required<Table<T>>()
}
```

#### 渲染 TemplateRef

为了将 TemplateRef 渲染到特定的列标题/单元格/页脚中，您可以将 TemplateRef 传递到列定义中。

您可以通过 `$implicit` 属性访问 TemplateRef 数据，该属性的值基于在 flexRender 的 props 字段中传递的内容。

在大多数情况下，每个 TemplateRef 将使用基于单元格类型的 $implicit 上下文值进行渲染：

- Header: `HeaderContext<T, ?>`
- Cell: `CellContext<T, ?>`
- Footer: `HeaderContext<T, ?>`

```angular-html

<ng-container
  *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
>
  <!-- 如果您想渲染一个简单的字符串 -->
  {{ cell }}
  <!-- 如果您想渲染一个 HTML 字符串 -->
  <div [innerHTML]="cell"></div>
</ng-container>

<ng-template #myCell let-context>
  <!-- 使用上下文渲染一些内容 -->
</ng-template>
```

完整示例：

```angular-ts
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@tanstack/angular-table'
import {Component, TemplateRef, viewChild} from '@angular/core'

@Component({
  template: `
    <tbody>
      @for (row of table.getRowModel().rows; track row.id) {
        <tr>
          @for (cell of row.getVisibleCells(); track cell.id) {
            <td>
              <ng-container
                *flexRender="
                  cell.column.columnDef.cell;
                  props: cell.getContext(); // 提供给 TemplateRef 的数据
                  let cell
                "
              >
                <!-- 如果您想渲染一个简单的字符串 -->
                {{ cell }}
                <!-- 如果您想渲染一个 HTML 字符串 -->
                <div [innerHTML]="cell"></div>
              </ng-container>
            </td>
          }
        </tr>
      }
    </tbody>

    <ng-template #customHeader let-context>
      {{ context.getValue() }}
    </ng-template>
    <ng-template #customCell let-context>
      {{ context.getValue() }}
    </ng-template>
  `,
})
class AppComponent {
  customHeader =
    viewChild.required<TemplateRef<{ $implicit: HeaderContext<any, any> }>>(
      'customHeader'
    )
  customCell =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'customCell'
    )

  columns: ColumnDef<unknown>[] = [
    {
      id: 'customCell',
      header: () => this.customHeader(),
      cell: () => this.customCell(),
    },
  ]
}
```