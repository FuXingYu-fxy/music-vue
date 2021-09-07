<template>
<h1>被挂载</h1>
</template>

<script>
export default {
  name: "Demo",
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  created() {
    console.log('被创建');
  }
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
}
</script>

<style scoped>

</style>