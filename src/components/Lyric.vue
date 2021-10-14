<template>
  <div class="lyric-container">
    <div class="lyric">
      <span
        v-for="(item, index) of LyricList"
        :key="item.uid"
        :class="{ highlight: index === lyricIndex }"
      >
        {{ item.lyric }}
      </span>
    </div>
  </div>
</template>

<script>
import request from "@/request/request.js";
import { mapGetters } from "vuex";
export default {
  name: "",
  props: {
    id: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      LyricList: [],
      lyric: "",
      lyricIndex: 0,
    };
  },
  methods: {
    formatMusicLyrics(lyric) {
      if (lyric === "") {
        return {
          lyric: [{ time: 0, lyric: "这个地方没有歌词！", uid: 520520 }],
        };
      }
      const lyricObjArr = []; // 最终生成的歌词数组

      // 将歌曲字符串变成数组，数组每一项就是当前歌词信息
      const lineLyric = lyric?.split(/\n/);

      // 匹配中括号里正则的
      const regTime = /\d{2}:\d{2}.\d{2,3}/;

      // 循环遍历歌曲数组
      for (let i = 0; i < lineLyric.length; i++) {
        if (lineLyric[i] === "") continue;
        const time = this.formatLyricTime(lineLyric[i].match(regTime)[0]);

        if (lineLyric[i].split("]")[1] !== "") {
          lyricObjArr.push({
            time: time,
            lyric: lineLyric[i].split("]")[1],
            uid: parseInt(Math.random().toString().slice(-6)),
          });
        }
      }
      // console.log(lyricObjArr);
      this.LyricList = lyricObjArr;
    },
    formatLyricTime(time) {
      const regMin = /.*:/;
      const regSec = /:.*\./;
      const regMs = /\./;

      const min = parseInt(time.match(regMin)[0].slice(0, 2));
      let sec = parseInt(time.match(regSec)[0].slice(1, 3));
      const ms = time.slice(
        time.match(regMs).index + 1,
        time.match(regMs).index + 3
      );
      if (min !== 0) {
        sec += min * 60;
      }
      return Number(sec + "." + ms);
    },
  },
  computed: {
    ...mapGetters(["currentTime"]),
  },
  components: {},
  watch: {
    currentTime(time) {
      // 注意加一
      if (time >= this.LyricList[this.lyricIndex + 1].time) {
        this.lyricIndex = (this.lyricIndex + 1) % (this.LyricList.length - 1);
      }
    },
    id(value) {
      request("/lyric", {
        params: {
          id: value,
        },
      }).then(({ data }) => {
        if (data.code === 200) {
          let lyric = data.lrc.lyric;
          console.log(lyric);
          this.formatMusicLyrics(lyric);
          this.lyricIndex = 0;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.lyric-container {
  height: 550px;
  width: 320px;
  position: fixed;
  right: 20px;
  top: 0;
  z-index: 10;
  overflow: hidden auto;
  text-align: center;
  &::-webkit-scrollbar {
    display: none;
  }
}
.lyric {
  & > span {
    display: block;
    font-size: small;
    color: darkblue;
    margin: 2px 0;
  }
  .highlight {
    color: red;
    transform: scale(1.2);
    transition: .5s;
  }
}
</style>
