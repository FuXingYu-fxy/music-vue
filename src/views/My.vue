<template>
  <div style="height: 200vh">
    <div class="banner" ref="banner" :style="dynamicHeight">
    </div>
  </div>
</template>

<script>
export default {
  name: "My",
  data() {
    return {
      bannerHeight: 0,
      offsetY: 0,
    }
  },
  methods: {
    setOffsetY() {
      this.offsetY = window.pageYOffset;
    }
  },
  computed: {
    dynamicHeight() {
      let start = 0;
      let end = 200;
      if (this.bannerHeight === 0) {
        return;
      }
      let rate = (end - this.offsetY) / (end - start);
      if (rate <= 0) {
        return {
          height: 0 + 'px',
        }
      }
      return {
        height: rate * this.bannerHeight + 'px',
      }
    }
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  mounted() {
    window.addEventListener('scroll', this.setOffsetY);
    this.bannerHeight = this.$refs.banner.clientHeight;
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.setOffsetY);
  }
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑

}
</script>

<style lang="scss" scoped>
.banner {
  margin-top: 10px;
  background-image: url("../image/music-player.jpg");
  width: 100%;
  height: 60vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  //transition: height .2s;
}
</style>