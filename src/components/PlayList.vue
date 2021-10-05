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
        style="width: 100%"
        class="scroll-table"
        height="400px"
        highlight-current-row
        v-el-table-infinite-scroll="load"
        infinite-scroll-disabled="disabled"

    >
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

      <template v-slot:append>
        <p v-show="loading">加载中...</p>
        <p v-show="noMore">没有更多了</p>
      </template>
    </el-table>
    <div style="height: 200px"></div>
  </div>
</template>

<script>
import request from '@/request/request';
import {parseSongInfo} from '@/utils';
import {mapMutations} from 'vuex';
import {UPDATE_CURRENT_PLAY, UPDATE_CURRENT_PLAY_LIST} from '@/store/actionType';
import elTableInfiniteScroll from 'el-table-infinite-scroll';


export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
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
      playList: [],
      loading: false,
      start: 0,
      // 一次性只显示20首
      end: 20,
      // 每次增加15首
      increment: 15,
    }
  },
  computed: {
    noMore() {
      // 如果是每日歌单，就不加载
      return this.playList.length >= this.totalLen;
    },
    disabled() {
      return this.loading || this.noMore;
    },
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
    load() {
      console.log('加载');
      this.loading = true;
      this.start = this.end;
      this.end += this.increment;
      const ids = this.ids.slice(this.start, this.end).map(item => item.id);
      this.getSongsByIds(ids).then(() => {
        this.loading = false;
      })
    },
    getSongsByIds(ids, initial = false) {
      return request.get('/song/detail', {
        params: {
          ids: ids.join(','),
        }
      }).then(({data}) => {
        if (data.code === 200) {
          if (initial) {
            // 如果是初次挂载，就要重置this.playList
            this.playList = data.songs.map(parseSongInfo);
          } else {
            // 否则只需要concat
            this.playList = this.playList.concat(data.songs.map(parseSongInfo));
          }
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
    }
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
        this.start = 0;
        this.end = 20;
        const ids = newIds.map(item => item.id);
        this.getSongsByIds(ids.slice(this.start, this.end), true);
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