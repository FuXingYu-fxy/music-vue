<template>
  <div
    class="container"
    :style="{ transform: currentShowStatus }"
    @click="shrink"
  >
    <CommentWidget
      v-for="(item, index) of curInfo"
      :key="index"
      :comment="item"
    />
    <button @click.stop="requestComment({ id, pageNo: 2 })">第2页</button>
    <button @click.stop="requestComment({ id, pageNo: 3 })">第3页</button>
    <button @click.stop="requestComment({ id, pageNo: 4 })">第4页</button>
  </div>
</template>

<script>
import CommentWidget from "./CommentWidget.vue";
import request from "@/request/request.js";
export default {
  components: { CommentWidget },
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
      previousTime: 0,
      curInfo: [],
      more: true,
    };
  },
  methods: {
    shrink() {
      this.$emit("update:status", "shrink");
    },
    /**
     * 获取评论的新接口
     * @param {Object} options - 其中 id 和 type 是必选参数
     * @param {number} options.id - 资源 id, 如歌曲 id,mv id
     * @param {number} options.type - 0:歌曲, 1:mv, 2:歌单, 3:专辑, 4:电台, 5:视频, 6:动态
     * @param {number} options.pageNo - 分页参数, 默认为1
     * @param {number} options.pageSize - 分页参数,每页多少条数据,默认20
     * @param {number} options.sortType - 排序方式,1:按推荐排序, 2:按热度排序, 3:按时间排序
     * @param {number} options.cursor - 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time
     */
    requestComment({
      id,
      type = 0,
      pageNo = 1,
      pageSize = 20,
      sortType = 1,
      cursor = undefined,
    }) {
      if (!this.more) {
        // 没有更多的评论
        return;
      }
      request
        .get("/comment/new", {
          params: {
            id,
            type,
            pageNo,
            pageSize,
            sortType,
            cursor,
          },
        })
        .then(({ data }) => {
          if (data.code === 200) {
            data = data.data;
            const lastIndex = data.comments.length - 1;
            this.previousTime = data.comments[lastIndex].time;
            this.more = data.hasMore;
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
          } else {
            console.error('歌词获取错误');
          }
        });
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
      if (value === "shrink") {
        document.body.style.cssText = "";
      }
      if (value === "grow") {
        document.body.style.cssText = "overflow: hidden; margin: 0;";
      }
    },
    id(newId) {
      // 歌曲id发生变更时, 应该重置以下信息
      this.more = true;
      this.requestComment({ id: newId });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/scrollbar-style";
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
