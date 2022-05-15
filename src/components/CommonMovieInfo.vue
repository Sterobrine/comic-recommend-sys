<template>
  <div class="movie">
    <div class="info">
      <el-card class="post" shadow="never">
        <img
          :src="$baseImgUrl + mid + '.png'"
          alt="132"
          width="100%"
          height="100%"
        />
      </el-card>
      <div class="detail">
        <div class="title-wrap">
          <div class="title">
            <span>{{ movieinfo.title }}</span>
          </div>
        </div>
        <div class="count">
          <div class="count-item">
            <div class="count-title"><span>订阅人数</span></div>
            <div class="count-num"><span>{{subscribeCount}}</span></div>
          </div>
          <div class="count-item">
            <div class="count-title"><span>评论数</span></div>
            <div class="count-num"><span>{{commentCount}}</span></div>
          </div>
        </div>
        <div class="date">
          <span>{{ movieinfo.date }}</span>
        </div>
        <div class="introduce">
          简介：
          <span>{{ movieinfo.introduce }}</span>
        </div>
        <div class="sub-btn">
          <el-button @click="subscribeMovie"
            ><span>{{ subscribeStatus ? "已订阅" : "订阅" }}</span></el-button
          >
        </div>
      </div>
    </div>
    <div class="nav">
      <el-menu
        :default-active="defaultActiveMenu"
        mode="horizontal"
        active-text-color="rgb(88, 88, 88)"
      >
        <el-menu-item index="1" @click="switchMenu(1)"
          ><span>作品详情</span></el-menu-item
        >
        <el-menu-item index="2" @click="switchMenu(0)"
          ><span>评论</span></el-menu-item
        >
      </el-menu>
      <keep-alive>
        <router-view
          class="detail"
          :mid="mid"
          :isMounted="isMounted"
        ></router-view>
      </keep-alive>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
import personalApi from "../../api/personal";
import movieApi from "../../api/movieinfo";
import commentApi from '../../api/comment';
export default {
  name: "CommonMovieInfo",
  data() {
    return {
      defaultActiveMenu: "1",
      mid: "",
      movieinfo: {},
      subscribeStatus: false,
      isMounted: false,
      subscribeCount:123,
      commentCount:123
    };
  },
  methods: {
    switchMenu(index) {
      if (index) this.$router.push({ name: "CommonMovieDetail" });
      else this.$router.push({ name: "Comments" });
    },
    getSubscribeStatus() {
      return personalApi.getSubscribeStatus({ mid: this.mid });
    },
    subscribeMovie() {
      if (!this.subscribeStatus) {
        personalApi.enterSubscribeMovie({ mid: this.mid }).then((res) => {
          if (res.data.code === 200) this.subscribeStatus = true;
          else if (res.data.code === 401) this.$router.push({ name: "Login" });
        });
      } else {
        personalApi.cancelSubscribeMovie({ mid: this.mid }).then((res) => {
          if (res.data.code === 200) this.subscribeStatus = false;
          else if (res.data.code === 401) this.$router.push({ name: "Login" });
        });
      }
    },
  },
  watch: {
    mid() {
      movieApi
        .getMovieInfo({ mid: this.mid })
        .then((res) => {
          if (res.data.code === 200) {
            this.movieinfo = res.data.list[0];
            this.movieinfo.introduce = this.movieinfo.introduce
              .split("\\n")
              .join("");
          }
        }).then(() => {
          return movieApi.getMovieSubscribeCount({mid: this.mid})
        }).then(res =>{
          if(res.data.code === 200){
            this.subscribeCount = res.data.count.count;
          }
        }).then(() => {
          return commentApi.getCommentCount({mid: this.mid})
        }).then(res =>{
          if(res.data.code === 200){
            this.commentCount = res.data.count.count;
          }
        })
        .then(() => this.getSubscribeStatus())
        .then((res) => {
          if (res.data.code === 200) this.subscribeStatus = res.data.status;
          else if (res.data.code === 401) this.subscribeStatus = false;
        })
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.$route.name === "CommonMovieDetail") this.defaultActiveMenu = "1";
    else if (this.$route.name === "Comments") this.defaultActiveMenu = "2";
    this.mid = this.$route.params.mid;
    console.log(this.mid);
    movieApi
      .getMovieInfo({ mid: this.mid })
      .then((res) => {
        if (res.data.code === 200) {
          this.movieinfo = res.data.list[0];
          this.movieinfo.introduce = this.movieinfo.introduce
            .split("\\n")
            .join("");
        }
      })
      .then(() => this.getSubscribeStatus())
      .then((res) => {
        if (res.data.code === 200) this.subscribeStatus = res.data.status;
        else if (res.data.code === 401) this.subscribeStatus = false;
      });
  },
  updated() {
    this.mid = this.$route.params.mid;
  },
};
</script>
<style lang='less' scoped>
.movie {
  margin-top: 30px;
  width: 100%;
  .info {
    width: 100%;
    display: flex;
    .post {
      max-width: 240px;
      min-width: 240px;
      height: 320px;
      /deep/.el-card__body {
        padding: 0 0;
      }
    }
    .detail {
      max-width: 900px;
      min-width: 200px;
      margin-left: 20px;
      margin-top: 0px;
      color: rgb(88, 88, 88);
      position: relative;
      .title {
        font-size: 25px;
        font-weight: bold;
      }
      .count {
        width: 100%;
        margin-top: 20px;
        .count-item {
          width: 80px;
          float: left;
          .count-num {
            width: 100%;
            margin-top: 5px;
          }
        }
        .count-item:nth-child(1) {
          border-right: 1px solid black;
        }
        .count-item:nth-child(2) {
          margin-left: 20px;
        }
      }
      .count:after {
        content: "";
        display: block;
        clear: both;
      }
      .date {
        width: 250px;
        margin-top: 20px;
      }
      .introduce {
        width: 100%;
        margin-top: 15px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }
      .sub-btn {
        position: absolute;
        bottom: 0px;
        .el-button {
          width: 100px;
          height: 50px;
        }
        span {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
  .info:after {
    content: "";
    display: block;
    clear: both;
  }
  .nav {
    width: 100%;
    margin-top: 20px;
    .el-menu-item {
      width: 100px;
      text-align: center;
      font-size: 16px;
      padding: 0;
    }
    .el-menu-item.is-active {
      padding: 0;
    }
  }
  .detail {
    width: 100%;
    margin-top: 20px;
  }
  .space {
    width: 100%;
    height: 60px;
  }
}
</style>