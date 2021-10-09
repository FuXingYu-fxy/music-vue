<template>
  <div class="widget-container">
    <img :src="comment.avatarUrl" alt="" />
    <div class="side-right">
      <div class="main-info">
        <span class="nickname">{{ comment.nickname + " : " }}</span>
        <span class="content">{{ comment.content }}</span>
      </div>

      <div class="other-info">
        <span>{{toLocalTime}}</span>
        <span>点赞数({{comment.likedCount}}) | 回复</span>
      </div>
    </div>
  </div>
</template>

<script>
// import info from "@/testData/index.js";
export default {
  name: "CommentWidget",
  props: ["comment"],
  components: {},
  computed: {
    toLocalTime() {
      return new Date(this.comment.time).toLocaleString();
    },
  },
  data() {
    return {
      // info,
    };
  },
};
</script>

<style lang="scss" scoped>
.widget-container {
  display: flex;
  margin-bottom: 5px;
  flex-direction: row;
  & > img {
    width: 100px;
    height: 100px;
  }
}
.side-right {
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 5px;
}
.other-info {
  display: flex;
  justify-content: space-between;
}
.nickname {
  color: #4c790d;
}
</style>
