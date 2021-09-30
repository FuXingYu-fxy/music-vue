<template>
  <p v-if="ids === undefined && songDetails === undefined">加载中...</p>
  <div class="play-list-container" v-else>
    <slot name="play-list-description"></slot>
    <slot name="calendar"></slot>
    <div class="play-list-brief">
      <el-row :gutter="10" type="flex" align="bottom">
        <el-col :span="2">
          <slot name="back-button"></slot>
        </el-col>
        <el-col :span="6">
          <span class="play-list-brief-item" style="font-size: 2em">歌曲列表</span>
        </el-col>

        <el-col :span="3" v-if="totalLen">
          <span class="play-list-brief-item">{{ totalLen }} 首歌曲</span>
        </el-col>

        <el-col :span="6" :push="5" v-if="playCount">
          <span class="play-list-brief-item"><strong style="color: red">{{ playCount }}</strong>次播放</span>
        </el-col>
      </el-row>
    </div>
    <el-divider/>
    <el-table
        :data="playList"
        style="width: 100%">
      <el-table-column
          type="index"
          width="50">
      </el-table-column>
      <el-table-column
          label="歌曲标题">
        <template v-slot="{row, $index}">
          <el-link
              @click="play(row, $index)"
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
  </div>
</template>

<script>
import request from '@/request/request';
import {parseSongInfo} from '@/utils';
import {mapMutations} from 'vuex';
import {UPDATE_CURRENT_PLAY, UPDATE_CURRENT_PLAY_LIST} from '@/store/actionType';

export default {
  name: "PlayList",
  props: {
    ids: {
      // 传入的是一个对象数组, 其中必须存在 id 字段
      validator(arr) {
        return arr.every(item => typeof item.id !== 'undefined');
      }
    },
    totalLen: {
      type: Number,
    },
    playCount: {
      type: Number,
    },
    songDetails: {
      // 也可以直接传入歌曲信息
      type: Array,
    }
  },
  data() {
    return {
      playList: null,
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentPlay: UPDATE_CURRENT_PLAY,
      updateCurrentPlayList: UPDATE_CURRENT_PLAY_LIST,
    }),
    play(songInfo, index) {
      // index 未添加响应式
      songInfo.index = index;
      this.updateCurrentPlay(songInfo);
      // 将播放列表保存到 store
      this.updateCurrentPlayList(this.playList);
    },
  },
  watch: {
    songDetails: {
      handler(newSongs) {
        if (!newSongs) return;
        // 如果用在每日推荐歌曲, 每日推荐歌曲的接口会直接返回音乐数据，不用再根据id请求
        this.playList = newSongs;
      },
      immediate: true,
    },
    ids: {
      handler(newIds) {
        if (!newIds) return;
        const ids = newIds.map(item => item.id);
        // POST请求url必须添加时间戳,使每次请求url不一样,不然请求会被缓存
        request.get('/song/detail', {
          params: {
            ids: ids.slice(0, 20).join(','),
            timestamp: Date.now(),
          }
        }).then(({data}) => {
          if (data.code === 200) {
            this.playList = data.songs.map(parseSongInfo);
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
      immediate: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.play-list-container {
  margin-top: 20px;
}
</style>