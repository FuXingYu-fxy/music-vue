<template>
  <div class="FM" :style="{
    backgroundImage: `url(${PriFM ? PriFM.coverImgUrl : fallBackCoverImgUrl})`,
  }">
    <div class="cover">
      <img :src="PriFM ? PriFM.coverImgUrl : fallBackCoverImgUrl" alt="">
    </div>
    <div class="song-info">
      <span>个性电台</span>
      <span>{{ PriFM ? PriFM.name : fallBackName}}</span>
      <span>{{ PriFM ? PriFM.artists : fallBackArtists }}</span>
      <div class="controls">
        <v-icon @click="next" name="step-forward" :scale="size" title="手气不错?"/>
        <v-icon @click="like" name="regular/heart" :scale="size" title="喜欢"/>
        <v-icon @click="dislike" name="heart-broken" :scale="size" title="不喜欢"/>
        <v-icon @click="showComment" name="comment-dots" :scale="size" title="评论"/>
      </div>
    </div>
  </div>

</template>

<script>
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import request from '@/request/request'
import {parseSongInfo} from '@/utils'
import {UPDATE_CURRENT_PLAY} from '@/store/actionType';
import {mapMutations} from 'vuex';

export default {
  name: "PersonalFM",
  components: {
    'v-icon': Icon,
  },
  data() {
    return {
      size: '1.6',
      // 未加载时的备用 cover-img-url
      fallBackCoverImgUrl: 'https://p2.music.126.net/wtiI4Tzal-1ynR-Z700pfg==/109951165741124381.jpg',
      fallBackName: '目及皆是你',
      fallBackArtists: '小蓝背心',
      PriFM: null,

      // 当前音乐的id
      currentPlayId: undefined,

      // 当前的FM 列表, 获取玩后会重新请求
      currentPlayList: null,

      // 当前索引, 越界后会重新请求
      playListIndex: 0,
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentPlay: UPDATE_CURRENT_PLAY,
    }),
    like() {
      console.log('I like this music');
    },
    dislike() {
      console.log('I dislike this music');
    },
    showComment() {
      console.log('comment is loading...');
    },
    next() {
      // 先判断一下，currentPlayList 拿完后再重新请求
      const currentPlayList = this.currentPlayList;
      const index = this.playListIndex;
      // 如果拿完了或者 currentPlayList为空, 就要重新请求
      const reRequest = currentPlayList ? currentPlayList.length <= index : true;

      if (!reRequest) {
        // 不用重新请求
        this.PriFM = currentPlayList[this.playListIndex++];
        this.currentPlayId = this.PriFM.id;
        return;
      }
      request.get('/personal_fm')
          .then(({data}) => {
            if (data.code === 200) {
              this.currentPlayList = data.data.map(item => {
                return {
                  name: item.name,
                  id: item.id,
                  artists: item.artists.map(item => item.name).join('/'),
                  coverImgUrl: item.album.picUrl,
                }
              });

              this.PriFM = this.currentPlayList[0];
              this.currentPlayId = this.PriFM.id;
              this.playListIndex  = 1;
            } else {
              this.$message({
                message: `${data.msg}, 状态码: ${data.code}`,
                type: 'info'
              })
            }
          }).catch(err => {
        this.$message({
          message: '发生错误, 请到控制面板查看',
          type: 'error'
        })
        console.group('PersonalFM methods');
        console.log(err);
        console.groupEnd('PersonalFM methods');
      })

    }
  },
  watch: {
    currentPlayId(id) {
      request.get('/song/detail', {
        params: {
          ids: id,
        }
      }).then(({data}) => {
        if (data.code === 200) {
          const playList = data.songs.map(parseSongInfo);
          // 保存到 store
          this.updateCurrentPlay(playList[0]);
        } else {
          this.$message({
            message: `${data.msg}, 状态码: ${data.code}`,
            type: 'info'
          })
        }
      }).catch(err => {
        this.$message({
          message: '发生错误, 请到控制面板查看',
          type: 'error'
        })
        console.group('PlayList loadRest');
        console.log(err);
        console.groupEnd('PlayList loadRest');
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/flex-layout";

$radius: 15px;
$cover-size: 200px;
$fm-color: #fffafab3;
.FM {
  @include flex-layout('row');
  justify-content: space-around;
  background-repeat: no-repeat;
  background-size: cover;
  margin: auto;
  height: 250px;
  width: 700px;
  border-radius: $radius;
  position: relative;

  &::before,
  &::after {
    border-radius: inherit;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    background-color: rgba(0, 0, 0, 0.1);
  }

  &::before {
    background-color: initial;
    backdrop-filter: blur(20px);
    z-index: 1;
  }
}

.cover {
  width: $cover-size;
  height: $cover-size;
  margin-right: 20px;
  position: relative;
  z-index: 2;

  & > img {
    width: inherit;
    height: inherit;
    border-radius: $radius;
  }
}

.song-info {
  @include flex-layout('column');
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  z-index: 2;
  height: $cover-size;
  width: 400px;

  & > span {
    display: block;
  }

  & > span:nth-child(1) {
    // 电台
    cursor: default;
    padding: 2px 10px;
    color: $fm-color;
    background-color: rgba(0, 0, 0, 0.38);
    border-radius: $radius;
  }

  & > span:nth-child(2) {
    // 歌曲名
    color: white;
    font-size: 20px;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > span:nth-child(3) {
    color: $fm-color;
  }
}

.controls {
  @include flex-layout('row');
  justify-content: space-between;
  width: $cover-size;
  color: #bef6db;
  position: relative;
  z-index: 2;
}
</style>