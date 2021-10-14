<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",

  data() {
    return {};
  },
  watch: {
    '$route': {
      handler(route) {
        let margin = "";
        let hidden = "";
        if (route.name === 'Login' || route.name === 'Content') {
          margin = 0;
          hidden = "hidden";
        }
        document.body.style.margin = margin;
        document.body.style.overflow = hidden;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
@import "./scss/scrollbar-style";
:root {
  @include scrollbar();
}

#root {
  text-align: center;
}
</style>
