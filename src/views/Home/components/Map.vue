<template>
  <div id="map">
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'appMap',
  data() {
    return {
      zoom: 18,
      center: [],
      markerLatlng: [],
      OSMUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  },
  methods: {
    getMap(position) {
      this.center = [position.coords.latitude, position.coords.longitude];
      const map = L.map('map', {
        center: this.center,
        zoom: this.zoom,
      });

      L.tileLayer(this.OSMUrl, {
        attribution: '作者: LuU 昀芷 | UI 參考: https://reurl.cc/oDlokQ',
      }).addTo(map);
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
