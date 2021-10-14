<template>
  <div>
    <el-row v-show="!show">
      <el-col :span="4">
        <search />
      </el-col>
      <el-col :span="8" :offset="12">
        <nav class="header-link">
          <router-link :to="{ name: 'Home' }">首页</router-link>
          <router-link :to="{ name: 'My' }">我的</router-link>
          <router-link :to="{ name: 'About' }">关于</router-link>
          <router-link :to="{ name: 'More' }">更多</router-link>
        </nav>
      </el-col>
    </el-row>
    <div v-show="show" class="video-container">
      <div class="button-group">
        <a class="button" :href="github" target="_blank">Github</a>
        <a class="button" @click="login">Login</a>
      </div>
      <video src="../video/t.mp4" autoplay loop preload="auto"></video>
    </div>
    <router-view></router-view>
    <playBar v-show="!show" />
  </div>
</template>

<script>
import Search from "@/components/Search";
import PlayBar from "@/components/PlayBar";
export default {
  name: "",
  components: {
    Search,
    PlayBar,
  },
  methods: {
    login() {
      this.$router.push('/login');
    },
  },
  data() {
    return {
      github: 'https://github.com/FuXingYu-fxy/music-vue',
    };
  },
  computed: {
    show() {
      return this.$route.name === "Content";
    },
  },
  watch: {
    
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/theme";
.header-link a {
  margin: 0 4px;
  text-decoration: none;
  color: $theme-color;
  font-size: 1.1em;
  font-weight: bold;
}
video {
  width: 100vw;
}
.button-group {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  z-index: 2;
  width: 350px;
  opacity: 0;
  animation: appearance 1s ease-in 1s forwards;
}
@keyframes appearance {
  0% {
    opacity: 0;
    transform: translate(-50%, -25%);
  }
  100% {
    opacity: 1;
  }
}
.button {
  text-decoration: none;
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: white;
  cursor: pointer;
  font-size: larger;
  font-weight: bold;
  color: #42b983;
  border-radius: 50px;
  padding: 10px;
  border: 1px solid #42b983;
  transition: color, background-color .5s ease;
  &:hover {
    color: white;
    background-color: #42b983;
  }
}
</style>
