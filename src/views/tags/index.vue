<template>
  <div class="personal-tags">
    <div class="my-tags">
      <div class="title"><span>我的标签</span></div>
      <div class="tip" v-if="!myTags.length">
        <span>你还没有添加任何标签哦</span>
      </div>
      <div class="tags" v-if="myTags.length">
        <div v-for="item in myTags" :key="item.tid">
          <el-tag type="info" :closable="true" @close="deleteTag(item.tid)">{{
            item.tagname
          }}</el-tag>
        </div>
      </div>
      <div class="all-tags">
        <div class="title"><span>所有标签</span></div>
        <div class="tags">
          <div
            v-for="item in tagList"
            :key="item.tid"
            @click="addTag(item.tid)"
          >
            <el-tag type="info">{{ item.tagname }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import categoryApi from "../../../api/category";
import personalApi from "../../../api/personal";
export default {
  name: "Tags",
  props: ["uid"],
  data() {
    return {
      myTags: [],
      tagList: [],
    };
  },
  methods: {
    getTags() {
      return categoryApi.getTypes();
    },
    getPersonalTags() {
      return personalApi.getTag();
    },
    deleteTag(tid) {
      personalApi.cancelTag({ tid: tid }).then((res) => {
        if (res.data.code === 200) {
          for (let i = 0; i < this.myTags.length; i++) {
            if (this.myTags[i].tid === tid) {
              this.tagList.push(this.myTags[i]);
              this.myTags.splice(i, 1);
            }
          }
        } else if (res.data.code === 401) this.$router.push({ name: "Login" });
      });
    },
    addTag(tid) {
      personalApi.enterTag({ tid: tid }).then((res) => {
        if (res.data.code === 200) {
          for (let i = 0; i < this.tagList.length; i++) {
            if (this.tagList[i].tid === tid) {
              this.myTags.push(this.tagList[i]);
              this.tagList.splice(i, 1);
            }
          }
        } else if (res.data.code === 401) this.$router.push({ name: "Login" });
      });
    },
  },
  mounted() {
    let tags = null;
    this.getTags()
      .then((res) => {
        if (res.data.code === 200) {
          tags = res.data.list;
          return this.getPersonalTags();
        } else return null;
      })
      .then((res) => {
        if (!tags) return;
        if (res.data.code === 200) {
          this.myTags = res.data.list;
          let count = 0,
            i = 0;
          while (count < res.data.list.length) {
            let flag = true;
            res.data.list.forEach((item) => {
              if (item.tid === tags[i].tid) {
                tags.splice(i, 1);
                count++;
                flag = false;
                return false;
              }
            });
            if(flag) i++;
          }
          this.tagList = tags;
        } else if (res.data.code === 401) this.$router.push({ name: "Login" });
      });
  },
};
</script>

<style lang="less" scoped>
.personal-tags {
  max-width: 800px;
  min-width: 300px;
  min-height: 600px;
  margin-left: 20px;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .my-tags {
    margin-top: 20px;
  }
  .all-tags {
    margin-top: 20px;
  }
  .tip {
    color: rgb(88, 88, 88);
    margin-top: 20px;
    height: 32px;
  }
}
.tags {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  div {
    width: 80px;
    margin-top: 10px;
    cursor: pointer;
  }
}
.title {
  color: rgb(88, 88, 88);
}
</style>