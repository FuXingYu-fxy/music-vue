<template>
  <el-row :gutter="10" class="play-list-header">
    <el-col :span="8">
      <img :src="coverImgUrl" alt="" class="cover">
    </el-col>
    <el-col :span="16">
      <div class="right-content">
        <div class="title">
          <img src="../image/playList.svg" alt="">
          <span>{{ name }}</span>
        </div>
        <div class="operator">
          <el-button-group class="operator-item">
            <el-button type="primary" icon="el-icon-headset">播放</el-button>
            <el-button type="primary" icon="el-icon-circle-plus"/>
          </el-button-group>
          <el-button class="operator-item" type="primary" icon="el-icon-folder-add">{{ subscribedCount }}
          </el-button>
        </div>
        <div class="tag">
          <span class="tag-item">标签: </span>
          <div class="tag-item">
            <el-tag
                v-for="(tag, index) of tags"
                :key="index"
                type="info"
                size="mini"
                :color="colors[index]"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <div class="description">
          <span class="description-item">简介: </span>
          <p class="description-item">{{ description }}</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "PlayListDescription",
  props: {
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    subscribedCount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coverImgUrl: {
      type: String,
      required: true,
    },

  },
  data() {
    return {
      colors: [
        '#FFC0CB',
        '#E6E6FA',
        '#FFA07A',
        '#FFFACD',
        '#98FB98',
        '#AFEEEE',
        '#B0C4DE',
      ],
    }
  },

}
</script>

<style lang="scss" scoped>
@import "../scss/flex-layout";
// 右边整块内容的 div
.right-content {
  & > div {
    margin: 3px 0;
  }
}

.play-list-header {
  min-height: 250px;
}

.cover {
  width: 200px;
  height: 200px;
}

.title {
  @include flex-layout('row');

  img {
    width: 74px;
    height: 74px;
  }
}

.operator {
  @include flex-layout('row');

  .operator-item {
    margin: 0 3px;
  }
}

.tag {
  @include flex-layout('row');

  .tag-item {
    margin: 0 3px;
  }
}

.description {
  @include flex-layout('column');

  .description-item {
    text-align: left;
    margin: 0 3px;
  }
}
</style>