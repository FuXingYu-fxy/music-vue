<template>
  <div class="home">
    <!--    轮播图-->
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 6" :key="item">
        <img :class="`medium-${item}`" alt="" />
      </el-carousel-item>
    </el-carousel>
    <el-divider />
    <!--    <el-button type="primary" @click="sendRequest" :loading="isLoading" >get</el-button>-->

    <div style="text-align: left" ref="div">
      <el-link type="primary" :underline="false" @click="toTop"
        >推荐歌单</el-link
      >
      <RecommendList />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapMutations } from "vuex";
import { UPDATE_DAILY_PLAYLIST } from "@/store/actionType";
import request from "@/request/request";
import RecommendList from "@/components/RecommendList";
import {getNextTime} from '@/utils/index.js';

export default {
  name: "Home",
  components: { RecommendList },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations({
      updateDailyPlayList: UPDATE_DAILY_PLAYLIST,
    }),
    toTop() {
      this.$refs.div.scrollIntoView();
    },
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
    let resource = localStorage.getItem("recommendResource");
    let curId = localStorage.getItem("curId");
    let curTimestamp = Date.now();
    resource = resource && JSON.parse(resource);
    if (
      resource &&
      resource.curId === curId &&
      curTimestamp < resource.timestamp
    ) {
      this.updateDailyPlayList(resource.dailyPlayList);
      return;
    }

    // 没有缓存 或者缓存的用户id与当前的缓存id对应不上 就需要重新请求
    request
      .get("/recommend/resource")
      .then(({ data }) => {
        if (data.code === 200) {
          // id 歌单id
          // name 歌单名
          // copywriter 显示根据哪首歌区推荐的
          // picUrl 歌单图片
          const dailyPlayList = data.recommend.map((item) => {
            return {
              id: item.id,
              name: item.name,
              copywriter: item.copywriter,
              picUrl: item.picUrl,
            };
          });
          this.updateDailyPlayList(dailyPlayList);

          resource = {
            dailyPlayList,
            curId,
            timestamp: getNextTime(new Date()),
          };
          localStorage.setItem('recommendResource', JSON.stringify(resource));
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
        console.group("Home created");
        console.log(err);
        console.groupEnd("Home created");
      });
  },
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
};
</script>

<style lang="scss" scoped>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

@for $item from 1 through 6 {
  .medium-#{$item} {
    content: url("../image/img_#{$item}.png");
    width: 100%;
    height: auto;
  }
}
</style>