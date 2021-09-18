<template>
  <div style="height: 200vh">
    <div class="banner" ref="banner" :style="dynamicHeight">
      <img class="avatar" alt="avatar">
      <div class="user-profile">
        <h1>帮主我们唐门不能群龙无首啊</h1>
        <ul>
          <li>
            <a href="#">
              <strong>0</strong>
              <span>关注</span>
            </a>
          </li>
          <li>
            <a href="">
              <strong>0</strong>
              <span>粉丝</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="recommend">
      <h3>Hi,帮助我们唐门不能群龙无首啊</h3>
      <h5>今日为你推荐</h5>
      <el-tabs v-model="activeName">
        <el-tab-pane label="今日推荐" name="first">
            <p v-if="isInitialData">加载中。。。</p>
            <PlayList
                v-else
                :song-details="songDetails"
                :total-len="totalLen"
            >
              <template v-slot:calendar>
                <Calendar/>
              </template>
            </PlayList>
        </el-tab-pane>

        <el-tab-pane label="私人FM" name="second">
          <el-button type="primary" @click="send">私人FM</el-button>
        </el-tab-pane>
        <el-tab-pane label="我的歌单" name="third">
          <UserFavoritePlayList @fuxingyu="send"/>
        </el-tab-pane>

        <el-tab-pane label="尖叫榜" name="fourth">
          <h2>尖叫榜</h2>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {parseSongInfo, throttle} from '@/utils';
import request from '@/request/request';
import Calendar from '@/components/Calendar';

const UserFavoritePlayList = () => import('../components/UserFavoritePlayList');
const PlayList = () => import('../components/PlayList');

export default {
  name: "My",
  components: {
    PlayList,
    UserFavoritePlayList,
    Calendar,
  },

  data() {
    return {
      bannerHeight: 0,
      offsetY: 0,
      activeName: 'first',
      songDetails: null,
      isInitialData: true,
    }
  },
  created() {
    // 每日推荐歌曲的接口
    request.post('/recommend/songs')
        .then(({data}) => {
          if (data.code === 200) {
            // 注意这个接口返回的数据有两层data
            this.songDetails = data.data.dailySongs.map(parseSongInfo);
            this.isInitialData = false;
          } else {
            this.$message({
              message: `未知错误, 状态码: ${data.code}`,
              type: 'info'
            })
          }
        })
        .catch(err => {
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
  },
  methods: {
    setOffsetY: throttle(function () {
      this.offsetY = window.pageYOffset;
    }, 100),
    send() {
      // const uid = this.getUserInfo.id;
      const uid = 32953014;
      request.get('/user/playlist', {
        params: {
          uid
        }
      }).then(({data}) => {
        console.log(data);
      })
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    dynamicHeight() {
      let start = 0;
      let end = 200;
      if (this.bannerHeight === 0) {
        return;
      }
      let rate = (end - this.offsetY) / (end - start);
      let result = rate * this.bannerHeight;
      if (result <= 0) {
        return {
          height: 0 + 'px',
        }
      }
      return {
        height: result + 'px',
      }
    },
    totalLen() {
      return this.songDetails ? this.songDetails.length : 0;
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  mounted() {
    // window.addEventListener('scroll', this.setOffsetY);
    // this.bannerHeight = this.$refs.banner.clientHeight;
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.setOffsetY);
  }
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑

}
</script>

<style lang="scss" scoped>
.banner {
  margin-top: 10px;
  background-image: url("../image/music-player.jpg");
  width: 100%;
  height: 60vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  position: relative;
  overflow: hidden;
  transition: height .2s;

  .avatar {
    content: url("../image/avatar-fallback.jpg");
    position: relative;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: auto;
    display: block;
    border: 2px solid #ade2e2;
    border-radius: 50%;
  }
}

.user-profile {
  h1 {
    color: white;
  }

  ul {
    list-style: none;

    & li {
      display: inline-block;
      margin: 0 10px;

      & a {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: white;

        & > strong {
          transition: .5s;
          font-size: 1.3em;
        }

        &:hover > strong {
          color: #31c27c;
        }
      }
    }

    &:first-child {
      border-right: 1px solid red;
    }
  }
}

</style>