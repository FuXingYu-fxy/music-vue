<template>
  <el-card class="box-card">
    <template v-slot:header>
      <div class="box-header">
        <v-icon name="regular/question-circle" scale="2" />
        <span>个性化推荐如何工作</span>
      </div>
    </template>
    <div class="box-body">
      <p>它聪明，熟悉每个用户的喜好，从海量音乐中挑选出你可能喜欢的音乐。</p>
      <p>它通过你每一次操作来记录你的口味</p>
      <div class="summary">
        <div class="summary-info">
          <v-icon name="regular/play-circle" />
          <span
            >你播放了<strong>{{ 300 }}</strong
            >首音乐</span
          >
        </div>
        <div class="summary-info">
          <v-icon name="regular/heart" />
          <span
            >你喜欢了<strong>{{ 300 }}</strong
            >首音乐</span
          >
        </div>
        <div class="summary-info">
          <v-icon name="folder-plus" />
          <span
            >你收藏了<strong>{{ 300 }}</strong
            >位歌手</span
          >
        </div>
      </div>
      <p>你提供给云音乐的信息越多，它就越了解你的音乐爱好。</p>
    </div>
  </el-card>
</template>

<script>
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";

export default {
  name: "FMCard",
  data() {
    return {};
  },
  components: {
    "v-icon": Icon,
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/theme";
@import "../scss/flex-layout";

.box-card {
  width: 350px;
  left: 0;
  top: 0;
  position: absolute;
  z-index: 4;
  transition: 0.5s;
  transform: translateX(-350px);
  border-right: 10px solid teal;
  &:hover {
    border-right-width: 0px;
    transform: translateX(0px);
    cursor: default;
  }
}

.box-header {
  text-align: left;
  font-size: 1.8em;
  color: $theme-color;
  & > span {
    margin-left: 5px;
    color: initial;
  }
}

.box-body {
  & > p {
    text-align: left;
  }
}
strong {
  color: $theme-color;
}
.summary {
  background-color: #8080801a;
  border-radius: 15px;
  & > div {
    @include flex-layout('row');
    justify-content: center;
    margin: 8px 0;
    & > span {
      margin-left: 5px;
    }
  }
}
</style>
