<template>
  <div class="recommand">
    <div class="title" v-if="movieList.length"><span>你可能喜欢的电影</span></div>
    <div class="title" v-if="!movieList.length"><p>{{waitStatus ? '请稍等' : '由于你还没有设置个性标签和订阅任何电影，还无法进行推荐哦'}}</p></div>
    <common-movie-list v-if="movieList.length" :movieList="movieList"></common-movie-list>
    <div class="pages">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="pageNum"
        @current-change="pageChange"
        v-if="movieList.length"
        :current-page="currentPage"
      >
      </el-pagination>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import CommonMovieList from "@/components/CommonMovieList.vue";
import recommandApi from '../../../api/recommand';

let recommandList = [];

export default {
  name: "Recommand",
  data() {
    return {
      pageNum: 10,
      currentPage: 1,
      currentPageSize: 5,
      movieList: [],
      waitStatus: true
    };
  },
  components: {
    CommonMovieList,
  },
  methods: {
    pageChange(index) {
      this.currentPage = index;
      this.movieList = recommandList.slice((this.currentPage-1)*this.currentPageSize, this.currentPage*this.currentPageSize);
    },
  },
  mounted() {
    this.$store.commit("setMenuStyle", this.$route.name);
    recommandApi.getRecommandList().then(res => {
      if(res.data.code === 200){
        recommandList = res.data.list;
        console.log(res.data.list);
        this.pageNum = Math.ceil(recommandList.length/this.currentPageSize);
        this.movieList = recommandList.slice((this.currentPage-1)*this.currentPageSize, this.currentPage*this.currentPageSize);
      }
      else if(res.data.code === 404) this.waitStatus = false;
      else if(res.data.code === 401) this.$router.push({name:'Login'});
    })
  },
};
</script>

<style lang='less' scoped>
.recommand {
  margin-bottom: 30px;
  .title {
    width: 100%;
    // height: 40px;
    padding: 5px 0;
    font-size: 20px;
    line-height: 40px;
    background-color: #e4e4e4;
    color: rgb(88, 88, 88);
    border-radius: 5px;
    span {
      margin-left: 20px;
      letter-spacing: 1px;
    }
    p{
      margin-left: 20px;
      letter-spacing: 1px;
    }
  }
  .pages {
    width: 100%;
    margin: 20px 0;
  }
  .line {
    width: 100%;
    height: 60px;
  }
}
</style>