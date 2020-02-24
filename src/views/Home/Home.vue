<template>
  <div id="home"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <aside>
      <app-switch
        class="drawerOpen"
        title="開啟選單"
        :switch="true"
        @actSwitch="actDrawer"></app-switch>
      <app-switch
        v-show="isDrawer"
        class="drawerClose"
        :style="{'left': drawerSize}"
        title="關閉選單"
        :switch="false"
        @actSwitch="actDrawer">
      </app-switch>
      <el-drawer
        id="controller"
        direction="ltr"
        :visible.sync="isDrawer"
        :show-close="false"
        :with-header="false"
        :size="drawerSize"
        :modal="false">
        <div class="infinite-list"  v-infinite-scroll="load">
          <el-row class="infinite-list-item">
            <el-col :span="15">
              <h1>口罩 速速前！</h1>
            </el-col>
            <el-col :span="9">
              <p class="info">資料來源: 衛服部</p>
              <p class="date">{{ date }}</p>
            </el-col>
          </el-row>

          <div class="controller-banner">
            <h3 class="week-day">星期{{ weekDate }}</h3>
            <p class="ID-num">{{ IDnum }}</p>
          </div>

          <div class="controller-search-form">
            <div>
              <p class="title">我要尋找</p>
              <div class="d-flex justify-content-between">
                <el-select class="controller-select"
                  @change="select.area = ''"
                  v-model="select.city"
                  placeholder="城市">
                  <el-option
                    v-for="city in cityData"
                    :key="city.CityName"
                    :label="city.CityName"
                    :value="city.CityName"></el-option>
                </el-select>
                <el-select class="controller-select"
                  @change="filterSelect()"
                  v-model="select.area"
                  placeholder="行政區"
                  v-if="select.city.length">
                  <el-option
                    v-for="area in cityData.find((city) => city.CityName === select.city).AreaList"
                    :key="area.AreaName"
                    :label="area.AreaName"
                    :value="area.AreaName"></el-option>
                </el-select>
                <el-select class="controller-select"
                  v-model="select.area" placeholder="行政區" v-else>
                  <el-option :value="0">請先選擇城市</el-option>
                </el-select>
              </div>
            </div>
            <div class="d-flex mask-type">
              <span class="name">類型:</span>
              <el-radio-group
                :fill="'#EF8A00'" text-color="'#EF8A00'"
                v-model="input.maskType">
                <el-radio
                  v-for="item in maskTypeRadio" :key="item"
                  :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </div>
            <div class="d-flex mask-type" style="margin-top: 5px">
              <span class="name">條件:</span>
              <el-radio-group
                :fill="'#EF8A00'" text-color="'#EF8A00'"
                v-model="input.filterType">
                <el-radio
                  v-for="item in filterTypeRadio" :key="item"
                  :label="item">{{ item }}</el-radio>
              </el-radio-group>
            </div>
          </div>

          <el-divider></el-divider>

          <el-row class="controller-search-filter"
            type="flex"
            justify="space-between"
            align="bottom">
            <el-col :span="12">
              <p class="title">尚有庫存店家</p>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row>

          <div v-if="filterList.length === 0" class="noData">
            {{ noDataText }}
          </div>

          <div class="controller-card"
            v-for="item in filterList" :key="item.properties.id">
            <el-row type="flex" justify="space-between">
              <el-col :span="19">
                <div>
                  <span class="card-title">{{ item.properties.name }}</span>
                </div>
              </el-col>
              <el-col class="card-icon" :span="5">
                <img
                  v-show="starData.every(i => i !== item.properties.id)"
                  @click="actStar(item.properties.id)"
                  src="@/assets/images/controller/icon_star_unselected.svg"
                  alt="icon_star_unselected">
                <img
                  v-show="starData.some(i => i === item.properties.id)"
                  @click="actStar(item.properties.id)"
                  src="@/assets/images/controller/icon_star_selected.svg"
                  alt="icon_star_unselected">
                <img
                  @click="penTo(item.geometry.coordinates)"
                  src="@/assets/images/controller/icon_nav.svg"
                  alt="icon_nav">
              </el-col>
            </el-row>
            <div class="card-content">
              <p class="card-text">
                <i class="el-icon-s-home"></i>
                {{ item.properties.address }}
              </p>
              <p class="card-text">
                <i class="el-icon-phone"></i>
                {{ item.properties.phone }}
              </p>
              <p class="card-text tip">提醒：{{ item.properties.note }}</p>
            </div>
            <el-row class="card-mask" type="flex" justify="space-between" :gutter="10">
              <el-col :span="12">
                <div class="mask-show bg-primary">
                  <span class="type">成人</span>
                  <span class="num">{{ item.properties.mask_adult }}</span>
                </div>
              </el-col>
              <el-col :span="12">
              <div class="mask-show bg-success">
                <span class="type">兒童</span>
                <span class="num">{{ item.properties.mask_child }}</span>
              </div>
              </el-col>
            </el-row>
            <p class="update-time">{{ item.properties.updated }}更新</p>
          </div>
        </div>
      </el-drawer>
    </aside>
    <div class="now-position-icon" @click="userPosition()">
      <i class="el-icon-place"></i>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet.markercluster';
import ICON from '@/leaflet/icon';
import openData from '@/api/api';
import cityData from '@/assets/json/TaiwanCity.json';
import AppSwitch from '@/components/Switch.vue';

