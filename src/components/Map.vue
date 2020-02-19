<template>
  <div id="map">
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet.markercluster';

export default {
  name: 'appMap',
  props: {
    clickPosition: {
      type: Array,
      default: null,
    },
    mapData: {
      type: Array,
      dafault: [],
    },
  },
  data() {
    return {
      zoom: 18,
      center: [],
      OSMUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  },
  methods: {
    getMap(position) {
      // 定位
      this.center = [position.coords.latitude, position.coords.longitude];
      const map = L.map('map', {
        center: this.center,
        zoom: this.zoom,
      });

      // 圖資設定
      L.tileLayer(this.OSMUrl, {
        attribution: '作者: LuU 昀芷 | UI 參考: https://reurl.cc/oDlokQ',
      }).addTo(map);

      // 新增圖層，專放 icon 組，減低效能
      const markers = new L.MarkerClusterGroup().addTo(map);

      // icon 設定
      const greenIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // 每個點加上 marker
      const vm = this;
      vm.mapData.forEach((item) => {
        markers.addLayer(
          L.marker(
            [item.geometry.coordinates[1], item.geometry.coordinates[0]],
            { icon: greenIcon },
          // ).bindPopup(
          //   '',
          ),
        );
      });
      map.addLayer(markers);
    },
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getMap);
      // TODO: 製作存取位置通知與存取失敗通知
    } else {
      alert('你的瀏覽器不允許存取所在位置');
    }
  },
};
</script>
