<template>
  <div id="app">
    <el-row v-if="show">
      <el-col :span="4">
        <search/>
      </el-col>
      <el-col :span="8" :offset="12">
        <nav class="header-link">
          <router-link :to="{name: 'Home'}">首页</router-link>
          <router-link :to="{name: 'My'}">我的</router-link>
          <router-link :to="{name: 'About'}">关于</router-link>
          <router-link :to="{name: 'More'}">更多</router-link>
        </nav>
      </el-col>
    </el-row>
    <router-view></router-view>
    <router-view name="first"/>
    <router-view name="home"/>
    <playBar/>
  </div>
</template>

<script>
import Search from '@/components/Search';
import PlayBar from '@/components/PlayBar';

export default {
  name: 'app',
  components: {
    Search,
    PlayBar,
  },
  data() {
    return {
      show: true,
    }
  },
  mounted() {
  },
  watch: {
    '$route': {
      handler(newData) {
        // 如果是登陆页面，就不显示导航栏
        this.show = newData.name !== 'Login';
      }
    }
  },
  computed: {
    // show() {
    // }
  }
}
</script>

<style lang="scss">
@import './scss/theme';
:root {
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: aliceblue;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #5da0a0;
    border-radius: 5px;

    //滚动条滑块是由背景颜色和border共同渲染的
    //背景色默认入侵到 border-box
    border: 1.3px dashed transparent;

    //使用 background-clip 将背景渲染限制到 padding-box
    background-clip: padding-box;
    &:hover {
      // hover时, 额外渲染 border-width 看起来滚动条滑块就像扩大一样
      background-clip: border-box;
      background-color: teal;
    }

  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.header-link a {
  margin: 0 4px;
  text-decoration: none;
  color: $theme-color;
  font-size: 1.1em;
  font-weight: bold;
}
</style>
