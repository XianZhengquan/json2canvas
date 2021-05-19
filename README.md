# json2canvas

## Install
```shell
npm i json2canvas
# or
yarn add json2canvas
```

## how to use

```typescript
import json2canvas from 'json2canvas';

json2canvas({width:300, height:400}, 2, {images:[], texts:[]})
.then(res=>{
    console.log(res.url);
})
.catch(err=>{
    console.error(err);
})
```
