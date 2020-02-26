# mask-map [口罩 速速前!](https://mask-map-vue.herokuapp.com/)

### 前端畫面

![前端畫面預覽](https://imgur.com/qzpJ2Zz.png)

### 雲端伺服器

- heroku

### UI 設計稿

- 引用 Christy 設計師的作品

- [設計稿連結](https://challenge.thef2e.com/user/3509?schedule=4438#works-4438)

- 搜尋部分無法將目前位置的坐標與地址做關聯，將輸入地址搜尋的方式改為搜尋城市和行政區。

### 插件

- element-ui

- leaflet (地圖插件)

- leaflet.markercluster

- openStreetMap

- [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)

- axios

# 功能

- 顯示全台灣的口罩販售地點

- 定位當前位置，把地圖移至相對位置

- 左側 side 可搜尋城市、行政區，點擊藥局地圖會移至相對位置，並彈跳出視窗

- 搜尋條件分為 1.依行政區 2.依星號

# 心得

- 學習 HTML5 Geolocation 來辨識目前位置

- leaflet 要寫在 mounted()，寫在 created() 會抓不到資料

- 官方給的 openData，藥局的坐標陣列套入 latlng 要反過來

# leaflet

``` bash
# 安裝
yarn add leaflet
```
``` javaScript
// Home.vue
import L from 'leaflet';
import 'leaflet.markercluster';

```

**注意: 用 yarn / node 安裝，CSS 引入會有問題，因此 CSS 改用 cdn 方式引入**
``` html
<link rel="stylesheet" href="//unpkg.com/leaflet/dist/leaflet.css" />
```

- 關於 leaflet.markercluster。
一款 leaflet 延伸的插件，以此款專案為例，分區塊顯示 marker，避免一次顯示 6 千多筆 marker 拉低效能，
使用 cdn 方式引入。
``` html
<link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css"></link> 
<link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css"></link> 
```

- 關於 leaflet-color-markers
專為 leaflet 設計的各種圖標。

## 一、 Html 綁定 id
``` html
<div id="map"><div>
```

## 二、 CSS 設定寬高
``` scss
#home{
  width: 100%;
  height: 100vh;
}
#map {
  height: 100%;
}
```

## 三、 JavaScript 語法設定

### 1. 使用 HTML5 Geolocation 來辨識目前位置

[MDN](https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation/Using_geolocation)
``` JavaScript
  // 一定要寫在 mounted 裡
  // 先判斷目前瀏覽器支不支援定位功能
  if (navigator.geolocation) {
    this.apiGetOpenData();
    navigator.geolocation.getCurrentPosition(this.getMap, showError);
  } else {
    alert('你的瀏覽器不允許存取所在位置');
    this.apiGetOpenData();
    this.center = [24.087, 120.694];
  }

  // methods
  getMap(position) {
  // 定位
  this.center = [position.coords.latitude, position.coords.longitude];
  this.map = L.map('map').setView(this.center, this.zoom);

  // 圖資設定
  L.tileLayer(this.OSMUrl, {
    attribution: '作者: LuU 昀芷 | UI 參考: https://reurl.cc/oDlokQ',
  }).addTo(this.map);
},
```

### 2. 定位 marker

建立 L.MarkerClusterGroup() 的圖層。
先用 axios 引入全台藥局 data，取完資料再定位 marker。
``` JavaScript
// methods
  apiGetOpenData() {
    this.loading = true;
    openData().then((response) => {
      this.openDataList = response.data.features;
      this.loading = false;
      this.setMarkers();
    });
  },

  setMarkers(type = 'mask_adult') {
    const vm = this;
    const markers = new L.MarkerClusterGroup().addTo(this.map); // 新增圖層，專放 icon 組，減低效能

    L.marker(vm.center, { icon: ICON.Red }).addTo(this.map) // 所在位置
      .bindPopup('<p class="mark_position">媽我在這！</p>')
      .openPopup();

    vm.openDataList.forEach((item) => { // 每個點加上 marker
      const icon = item.properties[type] > 0 ? ICON.Green : ICON.Grey;
      const latlng = [item.geometry.coordinates[1], item.geometry.coordinates[0]];
      markers.addLayer(
        L.marker(
          latlng,
          { icon },
        ).bindPopup(`
          <div id="marker_box">
            <h6 class="marker_title">${item.properties.name}</h6>
            <p class="text">${item.properties.phone}</p>
            <p class="text">
              <a href="https://www.google.com.tw/maps/place/${item.properties.address}" target="_blank">
                ${item.properties.address}
              </a>
            </p>
            <div class="marker-mask d-flex justify-content-between">
              <div class="mask-show bg-primary">
                <span class="type">成人</span>
                <span class="num">${item.properties.mask_adult}</span>
              </div>
              <div class="mask-show bg-success">
                <span class="type">兒童</span>
                <span class="num">${item.properties.mask_child}</span>
              </div>
            </div>
          </div>
        `),
      );
    });
    this.map.addLayer(markers);
  },
```

### 點擊藥局地圖跳至相對位置，並彈出視窗
使用 leaflet API penTo()。
透過 map.eachLayer 比對圖層。
```` JavaScript
// methods
penTo(position) {
  this.isDrawer = false;
  this.map.panTo([position[1], position[0]]); // 前往座標位置
  this.map.eachLayer((layer) => {
    // eslint-disable-next-line no-underscore-dangle
    const latlng = { ...layer._latlng }; // 因無法直接讀取 latlng 裡的資料，使用解構取物件
    // eslint-disable-next-line no-underscore-dangle
    if (latlng.lat === position[1] && latlng.lng === position[0]) {
      layer.openPopup();
    }
  });
},
````

### 返回目前位置

這段程式要放在 showPosition 的函式中，在執行 navigator.geolocation 後，目前位置的座標會存在這個函式中。
再使用一次 setView 找回中心點。
``` JavaScript
// methods
userPosition() {
  console.log('我的位置');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = [position.coords.latitude, position.coords.longitude];
      this.map.setView(this.center, this.zoom);
    });
  } else {
    alert('你的瀏覽器不允許存取所在位置');
    this.center = [24.087, 120.694];
  }
},
```


## SASS / CSS

SASS 用 id 區分，每個 id 以不同的 .scss 檔分類。
可改善的地方：修改 element-ui 主色可以學習用官方提供的更改顏色方式，引入進專案。
