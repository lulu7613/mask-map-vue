<template>
  <div id="home">
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
      @actSwitch="actDrawer"></app-switch>
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
            <h1>測試測試測試</h1>
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
            <p class="title">現在位置</p>
            <el-input type="text" v-model="input.nowPosition">
              <img
                class="search-icon"
                slot="suffix"
                @click="getMaskData()"
                src="~@/assets/images/controller/icon_search.svg">
            </el-input>
          </div>
          <el-radio-group
            :fill="'#EF8A00'"
            v-model="input.maskType" style="margin-top: 1rem; text-align: center;">
            <el-radio-button
              style="width: 31.333%;"
              v-for="item in searchBtnList" :key="item"
              :label="item"></el-radio-button>
          </el-radio-group>
        </div>

        <el-divider></el-divider>

        <el-row type="flex" class="controller-search-filter" justify="space-between" align="bottom">
          <el-col :span="8">
            <p class="title">尚有庫存店家</p>
          </el-col>
          <el-col :span="16">
            <el-checkbox-group
              :fill="'#EF8A00'" v-model="input.filterType" size="mini" style="text-align: right;">
              <el-checkbox-button
                v-for="item in maphBtnList" :key="item.name"
                :label="item.id">{{ item.name }}</el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-row>

        <div class="controller-card"
          v-for="item in filterList" :key="item.properties.id">
          <el-row type="flex" justify="space-between">
            <el-col :span="19">
              <div>
                <span class="card-title">{{ item.properties.name }}</span>
                <!-- <span class="card-text">10km*</span> -->
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
                src="@/assets/images/controller/icon_nav.svg"
                alt="icon_nav">
            </el-col>
          </el-row>
          <div class="card-content">
            <p class="card-text">距離約 10km* </p>
            <p class="card-text">{{ item.properties.address }}</p>
            <p class="card-text">+886 {{ item.properties.phone }}</p>
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
  </div>
</template>

<script>
import openData from '@/api/api';
import AppSwitch from './components/Switch.vue';

export default {
  name: 'Home',
  components: {
    AppSwitch,
  },
  data() {
    return {
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
      searchBtnList: ['所有口罩', '成人口罩', '兒童口罩'],
      maphBtnList: [
        { name: '距離最近', id: 1 },
        { name: '庫存最多', id: 3 },
        { name: '已標星號', id: 5 },
      ],
      input: {
        nowPosition: '',
        maskType: '所有口罩',
        filterType: [3],
      },
      openDataList: [],
      filterData: [],
      starData: JSON.parse(localStorage.getItem('mask-map-star-data')) || [],
    };
  },
  watch: {
    clientWidth() {
      window.onresize = () => {
        this.clientWidth = window.innerWidth;
      };
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
        result = '560px';
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
      openData().then((response) => {
        this.openDataList = response.data.features;
        this.getMaskData();
      });
    },
    load() {
      this.baseShowCardListLen += 2;
    },
    getMaskData() {
      const vm = this;
      let data = [];
      const star = vm.starData;
      const mask = vm.getMaskType(); // 取得口罩類型
      const type = vm.input.filterType.reduce((a, b) => a + b, 0); // 取得搜尋項目

      const filterType = {
        DIS: 1, // 距離
        AMOUNT: 3, // 庫存
        STAR: 5, // 星號
        DIS_AMOUNT: 4, // 距離+庫存
        DIS_STAR: 6, // 距離+星號
        AMOUNT_STAR: 8, // 庫存+星號
        ALL: 9, // 庫存+星號+距離
      };

      function amount(arr) { // 庫存最多
        return arr.sort((a, b) => b.properties[mask.type] - a.properties[mask.type]);
      }
      function stars(arr) { // 已標星號
        return arr.filter((item) => star.includes(item.properties.id));
      }

      switch (type) {
        case filterType.AMOUNT:
          vm.filterData = amount(mask.arr);
          break;

        case filterType.STAR:
          vm.filterData = stars(mask.arr);
          break;

        case filterType.AMOUNT_STAR:
          data = amount(mask.arr);
          vm.filterData = stars(data);
          break;

        default:
          break;
      }
      // TODO: 加入 '距離最近' 和 '現在位置' 的方法
    },
    getMaskType() {
      const data = this.openDataList;
      let arr = '';
      let type = 'mask_adult';

      switch (this.input.maskType) {
        case '成人口罩':
          type = 'mask_adul';
          arr = data.filter((i) => i.properties.mask_adult > 0);
          break;
        case '兒童口罩':
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
  },
  created() {
    this.clientWidth = window.innerWidth;
    this.getBannerInfo();
    this.apiGetOpenData();
  },
};
</script>
