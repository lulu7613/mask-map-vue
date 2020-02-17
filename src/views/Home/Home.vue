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
            <el-input type="text" v-model="nowPosition" size="small">
              <img
                class="search-icon"
                slot="suffix"
                src="~@/assets/images/controller/icon_search.svg">
            </el-input>
          </div>
          <el-radio-group
            :fill="'#EF8A00'" v-model="maskType" style="margin-top: 1rem;text-align: center;">
            <el-radio-button
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
            <el-radio-group
              :fill="'#EF8A00'" v-model="mapType" size="mini" style="text-align: center;">
              <el-radio-button
                v-for="item in maphBtnList" :key="item"
                :label="item"></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <div class="controller-card"
          v-for="item in filterList" :key="item.properties.id">
          <el-row type="flex" justify="space-between">
            <el-col :span="19">
              <div>
                <span class="card-title">{{ item.properties.name }}</span>
                <span class="card-text">10km*</span>
              </div>
            </el-col>
            <el-col class="card-icon" :span="5">
              <img
                src="@/assets/images/controller/icon_star_unselected.svg"
                alt="icon_star_unselected">
              <img
                src="@/assets/images/controller/icon_nav.svg"
                alt="icon_nav">
            </el-col>
          </el-row>
          <div class="card-content">
            <p class="card-text">{{ item.properties.address }}</p>
            <p class="card-text">+886 {{ item.properties.phone }}</p>
            <!-- <p class="card-text">營業時間: {{ item.properties.available }}</p> -->
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
          <p class="update-time">2020/02/08 23:00:00 更新*</p>
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
      nowPosition: '',
      searchBtnList: ['所有口罩', '成人口罩', '兒童口罩'],
      maphBtnList: ['距離最近', '庫存最多', '已標星號'],
      maskType: '所有口罩',
      mapType: '距離最近',
      openDataList: [],
    };
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
      const data = this.openDataList;
      const len = this.baseShowCardListLen;
      const filterData = data.filter((i, k) => k < len);

      return filterData;
    },

  },
  methods: {
    actDrawer(boolean) {
      this.isDrawer = boolean;
      this.baseShowCardListLen = 2;
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
      });
    },
    load() {
      this.baseShowCardListLen += 2;
    },
  },
  created() {
    window.onresize = () => {
      this.clientWidth = window.innerWidth;
    };
    this.getBannerInfo();
    this.apiGetOpenData();
  },
};
</script>
