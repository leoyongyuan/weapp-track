# weapp-track 埋点

## 使用方法

### npm 包引入

安装
```js
npm i weapp-track
```

在 App.js 文件中
```js
import Tracker from './weapp-track.js';
const track = new Tracker();

```

### 脚本插件引入

```ts
import Tracker from './weapp-track.js';

const trackConig = {
  path: 'pages/index/index', // 需要劫持的页面
  elementTracks: [            // 劫持 DOM 元素
    {
      element: '.nickname-label',
      dataKeys: ["motto"],   // 数据 key
    },
  ],
  methodTracks: [          // 劫持 Page 页面下 methods 函数
    {
      method: 'testTrack',
      dataKeys: ['motto', '$DATASET.test'],
    }
  ],
  comMethodTracks: [       // 劫持 Component 组件下 methods 函数
    {
      method: 'testTrack',
      dataKeys: ['motto', '$DATASET.test'], 
    }
  ],
}

const track = new Tracker({ tracks: [trackConig]  });
```

### 在项目中引入

```xml
// 在 wxml 最上层插入元素
<view catchtap='elementTracker'>
  // 其他元素
  <view class="container"></view>
</view>
```
