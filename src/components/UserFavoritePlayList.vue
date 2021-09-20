<template>
  <div class="user-favorite-play-list">
    <div
      v-for="music of playList"
      @click="goToPlayList(music.id)"
      :key="music.id"
    >
      <figure>
        <img :src="music.coverImgUrl" alt="" class="cover-img" />
        <figcaption>
          {{ music.name }}
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script>
import request from "@/request/request.js";
import {mapGetters} from 'vuex';
export default {
  name: "UserFavoritePlayList",
  data() {
    return {
      playList: null,
    };
  },
  methods: {
    goToPlayList(id) {
      this.$emit("goToPlayList", id);
    },
  },
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  created() {
    // TODO 这个uid 后期用getUserInfo 从 store 中获取
    request.get("/user/playlist?uid=245947021")
      .then(({ data }) => {
        if (data.code === 200) {
          this.playList = data.playlist.map(item => {
            return {
              id: item.id,
              coverImgUrl: item.coverImgUrl,
              name: item.name,
            }
          });
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
};
</script>

<style lang="scss" scoped>
.user-favorite-play-list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-auto-rows: 200px;
  justify-content: center;
  figure {
    //overflow: hidden;
    cursor: pointer;
    transition: 0.5s;
    position: relative;
    img {
      transition: 0.5s;
    }
    &:hover > img {
      transform: translateY(-20px) scale(1.2);
    }
  }
}
.cover-img {
  border-radius: 15px;
  width: 100%;
  height: auto;
}
</style>
