<template>
  <el-row :gutter="10" class="play-list-header">
    <el-col :span="8" :push="3">
      <img :src="coverImgUrl" alt="" class="cover" />
    </el-col>
    <el-col :span="16">
      <div class="right-content">
        <div class="title">
          <img src="../image/playList.svg" alt="" />
          <span>{{ name }}</span>
        </div>
        <div class="operator">
          <el-button-group class="operator-item">
            <el-button type="primary" icon="el-icon-headset" @click="addToPlay"
              >播放</el-button
            >
            <el-button type="primary" icon="el-icon-circle-plus" />
          </el-button-group>
          <el-button
            :class="['operator-item']"
            :type="subscribed ? 'success' : 'primary'"
            icon="el-icon-folder-add"
            @click="handleSubscribeClick"
            >{{ subscribedCountState }}
          </el-button>
        </div>
        <div class="tag">
          <span class="tag-item">标签: </span>
          <div class="tag-item">
            <el-tag
              v-for="(tag, index) of tags"
              :key="index"
              type="info"
              size="mini"
              :color="colors[index]"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <div class="description">
          <span class="description-item">简介: </span>
          <p class="description-item">{{ description }}</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { parseSongInfo, debounce } from "@/utils/index.js";
import { mapMutations } from "vuex";
import {
  UPDATE_CURRENT_PLAY,
  UPDATE_CURRENT_PLAY_LIST,
} from "@/store/actionType.js";
import request from "@/request/request.js";
export default {
  name: "PlayListDescription",
  props: {
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    subscribedCount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coverImgUrl: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      require: true,
    },
    playlistid: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      colors: [
        "#FFC0CB",
        "#E6E6FA",
        "#FFA07A",
        "#FFFACD",
        "#98FB98",
        "#AFEEEE",
        "#B0C4DE",
      ],
      subscribedCountState: this.subscribedCount,
      subscribed: false,
    };
  },
  methods: {
    ...mapMutations({
      updateCurrentPlay: UPDATE_CURRENT_PLAY,
      updateCurrentPlayList: UPDATE_CURRENT_PLAY_LIST,
    }),
    async addToPlay() {
      // 先将播放列表添加至播放队列
      if (this.list[0].length !== 0) {
        this.updateCurrentPlayList(this.list);
        const { data } = await request.get("/song/detail", {
          params: {
            ids: this.list[0].id,
          },
        });
        if (data.code === 200) {
          this.updateCurrentPlay(parseSongInfo(data.songs[0]));
        }
      }
    },
    subscribeDebounced: debounce(async function (subscribed, id) {
      const {data}  = await request.get("/playlist/subscribe", {
        params: {
          // 1收藏,  2取消收藏
          t: subscribed ? 1 : 2,
          id,
        },
      });
      if (data.code === 200) {
        this.$message({
          message: "操作成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "操作失败",
          type: "error"
        })
      }
    }, 2000),
    async handleSubscribeClick() {
      this.subscribed = !this.subscribed;
      this.subscribedCountState = this.subscribed
        ? this.subscribedCountState + 1
        : this.subscribedCountState - 1;
      this.subscribeDebounced(this.subscribed, this.playlistid);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/flex-layout";
// 右边整块内容的 div
.right-content {
  & > div {
    margin: 3px 0;
  }
}

.play-list-header {
  min-height: 250px;
}

.cover {
  width: 200px;
  height: 200px;
}

.title {
  @include flex-layout("row");

  img {
    width: 74px;
    height: 74px;
  }
}

.operator {
  @include flex-layout("row");

  .operator-item {
    margin: 0 3px;
  }
  color: red;
}

.tag {
  @include flex-layout("row");

  .tag-item {
    margin: 0 3px;
  }
}

.description {
  @include flex-layout("column");

  .description-item {
    text-align: left;
    margin: 0 3px;
  }
}
</style>