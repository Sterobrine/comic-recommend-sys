<template>
  <div class="recommand">
    <div class="tip" v-if="title">
      <span>{{ title }}</span>
    </div>
    <div class="movie-cards">
      <div
        v-for="(item, index) in cardList"
        :key="item.mid"
        class="card-wrap"
        @click="toDetail(item.mid)"
      >
        <el-card class="card" shadow="hover" :class="size">
          <img
            @load="setImgUrl(index + 1, 'loaded')"
            :src="links[index]"
            alt="wait"
            width="100%"
            height="100%"
          />
        </el-card>
        <div class="title">
          <span :style="'font-size:' + (size === 'mini' ? '14px' : '16px')">{{
            item.title
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonShowCase",
  props: ["title", "cardList", "size", "seq"],
  data() {
    return {
      links: [],
      errorImg: require('@/assets/user_icon.jpg')
    };
  },
  methods: {
    toDetail(id) {
      this.$router.push("/movieinfo/" + id);
    },
    setImgUrl(index, where) {
      if (index >= this.cardList.length) return;
      this.links.splice(index, 1);
      this.links.splice(index, 1, this.$baseImgUrl + this.cardList[index].mid + ".png");
      console.log(this.links[index]);
      if(this.seq && index === this.cardList.length - 1) this.$store.commit('setLoaded');
      console.log(where)
    },
    setDefaultImg(e){
      let img = e.target;
      img.src = this.errorImg;
    }
  },
  watch: {
    cardList() {
      if (this.seq && this.seq === 2) return;
      this.links = new Array(this.cardList.length).fill("");
      this.setImgUrl(0);
    },
    '$store.state.home.isLoaded'() {
      console.log('cnm');
      if (!this.seq || this.seq === 1) return;
      if (this.$store.state.home.isLoaded) {
        this.links = new Array(this.cardList.length).fill("");
        this.setImgUrl(0);
      }
    },
  },
  mounted() {
    this.links = new Array(12).fill("");
  },
};
</script>

<style lang="less" scoped>
.recommand {
  width: 100%;
  margin-bottom: 30px;
  // height: 600px;
  .tip {
    box-sizing: border-box;
    height: 20px;
    line-height: 20px;
    font-size: 20px;
    // font-weight: bold;
    letter-spacing: 1px;
    color: #475669;
    margin-top: 10px;
  }
  .movie-cards {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .card-wrap {
      .card {
        width: 200px;
        height: 265px;
        margin-top: 25px;
        background-color: #e4e4e4;
        /deep/.el-card__body {
          padding: 0 0;
        }
      }
      .title {
        width: 100%;
        margin-top: 5px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          display: block;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .mini {
        width: 180px;
        height: 240px;
      }
    }
    .card:hover {
      background-color: #97999a;
    }
  }
}
</style>