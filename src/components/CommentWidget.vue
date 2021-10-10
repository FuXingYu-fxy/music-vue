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
        
        <span @click.stop="likeThis">
          <v-icon
            name="thumbs-up"
            title="喜欢"
            :style="{
              color: liked ? 'red' : 'gray',
            }"
          />({{likedCount}})
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import info from "@/testData/index.js";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import {debounce} from '@/utils/index.js';
import request from '@/request/request.js';
export default {
  name: "CommentWidget",
  props: ["comment"],
  components: {
    'v-icon': Icon,
  },
  computed: {
    toLocalTime() {
      return new Date(this.comment.time).toLocaleString();
    },
  },
  data() {
    return {
      // info,
      liked: this.comment.liked,
      likedCount: this.comment.likedCount,
    };
  },
  methods: {
    requestLike: debounce(function ({id, cid, t, type=0}) {
      if ([id, cid, t, type].includes('undefined')) {
        return Promise.reject('缺少必要参数');
      }
      return request.get('/comment/like', {
        params: {
          id,
          cid,
          t,
          type,
        }
      })
    }, 2000),
    likeThis() {
      this.liked = !this.liked;
      this.likedCount = this.liked 
      ? this.likedCount + 1 
      : this.likedCount - 1;
      this.requestLike({
        id: this.comment.id,
        cid: this.comment.cid,
        type: 0,
        t: +this.liked,
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.widget-container {
  display: flex;
  margin-bottom: 5px;
  flex-direction: row;
  & > img {
    width: 50px;
    height: 50px;
  }
}
.side-right {
  width: 600px;
  min-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 5px;
}
.other-info {
  display: flex;
  justify-content: space-between;
  & span:nth-child(2) {
    cursor: pointer;
    user-select: none;
  }
}
.nickname {
  color: #4c790d;
}
</style>