export default {
  name: 'Home',
  components: {
    AppSwitch,
  },
  data() {
    return {
      loading: false,
      isDrawer: false,
      baseShowCardListLen: 2,
      RWD_WIDTH: {
        SMALL: 360,
        MIDDLE: 768,
      },
      clientWidth: 0,
      date: '',
      weekDate: '',
      IDnum: '',
      maskTypeRadio: ['全部口罩', '成人', '兒童'],
      filterTypeRadio: ['依行政區', '依星號'],
      input: {
        maskType: '全部口罩',
        filterType: '依行政區',
      },
      select: {
        city: '',
        area: '',
      },
      noDataText: '',
      cityData,
      openDataList: [],
      selectData: [],
      filterData: [],
      starData: JSON.parse(localStorage.getItem('mask-map-star-data')) || [],

      map: {},
      zoom: 18,
      center: [],
      OSMUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    };
  },
  watch: {
    clientWidth() {
      window.onresize = () => {
        this.filterData = [];
        this.clientWidth = window.innerWidth;
      };
    },
    input: { // 使用 deep 監控 input 中的屬性變化
      handler() {
        this.getMaskData();
      },
      immediate: true,
      deep: true,
    },
    filterList() {
      const vm = this;
      let text = vm.noDataText;
      if (vm.input.filterType === '依行政區' && !vm.select.area) {
        text = '安安，先選擇城市和行政區哦~';
      } else if (vm.input.filterType === '依行政區') {
        text = '暫時沒有口罩販售點。';
      } else if (vm.input.filterType === '依星號') {
        text = '安安，你還沒有標記星號的地點哦~';
      }
      this.noDataText = text;
    },
  },
  computed: {
    drawerSize() {
      const cw = this.clientWidth;
      const width = this.RWD_WIDTH;
      let result = 0;
      if (cw < width.SMALL) {
        result = '290px';
      } else if (cw > width.SMALL && cw < width.MIDDLE) {
        result = '340px';
      } else {
        result = '400px';
      }
      return result;
    },

    filterList() {
      const data = this.filterData;
      const len = this.baseShowCardListLen;
      return data.filter((i, k) => k < len);
    },
  },
  methods: {
    actDrawer(boolean) {
      this.baseShowCardListLen = 2; // TODO 解決無法關閉controller就重置
      this.isDrawer = boolean;
    },
    getBannerInfo() {
      const date = new Date();
      const day = date.getDay();
      const week = ['一', '二', '三', '四', '五', '六', '日'];

      this.weekDate = week.find((i, k) => k === day - 1);
      this.date = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      this.IDnum = day % 2 === 0 ? '2.4.6.8.0' : '1.3.5.7.9';
    },
    apiGetOpenData() {
      this.loading = true;
      openData().then((response) => {
        this.openDataList = response.data.features;
        this.loading = false;
        this.setMarkers();
      });
    },
    load() {
      this.baseShowCardListLen += 2;
    },
    filterSelect() {
      const { city, area } = this.select;
      const data = this.openDataList;

      this.selectData = data.filter(
        (p) => p.properties.county === city && p.properties.town === area,
      );
      this.getMaskData();
    },
    getMaskData() {
      const vm = this;

      if (!vm.input.filterType === '依行政區') return false;

      let result = [];
      const star = vm.starData;
      const mask = vm.getMaskType(vm.selectData); // 取得口罩類型
      const type = vm.input.filterType; // 取得搜尋條件

      function sortData(arr) { // 排序
        return arr.sort((a, b) => b.properties[mask.type] - a.properties[mask.type]);
      }

      switch (type) {
        case '依星號':
          // eslint-disable-next-line no-case-declarations
          const data = this.openDataList.filter((item) => star.includes(item.properties.id));
          result = sortData(data);
          break;

        default:
          result = sortData(mask.arr);
          break;
      }
      this.filterData = result;
      return this.filterData;
    },
    getMaskType(data) {
      let arr = '';
      let type = 'mask_adult';

      switch (this.input.maskType) {
        case '成人':
          type = 'mask_adul';
          arr = data.filter((i) => i.properties.mask_adult > 0);
          break;
        case '兒童':
          type = 'mask_child';
          arr = data.filter((i) => i.properties.mask_child > 0);
          break;
        default: arr = data;
          break;
      }
      return { type, arr };
    },
    actStar(id) {
      const data = this.starData;
      const index = data.indexOf(id);

      if (index === -1) {
        data.push(id);
      } else {
        data.splice(index, 1);
      }

      localStorage.setItem('mask-map-star-data', JSON.stringify(data));
    },
    getMap(position) {
      // 定位
      this.center = [position.coords.latitude, position.coords.longitude];
      console.log(this.center);
      this.map = L.map('map').setView(this.center, this.zoom);

      // 圖資設定
      L.tileLayer(this.OSMUrl, {
        attribution: '作者: LuU 昀芷 | UI 參考: https://reurl.cc/oDlokQ',
      }).addTo(this.map);
    },
    setMarkers(type = 'mask_adult') {
      /* eslint-disable global-require */
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
      /* eslint-enable global-require */
    },
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
  },
  mounted() {
    this.clientWidth = window.innerWidth;
    this.getBannerInfo();

    if (navigator.geolocation) {
      this.apiGetOpenData();
      navigator.geolocation.getCurrentPosition(this.getMap);
      // TODO: 製作存取位置通知與存取失敗通知
    } else {
      alert('你的瀏覽器不允許存取所在位置');
      this.apiGetOpenData();
      this.center = [24.087, 120.694];
    }
  },
};
</script>
