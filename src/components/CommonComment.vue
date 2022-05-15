<template>
  <div class="comment">
    <div class="face"></div>
    <div class="right">
      <div class="name">{{ item.username }}</div>
      <div class="content">
        <span>{{ item.content }}</span>
      </div>
      <div class="operate">
        <div class="date">{{ item.date }}</div>
        <div class="item" @click="thumb">
          👍 {{ item.thumb ? item.thumb : "" }}
        </div>
        <div class="item" id="reply" @click="switchReply">回复</div>
      </div>
      <div class="reply" v-if="replyStatus">
        <div class="reply-item" v-for="item in replyList" :key="item.index">
          <div class="reply-content">
            <span style="font-weight: bold">{{ item.username }}</span>
            <span style="margin-left: 10px">{{ item.content }}</span>
            <div class="reply-date">
              <span>{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentApi from "../../api/comment";
export default {
  name: "CommonComments",
  data() {
    return {
      replyList: [
        {
          content: "wowowowowwwwwww",
          username: "user1",
          date: "2022-4-15 18:52",
          index: 1,
        },
        {
          content: "wowowowowwwwwww",
          username: "user1",
          date: "2022-4-15 18:52",
          index: 2,
        },
        {
          content: "wowowowowwwwwww",
          username: "user1",
          date: "2022-4-15 18:52",
          index: 3,
        },
      ],
      replyStatus: false,
      status:false
    };
  },
  props: ["mid", "item"],
  methods: {
    switchReply(e) {
      if (this.replyStatus) {
        e.target.innerHTML = "回复";
        this.replyStatus = false;
      } else {
        e.target.innerHTML = "收起";
        this.replyStatus = true;
      }
    },
    thumb() {
      if (this.status) {
        CommentApi.cancelCommentThumb({
          cid: this.item.cid
        }).then(() => {
          this.item.thumb--;
          this.status = !this.status;
        });
      } else {
        CommentApi.addCommentThumb({
          option: {
            uid: this.item.uid,
            cid: this.item.cid,
          },
        }).then(() => {
          this.item.thumb++;
          this.status = !this.status;
        });
      }
    },
  },
  mounted() {
    this.status = this.item.status;
    console.log(this.item.status)
  },
};
</script>

<style lang='less' scoped>
.comment {
  padding: 20px 0;
  display: flex;
  color: #97999a;
  .face {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: darkgray;
    float: left;
  }
  .right {
    margin-left: 20px;
    .name {
      color: rgb(88, 88, 88);
      font-weight: bold;
    }
    .date {
      font-size: 14px;
    }
    .content {
      margin: 5px 0;
      color: rgb(88, 88, 88);
    }
    .operate {
      display: flex;
      line-height: 20px;
      .item {
        margin-left: 20px;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .reply-item {
      line-height: 20px;
      .reply-content {
        color: rgb(88, 88, 88);
      }
      .reply-date {
        font-size: 14px;
        color: #97999a;
      }
    }
  }
}
.content:after {
  content: "";
  display: block;
  clear: both;
}
</style>