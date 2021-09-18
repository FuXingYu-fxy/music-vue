<template>
  <div class="play-list-container">
    <!--    描述播放列表的组件-->
    <PlayListDescription
        v-if="playList.playCount"
        :cover-img-url="playList.coverImgUrl"
        :description="playList.description"
        :name="playList.name"
        :subscribed-count="playList.subscribedCount"
        :tags="playList.tags"
    />
    <Calendar v-else/>
    <div class="play-list-brief">
      <el-row :gutter="10" type="flex" align="bottom">
        <el-col :span="6">
          <span class="play-list-brief-item" style="font-size: 2em">歌曲列表</span>
        </el-col>
        <el-col :span="3">
          <span class="play-list-brief-item">{{ playList.totalLen }} 首歌曲</span>
        </el-col>

        <!--    只有是根据id请求时才有这个字段-->
        <el-col :span="10" :push="5" v-if="playList.playCount">
          <span class="play-list-brief-item"><strong style="color: red">{{ playList.playCount }}</strong>次播放</span>
        </el-col>
      </el-row>
    </div>
    <el-divider/>
    <p v-if="initialDataIsLoading">加载中...</p>
    <el-table
        v-else
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
    <!--    只有是根据id请求时才有这个按钮-->
    <el-button type="text" @click="loadRest" v-if="id && show" :loading="isLoading">加载更多。。。</el-button>
  </div>
</template>

<script>
import request from '@/request/request';
import {parseSongInfo} from '@/utils';
import {mapMutations} from 'vuex';
import {UPDATE_CURRENT_PLAY} from '@/store/actionType';
import PlayListDescription from '@/components/PlayListDescription'
import Calendar from '@/components/Calendar';

export default {
  name: "PlayList",
  components: {PlayListDescription, Calendar},
  props: {
    id: {
      type: Number,
    },
    dailySongs: {
      type: Boolean,
    }
  },
  data() {
    return {
      initialDataIsLoading: true,
      playList: {},

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
      // 保存当前播放的音乐信息至 store
      this.updateCurrentPlay(currentPlaySong);
    },
    // 加载剩余数据
    loadRest() {
      this.isLoading = true;
      request.post('/song/detail', {
        ids: this.playList.totalList.slice(20).map(item => item.id).join(','),
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
      const list = this.playList.list;
      return list.concat(this.restSongData);
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
    // 默认根据 id 请求
    let requestUrl = '/playlist/detail';

    let params = {
      id: this.id,
    };

    if (this.dailySongs) {
      // 请求每日推荐歌曲, 不需要id
      requestUrl = '/recommend/songs'
      params = null;
    }
    if (!this.id && !this.dailySongs) {
      throw new Error('歌单id 为空');
    }

    request.get(requestUrl, {
      params: params,
    }).then(({data}) => {
      if (data.code === 200) {
        // 为了兼容多种 请求方式, playList 只能是一个对象
        if (this.dailySongs) {
          // 没仔细看清楚, 原来这个接口返回的数据里还有一个data字段
          data = data.data;
          let list = data.dailySongs && data.dailySongs.map(parseSongInfo);
          let totalLen = list.length;
          this.playList = {list, totalLen};
          this.initialDataIsLoading = false;
        } else {
          let list = data.playlist.tracks.map(parseSongInfo);
          const {trackIds: totalList, playCount, description, tags, name, coverImgUrl, subscribedCount} = data.playlist;
          let totalLen = totalList.length;
          this.playList = {list, totalLen, totalList, playCount, description, tags, name, coverImgUrl, subscribedCount};
          this.initialDataIsLoading = false;
        }

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

}

// ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
</script>

<style lang="scss" scoped>
.play-list-container {
  margin-top: 20px;
}
</style>