<template>
  <div id="map">
    <l-map
      :zoom="zoom"
      :center="center">
      <l-tile-layer :url="OSMUrl"></l-tile-layer>
    </l-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
import { LMap, LTileLayer } from 'vue2-leaflet';

export default {
  name: 'appMap',
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 18,
      center: [22.604799, 120.2976256],
      OSMUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  },
  created() {
    // 存取當前位置
    if (!navigator.geolocation) {
      alert('你的瀏覽器不允許存取所在位置');
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = [position.coords.latitude, position.coords.longitude];
    });
    // TODO: 製作存取位置通知與存取失敗通知
  },
};
</script>
