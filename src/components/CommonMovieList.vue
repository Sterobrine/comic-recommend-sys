<template>
  <div class="movie-list">
    <div class="row" :class="mode==='subscribe'? '':'recommand-row'" v-for="item in movieList" :key="item.uid" @click="mode==='subscribe'? '':toDetail(item.mid)">
      <el-card class="post" shadow="never">
        <img :src="$baseImgUrl + item.mid + '.png'" alt="" @click="toDetail(item.mid)">
      </el-card>
      <div class="detail">
        <div class="movie-info">
          <div class="movie-title">
            <span @click="toDetail(item.mid)">{{item.title}}</span>
          </div>
          <div class="info-line">
            <div class="info-col">
              风格：<span class="movie-style">{{ item.tags }}</span>
            </div>
            <div class="info-col">
              地区：<span class="movie-area">{{ item.area }}</span>
            </div>
          </div>
          <div class="info-line">
            <div class="info-col">
              开播时间：<span class="movie-date">{{ item.date }}</span>
            </div>
            <div class="info-col">
              演员：<span class="movie-recorder">{{
                item.actor.split('\\n').join(' I ')
              }}</span>
            </div>
            <div class="info-col movie-introduce">
              简介：
              <span>{{
                item.introduce.split('\\n').join('')
              }}</span>
            </div>
          </div>
          <div class="subscribe-btn" v-show="mode==='subscribe'"><el-button @click="switchSubscribe($event,item.mid)">已订阅</el-button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import personalApi from '../../api/personal'
export default {
  name: "CommonMovieList",
  props: ["movieList",'mode'],
  methods: {
    switchSubscribe(e,i){
      if(e.target.innerHTML === '订阅'){
        personalApi.enterSubscribeMovie({mid:i}).then(res=>{
          if(res.data.code===200) e.target.innerHTML = '已定阅';
          else if(res.data.code===401) this.$router.push({name:'Login'});
        })
      }
      else{
        personalApi.cancelSubscribeMovie({mid:i}).then(res=>{
          if(res.data.code===200) e.target.innerHTML = '订阅';
          else if(res.data.code===401) this.$router.push({name:'Login'});
        })
      }
    },
    toDetail(id){
      this.$router.push('/movieinfo/' + id);
    },
  },
};
</script>

<style lang="less" scoped>
.movie-list {
  width: 100%;
  min-width: none;
  .row {
    box-sizing: border-box;
    width: 100%;
    height: 250px;
    margin-top: 20px;
    padding: 5px 20px;
    border-radius: 5px;
    transition: background-color 0.5s;
    display: flex;
    .post {
      width: 180px;
      height: 240px;
      background-color: #e4e4e4;
      min-width: 180px;
      cursor: pointer;
      /deep/.el-card__body{
        padding: 0 0;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    .movie-info {
      max-width: 900px;
      height: 240px;
      margin-left: 20px;
      min-width: 200px;
      color: #97999a;
      position: relative;
      .info-line span {
        color: rgb(88, 88, 88);
        // margin-left: 5px;
      }
      .info-col {
        width: 100%;
        margin-top: 5px;
        // max-height: 40px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .movie-introduce {
        -webkit-line-clamp: 3;
      }
      .movie-title {
        font-size: 22px;
        //   font-weight: bold;
        color: rgb(88, 88, 88);
        margin-bottom: 20px;
      }
      .subscribe-btn{
        position: absolute;
        right: 0px;
        top: 0px;
      }
    }
  }
  .row:after {
    content: "";
    display: block;
    clear: both;
  }
  .recommand-row:hover {
    background-color: #e4e4e4;
    transition: background-color 0.5s;
    cursor: pointer;
  }
}
</style>