<template>
  <div class="detail">
    <div class="left">
      <div class="comment">
        <div class="title">
          <span>点评</span>
        </div>
        <div class="content">
          <el-card v-for="i in 3" :key="i" shadow="never" class="comment-card">
            <span>{{ "这是一条评论精选" + i }}</span>
          </el-card>
        </div>
        <div class="recommand">
          <div class="title">
            <span>相似推荐</span>
          </div>
          <common-show-case
            :size="'mini'"
            :cardList="movieList"
          ></common-show-case>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="content">
        <el-card shadow="never" class="actor">
          <span slot="header" class="title">演员/配音</span>
          <p>{{ actor }}</p>
        </el-card>
      </div>
      <div class="content">
        <el-card shadow="never" class="staff">
          <span slot="header" class="title">制作人员</span>
          <p>{{ staff }}</p>
        </el-card>
      </div>
    </div>
    <!-- <div class="space-line"></div> -->
  </div>
</template>

<script>
import CommonShowCase from "./CommonShowCase.vue";
import movieApi from "../../api/movieinfo";
export default {
  components: { CommonShowCase },
  name: "CommonMovieDetail",
  props: ["mid", "isMounted"],
  data() {
    return {
      actor: "",
      staff: "",
      movieList: [],
    };
  },
  watch: {
    // isMounted(){
    //   if(this.isMounted)
    //   movieApi
    //     .getMovieInfo({ mid: this.mid })
    //     .then((res) => {
    //       if (res.data.code === 200) {
    //         this.actor = this.movieinfo.actor.split("\\n").join("\n");
    //         this.staff = this.movieinfo.staff.split("\\n").join("\n");
    //       }
    //     })
    //     .then(() => this.getSubscribeStatus())
    //     .then((res) => {
    //       if (res.data.code === 200) this.subscribeStatus = res.data.status;
    //       else if (res.data.code === 401) this.subscribeStatus = false;
    //     })
    //     .then(() => movieApi.getMovieRecommand({ mid: this.mid }))
    //     .then((res) => {
    //       if (res.data.code === 200) this.movieList = res.data.list;
    //     });
    // },
    mid() {
      if(this.mid !== ""){
        movieApi
        .getMovieInfo({ mid: this.mid })
        .then((res) => {
          if (res.data.code === 200) {
            this.actor = res.data.list[0].actor.split("\\n").join("\n");
            this.staff = res.data.list[0].staff.split("\\n").join("\n");
          }
        })
        .then(() => movieApi.getMovieRecommand({ mid: this.mid }))
        .then((res) => {
          if (res.data.code === 200) this.movieList = res.data.list;
        });
      }
    },
  },
  mounted() {
    if(this.mid !== ""){
        movieApi
        .getMovieInfo({ mid: this.mid })
        .then((res) => {
          if (res.data.code === 200) {
            this.actor = res.data.list[0].actor.split("\\n").join("\n");
            this.staff = res.data.list[0].staff.split("\\n").join("\n");
          }
        })
        .then(() => movieApi.getMovieRecommand({ mid: this.mid }))
        .then((res) => {
          if (res.data.code === 200) this.movieList = res.data.list;
        });
      }
  },
};
</script>

<style lang='less' scoped>
.detail {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: rgb(88, 88, 88);
  margin-bottom: 30px;
  .left {
    width: 69%;
    .comment {
      width: 100%;
      .content {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        .comment-card {
          width: 32%;
          height: 190px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 7;
          overflow: hidden;
        }
      }
    }
    .recommand {
      width: 100%;
      margin-top: 20px;
    }
  }
  .right {
    width: 30%;
    .actor {
      min-height: 300px;
    }
    .staff {
      min-height: 300px;
      margin-top: 20px;
    }
    .title {
      font-weight: bold;
      font-size: 20px;
    }
  }
  // .space-line{
  //   width: 100%;
  //   height: 60px;
  // }
  p {
    white-space: pre-wrap;
    line-height: 20px;
    font-size: 14px;
  }
}
</style>