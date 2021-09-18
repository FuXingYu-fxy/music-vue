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
          <PlayList :daily-songs="true"/>
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
import {throttle} from '@/utils';
import request from '@/request/request';

const UserFavoritePlayList = () => import('../components/UserFavoritePlayList');
const PlayList = () => import('../views/PlayList');

export default {
  name: "My",
  components: {PlayList, UserFavoritePlayList},
  data() {
    return {
      bannerHeight: 0,
      offsetY: 0,
      activeName: 'third',
    }
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