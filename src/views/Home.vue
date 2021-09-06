<template>
  <div class="home">
    <!--    轮播图-->
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3 class="medium">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    <el-divider/>
    <!--    <el-button type="primary" @click="sendRequest" :loading="isLoading" >get</el-button>-->

    <div style="text-align: left" ref="div">
      <el-link type="primary" :underline="false" @click="toTop">推荐歌单</el-link>
      <RecommendList/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapMutations} from 'vuex';
import {UPDATE_DAILY_PLAYLIST} from '@/store/actionType';
import request from '@/request/request';
import RecommendList from '@/components/RecommendList';

export default {
  name: 'Home',
  components: {RecommendList},
  data() {
    return {
      isLoading: false,
    }
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
    // 请求每日推荐歌单
    request.get('/recommend/resource')
        .then(({data}) => {
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
                picUrl: item.picUrl
              }
            });
            this.updateDailyPlayList(dailyPlayList);
          } else {
            this.$message({
              message: `未知错误, 状态码: ${data.code}`,
              type: 'info'
            })
          }
        })
        .catch((err) => {
          this.$message({
            message: '发生错误, 请到控制面板查看',
            type: 'error'
          })
          console.group('Login');
          console.log(err);
          console.groupEnd('Login');
        })
  }
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 3em;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>