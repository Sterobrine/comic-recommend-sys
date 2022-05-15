<template>
  <div class="home">
    <div class="rotate" id="rotate">
      <!-- <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in headItems" :key="item.index">
          <a :href="item.link" target="_blank"
            ><img :src="$baseImgUrl + 'head/' + item.index + '.png'" alt=""
          /></a>
        </el-carousel-item>
      </el-carousel> -->
      <el-carousel indicator-position="outside" :height="rotateHeight">
        <el-carousel-item v-for="item in headItems" :key="item.index">
          <a :href="item.link" target="_blank"
            ><img :src="$baseImgUrl + 'head/' + item.index + '.png'" alt=""
          /></a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <common-show-case
      :title="'总排行'"
      :cardList="allPopularMovieList"
      :seq="1"
    ></common-show-case>
    <common-show-case
      :title="'月排行'"
      :cardList="monthPopularMovieList"
      :seq="2"
    ></common-show-case>
    <div class="line"></div>
  </div>
</template>

<script>
import CommonShowCase from "@/components/CommonShowCase.vue";
import homeApi from "../../../api/home";
import elementResizeDetector from 'element-resize-detector';
export default {
  components: { CommonShowCase },
  name: "Home",
  data() {
    return {
      allPopularMovieList: [],
      monthPopularMovieList: [],
      headItems: [],
      rotateHeight:null
    };
  },
  mounted() {
    this.$store.commit('resetLoaded');
    let erd = elementResizeDetector();
    erd.listenTo(document.getElementById('rotate'),() => {
      this.$nextTick(() => {
        let width = this.rotateHeight = document.getElementById('rotate').clientWidth;
        this.rotateHeight = (width/1160*322).toString() + 'px';
      });
    })
    this.$store.commit("setMenuStyle", this.$route.name);
    homeApi
      .getAllPopular()
      .then((res) => {
        if (res.data.code === 200) {
          this.allPopularMovieList = res.data.list;
          return homeApi.getMonthPopular();
        }
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.monthPopularMovieList = res.data.list;
        }
      })
      .then(() => {
        return homeApi.getHead();
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.headItems = res.data.list;
        }
      });
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  min-height: 500px;
  .rotate {
    width: 100%;
    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }
    img {
      width: 100%;
    }
    .el-carousel__item:nth-child(2n) {
      background-color: #97999a;
    }
    .el-carousel__item:nth-child(2n + 1) {
      background-color: #e4e4e4;
    }
  }
  .line {
    width: 100%;
    height: 80px;
  }
}
</style>