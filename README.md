# json-to-canvas

## Install
```shell
npm i json-to-canvas
# or
yarn add json-to-canvas
```

## how to use

```typescript
import json2canvas, { ISourceObject, ISourceArray} from 'json-to-canvas';

// 之前的传递方法
const sourceObj:ISourceObject = {
    images: [], // 绘制图片
    texts: [], // 绘制文本
    roundRects: [] // 绘制圆角矩形
};

json2canvas({width:300, height:400}, 2, sourceObj)
    .then(res=>{
        console.log(res.url);
    })
    .catch(err=>{
        console.error(err);
    })

/* ------------------------- */

// 传递数据，绘制层级根据数组下标
const sourceArray:ISourceArray[] = [
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
