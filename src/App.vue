<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  
  data() {
    return {
    };
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
