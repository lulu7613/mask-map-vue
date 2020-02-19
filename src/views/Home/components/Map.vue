<template>
  <div id="map">
    <l-map
      :zoom="zoom"
      :center="center">
      <l-tile-layer :url="OSMUrl"></l-tile-layer>
      <l-marker :lat-lng="markerLatlng"></l-marker>
    </l-map>
  </div>
</template>

<script>
// import L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'appMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 18,
      center: [22.604799, 120.2976256],
      markerLatlng: [22.604799, 120.2976256],
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
      this.markerLatlng = this.center;
    });
    // TODO: 製作存取位置通知與存取失敗通知
  },
};
</script>
