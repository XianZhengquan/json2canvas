# json-to-canvas

## 安装

```shell
npm i json-to-canvas
# or
yarn add json-to-canvas
```

## 使用

```typescript
import json2canvas, { Json2canvasSource, SourceItemType } from 'json-to-canvas';

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

## 更新

> 2021年7月23日

- 废弃了之前的object传入`sourceArray`的方式
- 现在所有的 `callback` 返回的参数，都是通过 `scale` 计算过的了
- 优化了代码结构
- 修改了 `json2canvas` 的返回值, `Promise<{url: string}>` =>>> `Promise<string>`
- 增加了 `getTextHeight` 方法，以获取多行文本的高度


> 2021年7月26日

- 更新 md 文档


> 2021年08月18日

- 优化图片跨域

> 2021年09月03日

- 图片加载失败之后，继续绘制，跳过当前失败
