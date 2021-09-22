<template>
  <div class="container">
    <div class="cover-mask">
      <div class="cover-slide">
        <div class="cover" v-for="item of coverList" :key="item.id" @click="handleClick(item.id)">
          <h3 class="music-name">{{ item.name }}</h3>
          <div>
            <img :src="item.coverImgUrl" alt="" />
          </div>
        </div>
        <!-- 重复一次第一个可以实现无限的轮播 -->
        <div class="cover" @click="handleClick(coverList[0].id)" data-id="哈哈">
          <h3 class="music-name" >{{ coverList[0].name }}</h3>
          <div>
            <img :src="coverList[0].coverImgUrl" alt="" />
          </div>
        </div>
      </div>
    </div>

    <div class="music-list-mask">
      <div class="music-list-slide">
        <div class="music-list" v-for="(item) of coverList" :key="item.id" @click="handleClick(item.id)">
          <span v-for="(music, i) of item.tracks" :key="music.first">{{
            `${i + 1}.${music.first}-${music.second}`
          }}</span>
        </div>
        <!-- 重复一次第一个可以实现无限的轮播 -->
        <div class="music-list" @click="handleClick(coverList[0].id)" :data-id="coverList[0].id">
          <span
            v-for="(music, i) of coverList[0].tracks"
            :key="music.first + 'last'"
            >{{ `${i + 1}.${music.first}-${music.second}` }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dd from "../testData/slide.js";
export default {
  name: "",
  data() {
    return {
      info: dd.list,
    };
  },
  methods: {
    handleClick(id) {
      this.$emit('goToPlayList', id, "HotPlayList");
    }
  },
  computed: {
    coverList() {
      return this.info
        .map((item) => {
          return {
            tracks: item.tracks,
            name: item.name,
            id: item.id,
            coverImgUrl: item.coverImgUrl,
          };
        })
        .slice(0, 4);
    },
    musicList() {
      return this.coverList.map((item) => {
        return {
          tracks: item.tracks,
        };
      });
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
$radius: 15px;
$height: 160px;
$width: 530px;
$img-height: 130px;
$music-list-width: 400px;
.container {
  display: flex;
  flex-direction: row;
  position: relative;
  height: $height;
  width: $width;
  cursor: pointer;
  border-radius: $radius;
  border: 1px solid teal;
  padding: 3px;
  &:hover .cover-slide {
    animation-play-state: paused;
  }
  &:hover .music-list-slide {
    animation-play-state: paused;
  }
}

.music-name {
  width: 100%;
  text-align: center;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

img {
  width: $img-height;
  height: $img-height;
  border-radius: $radius;
}

.music-list {
  padding: 10px;
  height: $height;
  width: $music-list-width;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > span {
    width: $music-list-width - 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
}

.cover {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 两个容器 */
.cover-mask {
  width: $img-height;
  height: $height;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
}

.cover-slide {
  transition: 1s;
  position: absolute;
  animation: cover-slide-run 10s infinite;
}

@keyframes cover-slide-run {
  @for $i from 0 through 4 {
    #{$i * 25%} {
      transform: translateY(calc(-#{$height} * #{$i}));
    }
  }
}

.music-list-mask {
  margin-left: 135px;
  height: $height;
  width: $music-list-width;
  overflow: hidden;
  position: absolute;
}

.music-list-slide {
  display: flex;
  position: absolute;
  transition: 1s;
  animation: music-list-slide-run 10s infinite;
}

@keyframes music-list-slide-run {
  @for $i from 0 through 4 {
    #{$i * 25%} {
      transform: translateX(calc(-#{$music-list-width} * #{$i}));
    }
  }
}
</style>
