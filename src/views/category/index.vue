<template>
  <div class="category">
    <div class="sort-area">
      <li class="sub_num">
        <span :class="orderType ? 'li-active' : ''" @click="changeOrder(1)">订阅人数</span>
        <div class="arrow">
          <div
            class="up"
            :class="orderType ? (arrowStatus.sub ? '' : 'up-active') : ''"
          ></div>
          <div
            class="down"
            :class="orderType ? (arrowStatus.sub ? 'down-active' : '') : ''"
          ></div>
        </div>
      </li>
      <li class="pub_date">
        <span :class="!orderType ? 'li-active' : ''" @click="changeOrder(0)">开播时间</span>
        <div class="arrow">
          <div
            class="up"
            :class="!orderType ? (arrowStatus.pub ? '' : 'up-active') : ''"
          ></div>
          <div
            class="down"
            :class="!orderType ? (arrowStatus.pub ? 'down-active' : '') : ''"
          ></div>
        </div>
      </li>
    </div>
    <div class="result-area">
      <common-show-case :size="'mini'" :cardList="movieList"></common-show-case>
    </div>
    <div class="select-area">
      <div class="select-wrap">
        <div class="select-type"><span>地区</span></div>
        <div class="select-item">
          <div v-for="area in areas" :key="area" class="item" @click="setOption('area', area)" :class="options.area===area ? 'item-active': ''">
            <span>{{ area }}</span>
          </div>
        </div>
      </div>
      <div class="select-wrap">
        <div class="select-type"><span>时间</span></div>
        <div class="select-item">
          <div v-for="item in date" :key="item.label" class="item" @click="setOption('date', item.name)" :class="options.date===item.name ? 'item-active': ''">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="select-wrap">
        <div class="select-type"><span>类型</span></div>
        <div class="select-item">
          <div v-for="item in types" :key="item.tid" class="item" @click="setOption('type', item.tagname) " :class="options.type===item.tagname ? 'item-active': ''">
            <span>{{ item.tagname }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pages">
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-count="pageNum"
          @current-change="pageChange"
          :current-page="currentPage"
        >
        </el-pagination>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import CommonShowCase from "@/components/CommonShowCase.vue";
import categoryApi from '../../../api/category'
export default {
  components: { CommonShowCase },
  name: "Category",
  data() {
    return {
      areas: ["全部", "中国大陆", "日本", "美国"],
      date: [
        {
          label: "全部",
          name: "全部",
        },
        {
          label: "2022",
          name: "2022",
        },
        {
          label: "2021",
          name: "2021",
        },
        {
          label: "2020",
          name: "2020",
        },
        {
          label: "2019",
          name: "2019",
        },
        {
          label: "2018",
          name: "2018",
        },
        {
          label: "2017",
          name: "2017",
        },
        {
          label: "2016",
          name: "2016",
        },
        {
          label: "2015",
          name: "2015",
        },
        {
          label: "更早",
          name: "2014",
        },
      ],
      types:[],
      arrowStatus: {
        sub: 1,
        pub: 1,
      },
      orderType: 1,
      pageNum: 10,
      options:{
        area:"全部",
        date:"全部",
        type:"全部"
      },
      currentPage: 1,
      currentPageSize: 12,
      movieList: [],
    };
  },
  mounted() {
    this.$store.commit("setMenuStyle", this.$route.name);
    this.getTypes().then(() => this.getMovieList()).then(res =>{
        this.pageNum = Math.ceil(res.data.count/this.currentPageSize);
        this.movieList = res.data.list;
      })
  },
  methods: {
    changeOrder(orderType){
      if(orderType !== this.orderType){
        this.orderType = orderType;
        if(orderType) this.arrowStatus.sub = 1;
        else this.arrowStatus.pub = 1;
      }
      else{
        if(orderType) this.arrowStatus.sub = 1 - this.arrowStatus.sub;
        else this.arrowStatus.pub = 1 - this.arrowStatus.pub;
      }
      this.currentPage = 1;
      this.getMovieList().then(res => {
        this.pageNum = Math.ceil(res.data.count/this.currentPageSize);
        this.movieList = res.data.list;
      });
    },
    setOption(type,val){
      if(this.options[type] === val) return;
      this.options[type] = val;
      this.currentPage = 1;
      this.getMovieList().then(res => {
        this.pageNum = Math.ceil(res.data.count/this.currentPageSize);
        this.movieList = res.data.list;
      });
    },
    pageChange(index){
      this.currentPage = index;
      this.getMovieList().then(res => {
        this.pageNum = Math.ceil(res.data.count/this.currentPageSize);
        this.movieList = res.data.list;
      });
    },
    getTypes(){
      return categoryApi.getTypes().then(res => {
        if(res.data.code===200){
          res.data.list.unshift({tid:0,tagname:'全部'});
          this.types = res.data.list;
        }
      });
    },
    getMovieList(){
      return categoryApi.getMovieInfo({
        options:{
          orderType:this.orderType,
          arrowStatus:this.arrowStatus,
          area:this.options.area,
          date:this.options.date,
          type:this.options.type,
          pageSize:this.currentPageSize,
          page:this.currentPage
        }
      });
    }
  },
};
</script>

<style lang='less' scoped>
.category {
  width: 100%;
  .sort-area {
    box-sizing: border-box;
    width: 300px;
    height: 40px;
    padding: 10px 0;
    color: #97999a;
    li {
      float: left;
      margin-left: 20px;
      list-style: none;
      cursor: pointer;
      .arrow {
        width: 0.5em;
        height: 1em;
        float: right;
        padding-top: 0.35em;
        margin-left: 0.3em;
        .up {
          border-left: 0.3em solid transparent;
          border-right: 0.3em solid transparent;
          border-bottom: 0.3em solid #e4e4e4;
        }
        .down {
          border-left: 0.3em solid transparent;
          border-right: 0.3em solid transparent;
          border-top: 0.3em solid #e4e4e4;
          margin-top: 2px;
        }
        .up-active {
          border-bottom: 0.3em solid rgb(88, 88, 88) !important;
        }
        .down-active {
          border-top: 0.3em solid rgb(88, 88, 88) !important;
        }
      }
      .li-active {
        color: rgb(88, 88, 88);
      }
    }
  }
  .result-area {
    width: 70%;
    float: left;
  }
  .select-area {
    box-sizing: border-box;
    width: 30%;
    float: right;
    .select-wrap {
      margin-top: 20px;
      .select-item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-around;
        margin-top: 10px;
        color: #97999a;
        .item {
          width: 90px;
          text-align: center;
          cursor: pointer;
        }
        .item-active {
          color: rgb(88, 88, 88);
        }
      }
      .select-type {
        color: rgb(88, 88, 88);
      }
    }
  }
  .pages {
    width: 70%;
    height: 40px;
    margin: 20px 0;
    float: left;
    display: flex;
    justify-content: center;
  }
}
.category:after {
  content: "";
  display: block;
  clear: both;
}
.line{
    width: 100%;
    height: 60px;
    float: left;
  }
</style>