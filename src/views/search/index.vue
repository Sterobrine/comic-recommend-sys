<template>
  <div class="search">
    <div class="title">
      <span>共查询到{{ count }}条有关结果：</span>
    </div>
    <common-movie-list
      :movieList="movieList"
      class="show-list"
    ></common-movie-list>
    <div class="pages">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="pageNum"
        :current-page="currentPage"
        @current-change="pageChange"
        v-if="count"
      >
      </el-pagination>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import CommonMovieList from "@/components/CommonMovieList.vue";
import SearchApi from "../../../api/search";
export default {
  name: "Search",
  components: { CommonMovieList },
  data() {
    return {
      movieList: [],
      pageNum: 1,
      currentPage: 1,
      currentPageSize: 5,
      count: 0,
      keyword: "",
    };
  },
  methods: {
    getSearchList() {
      return SearchApi.getSearchList({
        option: {
          page: this.currentPage,
          pageSize: this.currentPageSize,
          keyword: this.keyword,
        },
      });
    },
    pageChange(index) {
      if (index === this.currentPage) return;
      this.currentPage = index;
      this.getSearchList().then((res) => {
        if (res.data.code === 200) {
          console.log(res.data);
          this.count = res.data.count;
          this.pageNum = Math.ceil(this.count / this.currentPageSize);
          this.movieList = res.data.list;
        }
      });
    },
  },
  watch: {
    "$route.params.keyword"() {
      this.keyword = this.$route.params.keyword;
      this.currentPage = 1;
      this.getSearchList().then((res) => {
        if (res.data.code === 200) {
          console.log(res.data);
          this.count = res.data.count;
          this.pageNum = Math.ceil(this.count / this.currentPageSize);
          this.movieList = res.data.list;
        }
      });
    },
  },
  mounted() {
    this.keyword = this.$route.params.keyword;
    this.getSearchList().then((res) => {
      if (res.data.code === 200) {
        console.log(res.data);
        this.count = res.data.count;
        this.pageNum = Math.ceil(this.count / this.currentPageSize);
        this.movieList = res.data.list;
      }
    });
  },
};
</script>

<style lang='less' scoped>
.search {
  width: 100%;
  .pages {
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .line {
    width: 100%;
    height: 60px;
  }
}
</style>