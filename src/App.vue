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
  </div>
</template>

<script>
import Search from '@/components/Search';

export default {
  name: 'app',
  components: {
    Search,
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
    width: 7px;
    background-color: aliceblue;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $theme-color;
    border-radius: 8px;
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
