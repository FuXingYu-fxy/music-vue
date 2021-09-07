<template>
  <div class="play-list-container">
    <el-row :gutter="10" class="play-list-header">
      <el-col :span="8">
        <img :src="playList.coverImgUrl" alt="" class="cover">
      </el-col>
      <el-col :span="16">
        <div class="right-content">
          <div class="title">
            <img src="../image/playList.svg" alt="">
            <span>{{ playList.name }}</span>
          </div>
          <div class="operator">
            <el-button-group class="operator-item">
              <el-button type="primary" icon="el-icon-headset">播放</el-button>
              <el-button type="primary" icon="el-icon-circle-plus"/>
            </el-button-group>
            <el-button class="operator-item" type="primary" icon="el-icon-folder-add">{{ playList.subscribedCount }}
            </el-button>
          </div>
          <div class="tag">
            <span class="tag-item">标签: </span>
            <div class="tag-item">
              <el-tag
                  v-for="(tag, index) of playList.tags"
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
            <p class="description-item">{{ playList.description }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="play-list-brief">
      <el-row :gutter="10" type="flex" align="bottom">
        <el-col :span="6">
          <span class="play-list-brief-item" style="font-size: 2em">歌曲列表</span>
        </el-col>
        <el-col :span="3">
          <span class="play-list-brief-item">{{ playList.trackIds.length }} 首歌曲</span>
        </el-col>
        <el-col :span="10" :push="5">
          <span class="play-list-brief-item"><strong style="color: red">{{ playList.playCount }}</strong>次播放</span>
        </el-col>
      </el-row>
    </div>
    <el-divider/>
    <el-table
        @cell-click="play"
        :data="tableData"
        style="width: 100%">
      <el-table-column
          type="index"
          width="50">
      </el-table-column>
      <el-table-column
          label="歌曲标题">
        <template v-slot="{row}">
          <el-link
              icon="el-icon-video-play"
              :underline="false"
          >
            {{ row.songTitle }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
          prop="durationTime"
          label="时长"
          width="180">
      </el-table-column>
      <el-table-column
          prop="artists"
          label="歌手">
      </el-table-column>
      <el-table-column
          prop="album"
          label="专辑"
      >
      </el-table-column>
    </el-table>
    <el-button type="text" @click="loadRest" v-if="show" :loading="isLoading">加载更多。。。</el-button>
  </div>
</template>

<script>
import request from '@/request/request';
import {parseSongInfo} from '@/utils';
import {mapMutations} from 'vuex';
import {UPDATE_CURRENT_PLAY} from '@/store/actionType';

export default {
  name: "PlayList",
  props: ['id'],
  data() {
    return {
      // FIXME 创建 data 的时机比 created 早, 所以在 created 之前读取 data 中未初始化的数据会报错
      playList: null,
      colors: [
        '#FFC0CB',
        '#E6E6FA',
        '#FFA07A',
        '#FFFACD',
        '#98FB98',
        '#AFEEEE',
        '#B0C4DE',
      ],
      // 初始默认只显示 20 条, 如果继续滚动，则加载剩余数据
      restSongData: [],
      isLoading: false,
      show: true,
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentPlay: UPDATE_CURRENT_PLAY,
    }),
    play(songInfo) {
      const {album, artists, cover, durationTime, id, songTitle} = songInfo;
      const currentPlaySong = {album, artists, cover, durationTime, id, songTitle};
      this.updateCurrentPlay(currentPlaySong);
    },
    // 加载剩余数据
    loadRest() {
      this.isLoading = true;
      request.post('/song/detail', {
        ids: this.playList.trackIds.slice(20).map(item => item.id).join(','),
      }).then(({data}) => {
        if (data.code === 200) {
          this.restSongData = data.songs.map(parseSongInfo);
        } else {
          this.$message({
            message: `未知错误, 状态码: ${data.code}`,
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
      }).finally(() => {
        this.isLoading = false;
        this.show = false;
      })
    }
  },
  computed: {
    tableData() {
      const top20Data = this.playList.tracks.map(parseSongInfo);
      return top20Data.concat(this.restSongData);
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
    // 获取歌单
    request.get('/playlist/detail', {
      params: {
        id: this.id,
      }
    }).then(({data}) => {
      if (data.code === 200) {
        this.playList = data.playlist;
      } else {
        this.$message({
          message: `未知错误, 状态码: ${data.code}`,
          type: 'info'
        })
      }
    }).catch(err => {
      this.$message({
        message: '发生错误, 请到控制面板查看',
        type: 'error'
      })
      console.group('PlayList created');
      console.log(err);
      console.groupEnd('PlayList created');
    })
  }
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
}
</script>

<style lang="scss" scoped>
@mixin flex-layout($directions) {
  display: flex;
  @if $directions == 'row' {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  } @else {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

}

// 右边整块内容的 div
.right-content {
  & > div {
    margin: 3px 0;
  }
}

.play-list-container {
  margin-top: 20px;
}

.play-list-header {
  min-height: 250px;
}

.cover {
  width: 200px;
  height: 200px;
}

.title {
  @include flex-layout('row');

  img {
    width: 74px;
    height: 74px;
  }
}

.operator {
  @include flex-layout('row');

  .operator-item {
    margin: 0 3px;
  }
}

.tag {
  @include flex-layout('row');

  .tag-item {
    margin: 0 3px;
  }
}

.description {
  @include flex-layout('column');

  .description-item {
    text-align: left;
    margin: 0 3px;
  }
}

//.play-list-brief {
//  // 歌曲列表  xx 首歌曲   xx 次播放
//  @include flex-layout('row');
//  justify-content: space-between;
//  align-items: flex-end;
//
//  & > span:first-child {
//    font-weight: bold;
//    font-size: 2em;
//  }
//
//  & > span:nth-child(2) {
//    display: block;
//    transform: translateX(-300px);
//  }
//}
</style>