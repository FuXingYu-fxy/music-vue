<template>
  <div>

    <p v-if="!songInfo">加载中。。。</p>
    <PlayList
        v-else
        :ids="songInfo.trackIds"
        :play-count="songInfo.playCount"
        :total-len="songInfo.totalLen"
    >
      <template v-slot:play-list-description>
        <PlayListDescription
            v-if="songInfo.playCount"
            :cover-img-url="songInfo.coverImgUrl"
            :description="songInfo.description"
            :name="songInfo.name"
            :subscribed-count="songInfo.subscribedCount"
            :tags="songInfo.tags"
        />
      </template>
    </PlayList>
  </div>
</template>

<script>
import request from '@/request/request';
import PlayListDescription from '@/components/PlayListDescription';
import PlayList from '@/components/PlayList';

export default {
  name: "PlayListContainer",
  components: {
    PlayListDescription,
    PlayList,
  },
  props: ['id'],
  data() {
    return {
      songInfo: null,
    }
  },
  created() {
    const requestUrl = '/playlist/detail';
    request.get(requestUrl, {
      params: {
        id: this.id
      }
    }).then(({data}) => {
      if (data.code === 200) {
        const {
          playCount,
          trackIds,
          tags,
          name,
          subscribedCount,
          description,
          coverImgUrl
        } = data.playlist;
        const totalLen = trackIds.length;
        this.songInfo = {playCount, trackIds, tags, name, subscribedCount, description, coverImgUrl, totalLen};
      } else {
        this.$message({
          message: `${data.msg}, 状态码: ${data.code}`,
          type: 'info'
        })
      }
    }).catch(err => {
      this.$message({
        message: '发生错误, 请到控制面板查看',
        type: 'error'
      })
      console.group('PlayListContainer created');
      console.log(err);
      console.groupEnd('PlayListContainer created');
    })
  }
}
</script>

<style scoped>

</style>