<template>
  <div class="first">
    <el-button type="primary" @click="jump">jump</el-button>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script>
export default {
  name: "First",
  methods: {
    jump() {
      this.$router.push({
        name: 'Home',
      })
    },
    login() {
      this.$router.push({
        name: 'Login',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>