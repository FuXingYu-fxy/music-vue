<template>
  <div class="recommend-music">
    <div v-for="item of dailyPlayList" :key="item.id" class="music-item">
      <a @click="goToMusicList(item.id)">
        <img :src="item.picUrl" alt="">
        <p class="mask">{{ item.copywriter }}</p>
        <p>{{ item.name }}</p>
      </a>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "RecommendList.vue",
  // data() {
  // },
  computed: {
    ...mapGetters({
      dailyPlayList: 'getDailyPlayList'
    }),
  },
  methods: {
    goToMusicList(id) {
      // this.$router.push({name: 'music', query: {playlistId: id}});
      console.log(id);
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
  }
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
}
</script>

<style lang="scss" scoped>
.recommend-music {
  margin-top: 10px;
  display: grid;
  /* grid-template-rows: repeat(4, 7.5rem); */
  grid-template-rows: auto;
  grid-template-columns:  repeat(8, 12.5%);
  gap: 1rem 0;
  justify-items: center;
  align-items: flex-start;
  justify-content: center;
  max-height: calc(100% - 34px);
  overflow-x: hidden;
}

.music-item {
  width: 70%;
  height: 45.5%;
  position: relative;

  img {
    width: 100%;
    height: auto;
  }

  & > a {
    cursor: pointer;
    display: block;
  }

  & > a:hover > p:nth-child(2) {
    opacity: 1;
  }

  & > a p:nth-child(2) {
    position: absolute;
    z-index: 1;
    font-size: 8px;
    margin: 0;
    top: 0;
    text-align: center;
    width: 100%;
    background: #00000047;
    color: white;
  }

  & > a P:nth-child(3) {
    font-size: 100%;
  }
}
.mask {
  opacity: 0;
  transition: .5s ease-out .2s;
}
</style>











