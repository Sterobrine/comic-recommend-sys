<template>
  <div class="subscribe-list">
    <common-movie-list :mode="'subscribe'" v-if="movieList.length" :movieList="movieList"></common-movie-list>
    <div class="tip" v-if="!movieList.length">
      <span>你还没有订阅过任何影片哦</span>
    </div>
    <div class="pages">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="pageNum"
        :current-page="currentPage"
        @current-change="pageChange"
        v-if="movieList.length"
      >
      </el-pagination>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import CommonMovieList from "@/components/CommonMovieList.vue";
import personalApi from '../../../api/personal';
export default {
  components: { CommonMovieList },
  name: "subscribeList",
  props: ["uid"],
  data() {
    return {
      pageNum: 1,
      currentPage: 1,
      currentPageSize: 5,
      movieList: [],
    };
  },
  methods:{
    pageChange(index){
      if(index === this.currentPage) return;
      this.currentPage = index;
      this.getSubscribeList().then(res => {
      if(res.data.code===200){
        this.movieList = res.data.list;
        this.pageNum = Math.ceil(res.data.count/this.currentPageSize);
      }
    });
    },
    getSubscribeList(){
      return personalApi.getSubscribeList({options:{pageSize:this.currentPageSize,page:this.currentPage}});
    }
  },
  mounted(){
    this.getSubscribeList().then(res => {
      if(res.data.code===200){
        this.movieList = res.data.list;
        this.pageNum = Math.ceil(res.data.count/this.currentPageSize);
      }
    });
  }
};
</script>

<style lang="less" scoped>
.subscribe-list {
  width: 100%;
  .tip{
    height: 400px;
    width: 100%;
    margin-top: 20px;
    span{
      color: rgb(88,88,88);
    }
  }
  .pages {
    display: flex;
    width: 100%;
    margin: 20px 0;
  }
}
.line{
    width: 100%;
    height: 60px;
  }
</style>