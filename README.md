# json-to-canvas

## 安装

```shell
npm i json-to-canvas
# or
yarn add json-to-canvas
```

## 使用

```typescript
import { json2canvas, SourceItemType } from 'json-to-canvas';
import type { Json2canvasSource } from 'json-to-canvas';

// 传递数据，绘制层级根据数组下标
const sourceArray: Json2canvasSource[] = [
    {
        type: SourceItemType.Image,
        // ...imageProps
    },
    {
        type: SourceItemType.Text,
        // ...textProps
    },
    {
        type: SourceItemType.RoundRect,
        // ...roundRectProps
    },
    {
        type: SourceItemType.Extra,
        // 只有一个 callback 返回 ctx
    }
]

json2canvas({
    canvasProps: { width: 300, height: 400 },
    scale:2,
    source:sourceArray
})
    .then(url => {
        console.log(url);
    })
    .catch(err => {
        console.error(err);
    })
```

## API

| api | 描述 | 类型 |
| :---- | :---- | :---- |
| `json2canvas` | 通过参数获得画图数据 | (props: IJson2canvasProps) => Promise<string> |
| `getTextHeight` | 获取多行文本的高度 | (ctx: CanvasRenderingContext2D, props: ITextAutoBreakProps) => number |
| `loadImage` | 加载图片 | (url: string) => Promise<HTMLImageElement> |
| `drawRoundRectPath` | 绘制圆角矩形路径 | (ctx: CanvasRenderingContext2D, props: Omit<IRoundRectType, 'x' &#124; 'y' &#124; 'backgroundColor' &#124; 'callback' &#124; 'type'>) => void |
| `fillRoundRect` | 填充圆角矩形 | (ctx: CanvasRenderingContext2D, props: Omit<IRoundRectType, 'callback' &#124; 'type'>) => void |

## 更新

> 2021年7月23日

- 废弃了之前的object传入`sourceArray`的方式
- 现在所有的 `callback` 返回的参数，都是通过 `scale` 计算过的了
- 优化了代码结构
- 修改了 `json2canvas` 的返回值, `Promise<{url: string}>` =>>> `Promise<string>`
- 增加了 `getTextHeight` 方法，以获取多行文本的高度
- 增加了 `loadImage` 方法


> 2021年7月26日

- 更新 md 文档

> 2021年08月18日

- 优化图片跨域

> 2021年09月03日 (v1.0.4)

- 图片加载失败之后，继续绘制，跳过当前失败

> 2021年09月28日 (v1.0.7)

- 使用 `rollup` 进行打包编译
- 优化打包后的产物，减小体积

> 2021年09月30日 (v1.0.8)

- 重构代码结构

> 2021年11月01日 (v1.0.9)

- 导出画圆角矩形方法 `drawRoundRectPath`

> 2021年11月02日 (v1.1.0)

- 增加画圆角图片 `ImageName.RoundImage`
