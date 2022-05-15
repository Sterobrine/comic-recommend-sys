<template>
  <div class="comments">
    <div class="add-comment">
      <el-input
        type="textarea"
        resize="none"
        rows="3"
        v-model="commentContent"
        @keyup.enter="huanhang"
      ></el-input>
      <el-button type="info" class="submit" @click="submitComment"
        ><span>发表<br />评论</span></el-button
      >
    </div>
    <common-comment
      v-for="item in commentList"
      :key="item.cid"
      class="comment"
      :item="item"
    ></common-comment>
  </div>
</template>

<script>
import CommonComment from "@/components/CommonComment.vue";
import CommentApi from "../../../api/comment";
export default {
  components: { CommonComment },
  name: "Comments",
  data() {
    return {
      commentNum: 0,
      commentContent: "",
      count: 0,
      commentList: [],
    };
  },
  props: ["mid", "isMounted"],
  methods: {
    huanhang(){
      this.commentContent += '\\n';
    },
    getCommentList(n) {
      return CommentApi.getCommentList({
        option: {
          mid: this.mid,
          num: this.commentNum + n,
        },
      }).then(res => {
        this.commentNum += n;
        return res;
      })
    },
    async loadMore(e) {
      console.log(this.commentNum, this.count);
      if (this.commentNum >= this.count) return;
      if (
        e.target.scrollingElement.scrollTop +
          e.target.scrollingElement.clientHeight >=
        e.target.scrollingElement.scrollHeight - 40
      ) {
        let res = await this.getCommentList(10);
        if (res.data.code === 200) {
          this.commentList = res.data.list;
          this.count = res.data.count;
        }
      }
    },
    submitComment() {
      CommentApi.addComment({
        option: {
          mid: this.mid,
          content: this.commentContent,
        },
      }).then(() => {
        this.commentContent = "";
        this.getCommentList(0).then((res) => {
          if (res.data.code === 200) {
            console.log(this.commentNumm, res.data);
            this.commentList = res.data.list;
            this.count = res.data.count;
          }
        });
      });
    },
  },
  watch: {
    mid() {
      if (this.mid !== "") {
        this.commentNum = 0;
        this.commentList = [];
        this.getCommentList(10).then((res) => {
          if (res.data.code === 200) {
            this.commentList = res.data.list;
            this.count = res.data.count;
          }
        });
      }
    },
    commentContent(){
      console.log(this.commentContent)
    }
  },
  mounted() {
    window.addEventListener("scroll", this.loadMore);
    if (this.mid !== "") {
        this.getCommentList(10).then((res) => {
          if (res.data.code === 200) {
            this.commentList = res.data.list;
            this.count = res.data.count;
          }
        });
      }
  },
};
</script>

<style lang='less' scoped>
.comments {
  width: 100%;
  .comment {
    border-bottom: 1px solid #bbbaba;
  }
  .comment:nth-last-child(1) {
    border-bottom: 0;
  }
}
.add-comment {
  display: flex;
  .submit {
    width: 100px;
    height: 75px;
    margin-left: 10px;
    line-height: 20px;
  }
}
</style>