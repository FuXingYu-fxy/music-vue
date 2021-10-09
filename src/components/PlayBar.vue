<template>
  <div style="position: relative">
    <el-drawer
        title="播放队列"
        :visible.sync="drawer"
        direction="rtl"
    >
      <div class="play-queue">
        <span
            v-for="(item, index) of currentPlayList"
            :key="item.id"
            :class="{'current-play-music': index === currentIndex}"
            @click="updateCurrentPlayListByIndex(index)"
        >
          {{ item.songTitle }}
          <hr>
        </span>
      </div>
    </el-drawer>
    <comment :status.sync="commentStatus" :id="currentMusicId" />
    <div class="music-controls">
      <div class="process">
        <div class="process-bar" :style="currentPosition"></div>
      </div>
      <div class="music-cover">
        <img
            :class="['cover-spin', audio.paused ? 'cover-paused' : 'cover-running']"
            :src="musicInfo.coverImgUrl"
            alt="专辑封面"
        />
        <div class="music-info">
          <div class="music-name">
            <span>{{ musicInfo.name }}/{{ musicInfo.artists }}</span>
          </div>
          <div class="button-list">
            <v-icon
                :name="likeThisMusic ? 'regular/heart' : 'heart'"
                title="喜欢"
                scale="1"
                :style="{
              color: likeThisMusic ? '' : 'teal',
            }"
                @click="like"
            />

            <v-icon name="download" title="下载"/>

            <v-icon name="regular/comment-dots" title="评论" @click="commentStatus='grow'"/>
          </div>
        </div>
      </div>

      <div class="control-center">
        <v-icon
            name="angle-double-left"
            :scale="controlCenterSize"
            title="上一首"
            @click="prev"
        />

        <!--播放按钮-->
        <v-icon
            :name="audio.paused ? 'regular/play-circle' : 'regular/pause-circle'"
            :scale="controlCenterSize"
            :title="audio.paused ? '播放' : '暂停'"
            @click="toggle"
        />

        <v-icon
            :scale="controlCenterSize"
            name="angle-double-right"
            title="下一首"
            @click="next"
        />
      </div>

      <div class="rest-container">
        <span>{{ durationTime }}/{{ musicInfo.duration }}</span>
        <span>词</span>
        <div class="list" @click="toggleDrawer">
          <v-icon name="headphones-alt" title="播放队列"/>
          <span>{{musicCount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
import {mapGetters, mapMutations,} from "vuex";
import {UPDATE_CURRENT_PLAY} from '@/store/actionType.js';
import defaultCover from "../image/defaultCover.jpg";
import request from "@/request/request";
import {formatDuration} from "@/utils/index.js";
import {debounce} from "@/utils/index.js";
import Comment from './Comment.vue';

export default {
  name: "PlayBar",
  components: {
    "v-icon": Icon,
    Comment,
  },
  data() {
    return {
      /**
       * 属性:
       *    paused: 当前媒体是否暂停 => boolean
       *    src: 媒体来源 => url
       *    muted: 是否静音 => boolean
       *    loop: 是否循环播放 => boolean
       *    duration: 只读 => 音频在时间轴中的持续时间（总长度）
       *    currentTime: 当前媒体播放的位置，可通过修改该属性跳到音轨上的任意位置
       *
       * 事件:
       *    play: paused 属性改变时会触发该事件, 也可以由同名方法触发 => 是异步的
       *    pause: paused 属性改变时会触发该事件, 也可以由同名方法触发 => 是异步的
       *    timeupdate: 歌曲播放时会一直触发该事件, 可通过handler参数获得当前音乐的播放位置
       *    volumechange: 音量变化
       *    ended: 播放结束
       */
      controlCenterSize: 2,
      audio: null,
      currentTime: 0,
      duration: 0,
      // 喜欢歌曲时, 要传入true
      likeThisMusic: true,
      currentIndex: 0,
      drawer: false,
      commentStatus: 'shrink',
      currentMusicId: 0,
    };
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
    // 创建 audio
    this.audio = new Audio();
    this.audio.addEventListener("canplay", this.play);
    this.audio.addEventListener("ended", this.next);
    this.audio.addEventListener("timeupdate", this.handleTimeupdate);
    // 至于 为什么这个监听器不会丢失 this, 猜测是vue 内部对所有 methods 的函数都做了 bind 处理
    // this.audio.addEventListener('canplay', function() {
    //   console.log(this);
    // }.bind(this));
  },
  beforeDestroy() {
    // 移除绑定的事件
    this.audio.removeListener("canplay", this.play);
    // 播放结束后自动播放下一首
    this.audio.removeListener("ended", this.next);
    this.audio.removeListener("timeupdate", this.handleTimeupdate);
  },
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑

  computed: {
    ...mapGetters(["currentPlaySong", "currentPlayList"]),
    currentPosition() {
      let rate = (this.currentTime / (this.duration / 1000)) * 100;
      return {
        width: rate.toFixed(2) + "%",
      };
    },
    musicInfo() {
      const currentPlaySongs = this.currentPlaySong;
      if (!currentPlaySongs) {
        return {
          coverImgUrl: defaultCover,
          artists: "xx",
          name: "xxxxxxxxxxxx",
          duration: "03:21",
        };
      }
      return {
        coverImgUrl: currentPlaySongs.cover,
        artists: currentPlaySongs.artists,
        name: currentPlaySongs.songTitle,
        duration: currentPlaySongs.durationTime,
        dt: currentPlaySongs.dt,
      };
    },

    durationTime() {
      if (this.currentTime === 0) {
        return "00:00";
      } else {
        return formatDuration(this.currentTime * 1000);
      }
    },
    musicCount() {
      return this.currentPlayList ? this.currentPlayList.length : 0;
    }
  },

  methods: {
    ...mapMutations({
      updateCurrentPlay: UPDATE_CURRENT_PLAY,
    }),
    toggle() {
      // 当终端可以播放媒体文件时触发该canplay事件，估计加载足够的数据来播放媒体直到其结束，而不必停止以进一步缓冲内容。
      if (this.audio.paused) {
        // 如果当前 是暂停状态, 就要播放音乐
        this.play();
      } else {
        // 否则就暂停音乐
        this.pause();
      }
    },
    play() {
      if (this.audio.paused) {
        this.audio.play();
      }
    },
    pause() {
      if (!this.audio.paused) {
        this.audio.pause();
      }
    },
    next() {
      let index = (this.currentIndex + 1) % this.currentPlayList.length;
      this.updateCurrentPlayListByIndex(index);
      console.log("播放下一首");
    },
    prev() {
      let index = this.currentIndex - 1;
      index = index < 0 ? this.currentPlayList.length - 1 : index;
      this.updateCurrentPlayListByIndex(index);
      console.log("播放上一首");
    },
    updateCurrentPlayListByIndex(index) {
      let currentPlayInfo = this.currentPlayList[index];
      currentPlayInfo.index = index;
      this.updateCurrentPlay(currentPlayInfo);
    },
    handleTimeupdate() {
      this.currentTime = this.audio.currentTime;
    },
    debouncedFn: debounce(function (url, id, currentState) {
      request.get(url, {
        params: {
          id: id,
          // 状态已经发生改变, 发送请求的是上一次的状态
          like: !currentState,
        },
      });
    }, 2000),
    like() {
      if (this.currentTime === 0) {
        return;
      }
      this.likeThisMusic = !this.likeThisMusic;
      this.debouncedFn("/like", this.currentPlaySong.id, this.likeThisMusic);
    },
    toggleDrawer() {
      this.drawer = true;
    },
  },
  watch: {
    async currentPlaySong(musicInfo) {
      this.currentIndex = musicInfo.index;
      this.likeThisMusic = true;
      // 毫秒表示的时间
      this.duration = musicInfo.dt;
      const id = musicInfo.id;
      try {
        let {data} = await request.get("/check/music", {
          params: {
            id,
          },
        });
        if (data.success) {
          // 再次请求
          let {data: result} = await request.get("/song/url", {
            params: {
              id,
            },
          });

          if (result.code === 200) {
            // 添加 url, 开始播放
            this.audio.src = result.data[0].url;
            this.currentMusicId = id;
          } else {
            this.$message({
              message: `${result.msg}, 状态码: ${result.code}`,
              type: "info",
            });
          }
        } else {
          this.$message({
            message: `${data.message}`,
            type: "info",
          });
        }
      } catch (err) {
        console.log(err.response);
        const data = err.response.data;
        this.$message({
          message: `${data.message}`,
          type: "error",
        });

        console.group("watch currentPlaySong");
        console.log(err);
        console.groupEnd("watch currentPlaySong");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/scrollbar-style";

$music-controls-height: 60px;

.music-controls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: $music-controls-height;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  // min-width: 400px;
  width: 100vw;
  // 为进度条留出空隙
  padding: 8px 8px 0;
  z-index: 3;

  &::before {
    content: "";
    position: absolute;
    /* position: fixed; */
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    backdrop-filter: blur(3px);
  }
}

.process {
  position: absolute;
  height: 4px;
  width: 100%;
  top: 0;

  .process-bar {
    position: absolute;
    background-color: teal;
    height: 100%;
  }
}

.music-cover {
  display: flex;
  flex-direction: row;

  img {
    width: $music-controls-height - 5;
    height: $music-controls-height - 5;
    border-radius: 50%;
  }
}

.music-info {
  // 歌曲名
  // 点赞、下载、评论按钮
  display: flex;
  flex-direction: column;

  .music-name {
    position: relative;
    min-width: 100px;

    span {
      position: absolute;
      margin-left: 15px;
      left: 0;
      white-space: nowrap;
    }
  }


  .button-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    cursor: pointer;

    & > * {
      margin: 10px 15px;
    }
  }

  justify-content: space-between;
}

.control-center {
  min-width: 300px;

  & > * {
    cursor: pointer;
    margin: 0 30px;
  }
}

.rest-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  transition: 0.5s;

  & > * {
    margin: 0 10px;
    cursor: pointer;
  }

  & > *:not(:first-child):hover {
    color: teal;
  }
}

.cover-spin {
  animation: spin 20s infinite linear;
}

.cover-paused {
  animation-play-state: paused;
}

.cover-running {
  animation-play-state: running;
}

@keyframes spin {
  100% {
    transform: rotate(1turn);
  }
}

.play-queue {
  overflow: auto;
  @include scrollbar();
  height: 100%;

  & > span:hover {
    cursor: pointer;
    color: #99a9bf;
  }
}
.current-play-music {
  color: #31c27c;
}
</style>