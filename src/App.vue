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
@import "./scss/scrollbar-style";
:root {
  @include scrollbar();
}

.header-link a {
  margin: 0 4px;
  text-decoration: none;
  color: $theme-color;
  font-size: 1.1em;
  font-weight: bold;
}
#root {
  text-align: center;
}
</style>
