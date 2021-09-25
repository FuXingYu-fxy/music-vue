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

      <v-icon
          name="regular/play-circle"
          :scale="controlCenterSize"
          title="播放"
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
      audio: null,
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  mounted() {
    // 创建 audio
    this.audio = new Audio();
    this.audio.addEventListener('canplay', () => {
      // 当终端可以播放媒体文件时触发该canplay事件，估计加载足够的数据来播放媒体直到其结束，而不必停止以进一步缓冲内容。
      this.audio.play();
    })
  },
  beforeDestroy() {
    this.audio = null;
  },
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
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
  },
  components: {
    'v-icon': Icon,
  },
  methods: {
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
          })
          if (result.code === 200) {
            this.audio.src = result.data[0].url;
          } else {
            this.$message({
              message: `${result.msg}, 状态码: ${result.code}`,
              type: 'info'
            })
          }
          console.log(result);
          // this.audio.src = result;
        } else {
          this.$message({
            message: `${data.message}`,
            type: 'info'
          })
        }
      } catch (err) {
        this.$message({
          message: '发生错误, 请到控制面板查看',
          type: 'error'
        })
        console.group('watch currentPlaySong');
        console.log(err);
        console.groupEnd('watch currentPlaySong');
      }


    }
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