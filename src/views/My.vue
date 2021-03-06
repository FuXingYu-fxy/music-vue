<template>
  <div class="my-container">
    <div class="banner" ref="banner">
      <img class="avatar" alt="avatar" :src="avatar" />
      <div class="user-profile">
        <h1>{{ nickname }}</h1>
        <ul>
          <li>
            <a href="#">
              <strong>{{ follows }}</strong>
              <span>关注</span>
            </a>
          </li>
          <li>
            <a href="">
              <strong>{{ followeds }}</strong>
              <span>粉丝</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="recommend">
      <h3>Hi,{{ nickname }}</h3>
      <h5>今日为你推荐</h5>
      <el-tabs v-model="activeName">
        <el-tab-pane label="今日推荐" name="first">
          <keep-alive>
            <PlayList
              v-if="activeName == 'first'"
              :song-details="songDetails"
              :total-len="totalLen"
            >
              <template v-slot:calendar>
                <Calendar />
              </template>
            </PlayList>
          </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="私人FM" name="second">
          <keep-alive>
            <PersonalFM v-if="activeName == 'second'" />
          </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="我的歌单" name="third">
          <keep-alive>
            <div v-if="activeName == third">
              <UserFavoritePlayList
                @goToPlayList="requestSongs"
                v-show="showUserFavoritePlayList"
              />
              <PlayList
                :ids="ids"
                :total-len="ids ? ids.length : 0"
                v-show="!showUserFavoritePlayList"
              >
                <template v-slot:back-button>
                  <el-button type="primary" @click="toggle" size="mini"
                    >返回</el-button
                  >
                </template>
              </PlayList>
            </div>
          </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="尖叫榜" name="fourth">
          <keep-alive>
            <div v-if="activeName == 'fourth'">
              <div class="scream">
                <HotPlayList
                  v-show="showScreamPlayList"
                  @goToPlayList="requestSongs"
                />
              </div>
              <PlayList
                :ids="screamPlayListIds"
                :total-len="screamPlayListIds ? screamPlayListIds.length : 0"
                v-show="!showScreamPlayList"
              >
                <template v-slot:back-button>
                  <el-button
                    type="primary"
                    @click="toggleScreamPlayListState"
                    size="mini"
                    >返回</el-button
                  >
                </template>
              </PlayList>
            </div>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parseSongInfo, throttle } from "@/utils";
import request from "@/request/request";
import Calendar from "@/components/Calendar";
import UserFavoritePlayList from "@/components/UserFavoritePlayList";
import PersonalFM from "@/components/PersonalFM";
import HotPlayList from "../components/HotPlayList.vue";
import { getNextTime } from "@/utils/index.js";
import avatarFallback from "../image/avatar-fallback.jpg";

const eventType = {
  HOTPLAYLIST: "HotPlayList",
  USERFAVORITEPLAYLiST: "UserFavoritePlayList",
};
// const UserFavoritePlayList = () => import('../components/UserFavoritePlayList');
const PlayList = () => import("../components/PlayList");
// import {throttle} from '@/utils';

export default {
  name: "My",
  components: {
    PlayList,
    UserFavoritePlayList,
    Calendar,
    PersonalFM,
    HotPlayList,
  },

  data() {
    return {
      activeName: "first",
      songDetails: null,
      ids: null,
      // 我的收藏歌单的组件列表
      showUserFavoritePlayList: true,
      // 尖叫榜
      showScreamPlayList: true,
      // 尖叫榜的id
      screamPlayListIds: null,
      // user profile
      avatar: "",
      nickname: "",
      // 粉丝
      followeds: 0,
      // 关注的人数
      follows: 0,
    };
  },
  created() {
    let resource = localStorage.getItem("recommendSongs");
    let curId = localStorage.getItem("curId");
    let curTimestamp = Date.now();
    resource = resource && JSON.parse(resource);
    if (
      resource &&
      resource.curId === curId &&
      curTimestamp < resource.timestamp
    ) {
      this.songDetails = resource.songDetails;
      return;
    }
    // 每日推荐歌曲的接口
    request
      .post("/recommend/songs")
      .then(({ data }) => {
        if (data.code === 200) {
          // 注意这个接口返回的数据有两层data
          this.songDetails = data.data.dailySongs.map(parseSongInfo);

          resource = {
            songDetails: this.songDetails,
            curId,
            timestamp: getNextTime(new Date()),
          };
          localStorage.setItem("recommendSongs", JSON.stringify(resource));
        } else {
          this.$message({
            message: `${data.msg}, 状态码: ${data.code}`,
            type: "info",
          });
        }
      })
      .catch((err) => {
        this.$message({
          message: "发生错误, 请到控制面板查看",
          type: "error",
        });
        console.group("PlayList loadRest");
        console.log(err);
        console.groupEnd("PlayList loadRest");
      });
  },
  methods: {
    updateHeight: throttle(function () {
      let recommend = document.querySelector(".recommend");
      let referenceHeight = document.querySelector(".banner").clientHeight;
      let start = 0;
      let end = 200;
      let rate = window.pageYOffset / (end - start);
      if (rate >= 1) {
        return;
      }
      let offset = rate * referenceHeight;
      recommend.style.transform = `translateY(-${offset}px)`;
    }, 80),
    toggleScreamPlayListState() {
      this.showScreamPlayList = !this.showScreamPlayList;
    },
    toggle() {
      this.showUserFavoritePlayList = !this.showUserFavoritePlayList;
    },
    requestSongs(playListId, type) {
      // 根据 歌单id 请求歌单
      request
        .get("/playlist/detail", {
          params: {
            id: playListId,
          },
        })
        .then(({ data }) => {
          if (data.code === 200) {
            const ids = data.playlist.trackIds;
            if (type === eventType.USERFAVORITEPLAYLiST) {
              this.ids = ids;
              // 改变用户收藏歌单和播放列表的显示
              this.toggle();
            }
            if (type === eventType.HOTPLAYLIST) {
              this.screamPlayListIds = ids;
              this.toggleScreamPlayListState();
            }
          } else {
            this.$message({
              message: `${data.msg}, 状态码: ${data.code}`,
              type: "info",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "发生错误, 请到控制面板查看",
            type: "error",
          });
          console.group("PlayListContainer created");
          console.log(err);
          console.groupEnd("PlayListContainer created");
        });
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    totalLen() {
      return this.songDetails ? this.songDetails.length : 0;
    },
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  mounted() {
    window.addEventListener("scroll", this.updateHeight);
    // 加载用户信息
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { avatarUrl, followeds, follows, nickname } = userInfo.profile;
      this.avatar = avatarUrl;
      this.nickname = nickname;
      this.followeds = followeds;
      this.follows = follows;
    } catch {
      this.avatar = avatarFallback;
      this.nickname = "获取用户名失败";
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.updateHeight);
  },
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
};
</script>

<style lang="scss" scoped>
.my-container {
  text-align: center;
}
.recommend {
  transition: 0.1s;
  background: white;
}
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
  transition: height 0.2s;

  .avatar {
    content: url("");
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
          transition: 0.5s;
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
.scream {
  display: flex;
  justify-content: center;
}
</style>