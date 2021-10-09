<template>
  <div
    class="container"
    :style="{ transform: currentShowStatus }"
    @click="shrink"
  >
    <CommentWidget v-for="(item, index) of curInfo" :key="index" :comment="item"/>
  </div>
</template>

<script>
import CommentWidget from './CommentWidget.vue';
import request from '@/request/request.js';
export default {
  components: {CommentWidget},
  props: {
    status: {
      validator(value) {
        return value === "shrink" || value === "grow";
      },
      default: "shrink",
    },
    id: {
      type: Number,
      require: true,
    },
  },
  name: "",
  data() {
    return {
      curPage: 1,
      previousTime: 0,
      curInfo: [],
    };
  },
  methods: {
    shrink() {
      this.$emit("update:status", "shrink");
    },
  },
  computed: {
    currentShowStatus() {
      return this.status === "shrink" ? "translateY(-100%)" : "translateY(0%)";
    },
  },
  watch: {
    status(value) {
      // 这里捕获的是更改后的值, 所以要反着来
      if (value === 'shrink') {
        document.body.style.cssText = '';
      }
      if (value === 'grow') {
        document.body.style.cssText = 'overflow: hidden; margin: 0;';
      }

    },
    id(newValue) {
      request
        .get("/comment/music", {
          params: {
            // 广东爱情故事
            id: newValue,
            offset: (this.curPage - 1) * 20,
            // 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
            before: this.previousTime,
          },
        })
        .then(({ data }) => {
          this.previousTime = data.comments[19].time;
          this.curPage += 1;
          this.curInfo = data.comments.map((item) => {
            return {
              avatarUrl: item.user.avatarUrl,
              nickname: item.user.nickname,
              content: item.content,
              time: item.time,
              likedCount: item.likedCount,
              liked: item.liked,
            };
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/scrollbar-style';
.container {
  @include scrollbar();
  height: 100vh;
  overflow: auto;
  width: 100%;
  background-color: antiquewhite;
  position: fixed;
  bottom: 0;
  z-index: 999;
  transition: 0.5s;
}
</style>
