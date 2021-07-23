# json-to-canvas

## Install
```shell
npm i json-to-canvas
# or
yarn add json-to-canvas
```

## how to use

```typescript
import json2canvas, { Json2canvasSource } from 'json-to-canvas';

// 传递数据，绘制层级根据数组下标
const sourceArray:Json2canvasSource[] = [
    {
        type:'image',
        // ...imageProps
    },
    {
        type:'text',
        // ...textProps
    },
    {
        type:'round-rect',
        // ...roundRectProps
    }
]

json2canvas({width:300, height:400}, 2, sourceArray)
    .then(res=>{
        console.log(res.url);
    })
    .catch(err=>{
        console.error(err);
    })

```

## 更新
> 2021年7月23日
- 废弃了之前的object传入`sourceArray`的方式
- 现在所有的 `callback` 返回的参数，都是通过 `scale` 计算过的了
- 优化了代码结构
- 修改了 `json2canvas` 的返回值, `Promise<{url: string}>` =>>> `Promise<string>`
- 增加了 `getTextHeight` 方法，以获取多行文本的高度
