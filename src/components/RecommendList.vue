<template>
  <div class="recommend-music">
    <div v-for="item of dailyPlayList" :key="item.id" class="music-item">
      <a @click="goToMusicList(item.id)">
        <img :src="item.picUrl" alt="">
      </a>
      <p class="mask">{{ item.copywriter }}</p>
      <p class="describe">{{ item.name }}</p>
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
  grid-auto-rows: auto;
  grid-template-columns:  repeat(8, 12.5%);
  gap: 1rem 0;
  justify-items: center;
  align-items: flex-start;
  justify-content: center;
}

.music-item {
  margin: 0 8px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    //height: auto;
  }

  & > a {
    cursor: pointer;
    display: block;
  }

  & > a:hover + .mask {
    opacity: 1;
  }

}

.mask {
  position: absolute;
  z-index: 1;
  font-size: 8px;
  margin: 0;
  top: 0;
  text-align: center;
  width: 100%;
  background: #00000047;
  color: white;
  opacity: 0;
  transition: .5s ease-out .2s;
}

// width <= 800px 时，启用下面的 css
@media (max-width: 800px) {
  .recommend-music {
    grid-auto-rows: 160px;
  }
  .mask {
    top: initial;
    background-color: initial;
    color: initial;
    opacity: 1;
  }
  .describe {
    display: none;
  }
}
@media (max-width: 600px) {
  .recommend-music {
    grid-auto-rows: auto;
  }
  .mask {
    display: none;
  }
}
</style>











