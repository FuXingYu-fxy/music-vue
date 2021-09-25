<template>
  <div class="music-component">

    <div class="music-controls">
      <a 
         class="btn-previous"
         title="[上一首]"
         @click="prev"></a>
      <!-- 如果是播放状态, 按钮显示的应该是暂停，否则显示播放 -->
      <a
        href="javascript:"
        :class="audio.paused ? 'btn-play' : 'btn-pause'"
        @click="changePlayerStatus"
        :title="audio.paused ? '[播放]' : '[暂停]'"
      ></a>
      <a href="javascript:"
         class="btn-next"
         title="[下一首]"
         @click="next"
      ></a>
      <!--      <div :class="['music-cover', audio.paused ? '': 'music-cover-animation']" >-->
      <div :class="['music-cover music-cover-animation', audio.paused ? '' : 'music-cover-play']">
        <img :src="musicCoverUrl" alt="专辑封面"/>
      </div>
      <div class="music-info-container">
        <span class="music-name">{{ songName }}</span>

        <span class="artist">{{ artist }}</span>

        <div class="duration">
          <span class="music-current-progress">{{ getCurrentTime_MM_SS }}</span>
          <span class="music-duration">{{ musicDuration }}</span>
        </div>

        <div class="music-progress-bar ">
          <!-- 总进度条 -->
          <div class="player-progress-inner">
            <!-- TODO 如果有需要可以在这里加一个指示加载成功的进度条 .player-progress-load -->
            <!-- 当前进度条 -->
            <!-- TODO 进度条拖动 -->
            <div class="player-progress-play" :style="currentMusicProgress">
              <!-- 进度条上的点 -->
              <i class="player-progress-dot"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 歌曲封面现在需要通过专辑内容接口获取 -->

      <a href="javascript:"
         :class="audio.loop ? 'btn-play-mode-single-loop' : 'btn-play-mode-list-loop'"
         :title="audio.loop ? '[单曲循环]': '[列表循环]'"
         @click="changePlayerMode"
      >
      </a>
      <a href="javascript:" class="btn-like-this" title="[喜欢]"></a>
      <a href="javascript:" class="btn-download" title="[下载]"></a>
      <a href="javascript:" class="btn-comment" title="[评论]"></a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlayBar',

}
</script>

<style lang="scss" scoped>
</style>