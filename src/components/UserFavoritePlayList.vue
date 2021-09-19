<template>
  <div class="user-favorite-play-list">
    <div v-for="music of playList" @click="goToPlayList(music.id)" :key="music.id">
      <figure >
        <img :src="music.coverImgUrl" alt="" class="cover-img">
        <figcaption>
          {{music.name}}
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script>
import {playList} from '@/testData/user_favorite_music';
export default {
  name: "UserFavoritePlayList",
  data() {
    return {
      playList: playList.playlist,
    }
  },
  methods: {
    goToPlayList(id) {
      this.$emit("goToPlayList", id);
    }
  }
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
    transition: .5s;
    position: relative;
    img {
      transition: .5s;
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
