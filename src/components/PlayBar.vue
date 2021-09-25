<template>
  <div class="music-controls">

    <div class="music-cover">
      <img :src="musicInfo.coverImgUrl" alt="专辑封面"/>
      <div class="music-info">
        <span>{{ musicInfo.name }}/{{ musicInfo.artists }}</span>
        <div class="button-list">
          <v-icon
              name="regular/heart"
              title="喜欢"
              scale="1"
          />

          <v-icon
              name="download"
              title="下载"
          />

          <v-icon
              name="regular/comment-dots"
              title="评论"
          />
        </div>
      </div>
    </div>


    <div class="control-center">

      <v-icon
          name="angle-double-left"
          :scale="controlCenterSize"
          title="上一首"
      />

      <!--播放按钮-->
      <v-icon
          :name="playBtn.name"
          :scale="controlCenterSize"
          :title="playBtn.title"
          @click="toggle"
      />

      <v-icon
          :scale="controlCenterSize"
          name="angle-double-right"
          title="下一首"
      />

    </div>

    <div class="rest-container">
      <span>04:15/{{ musicInfo.duration }}</span>
      <span>词</span>
      <div class="list">
        <v-icon
            name="headphones-alt"
            title="展开列表"
        />
        <span>3</span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
import {mapGetters} from 'vuex';
import defaultCover from '../image/defaultCover.jpg';
import request from '@/request/request';

export default {
  name: 'PlayBar',
  data() {
    return {
      controlCenterSize: 2,
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
      audio: null,
      paused: true,
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
    // 创建 audio
    this.audio = new Audio();
    this.audio.addEventListener('canplay', this.play);
    // 至于 为什么这个监听器不会丢失 this, 猜测是vue 内部对所有 methods 的函数都做了 bind 处理
    // this.audio.addEventListener('canplay', function() {
    //   console.log(this);
    // }.bind(this));
  },
  beforeDestroy() {
  },
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
  components: {
    'v-icon': Icon,
  },
  computed: {
    ...mapGetters(['currentPlaySong']),
    musicInfo() {
      const currentPlaySongs = this.currentPlaySong;
      if (!currentPlaySongs) {
        return {
          coverImgUrl: defaultCover,
          artists: 'xx',
          name: 'xxxxxxxxxxxx',
          duration: '03:21',
        }
      }
      return {
        coverImgUrl: currentPlaySongs.cover,
        artists: currentPlaySongs.artists,
        name: currentPlaySongs.songTitle,
        duration: currentPlaySongs.durationTime,
      }
    },
    playBtn() {
      // 如果是暂停状态，就要显示播放按钮，这里是反着来的
      const name = this.paused ? 'regular/play-circle' : 'regular/pause-circle';
      const title = this.paused ? '播放' : '暂停';
      return {
        name,
        title
      }
    },
  },

  methods: {
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
      this.audio.play();
      this.paused = false;
    },
    pause() {
      this.audio.pause();
      this.paused = true;
    },
    next() {
      console.log('播放下一首');
    },
    prev() {
      console.log('播放上一首');
    }
  },
  watch: {
    async currentPlaySong(musicInfo) {
      const id = musicInfo.id;
      try {
        let {data} = await request.get('/check/music', {
          params: {
            id,
          }
        });
        if (data.success) {
          // 再次请求
          let {data: result} = await request.get('/song/url', {
            params: {
              id,
            }
          });

          if (result.code === 200) {
            this.audio.src = result.data[0].url;
          } else {
            this.$message({
              message: `${result.msg}, 状态码: ${result.code}`,
              type: 'info'
            })
          }
        } else {
          this.$message({
            message: `${data.message}`,
            type: 'info'
          })

        }
      } catch (err) {
        const data = err.response.data;
        this.$message({
          message: `${data.message}`,
          type: 'error'
        })

        console.group('watch currentPlaySong');
        console.log(err);
        console.groupEnd('watch currentPlaySong');
      }


    },
  },

}
</script>

<style lang="scss" scoped>
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
  width: 100%;
  padding: 0 8px;
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
    background-color: #f0f8ffc9;
    backdrop-filter: blur(5px);
  }
}

.music-cover {
  display: flex;
  flex-direction: row;

  img {
    width: $music-controls-height;
    height: $music-controls-height;
    border-radius: 50%;
  }
}

.music-info {
  // 歌曲名
  // 点赞、下载、评论按钮
  display: flex;
  flex-direction: column;

  span {
    margin-left: 15px;
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
  transition: .5s;

  & > * {
    margin: 0 10px;
    cursor: pointer;
  }

  & > *:not(:first-child):hover {
    color: teal;
  }

}
</style>