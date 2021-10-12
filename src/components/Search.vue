<template>
  <div class="search-container">
    <div class="search-box">
      <input
        autocomplete="off"
        type="text"
        name="something"
        id="input"
        placeholder="search..."
        :value="value"
        @input="handleInputDebounce"
        @blur="hideSearchResult"
      />
      <div class="search"></div>
    </div>
    <div class="search-result" v-show="show">
      <span
        class="result"
        v-for="item of result"
        :key="item.id"
        @click="handleClick(item.id)"
      >
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script>
import { debounce, parseSongInfo } from "@/utils/index.js";
import {mapMutations} from 'vuex';
import {UPDATE_CURRENT_PLAY} from '@/store/actionType.js';
import request from "@/request/request.js";
export default {
  name: "Search",
  data() {
    return {
      value: "",
      result: [],
      show: false,
    };
  },
  methods: {
    ...mapMutations({
      updateCurrentPlay: UPDATE_CURRENT_PLAY,
    }),
    hideSearchResult() {
      setTimeout(() => {
        this.value = "";
        this.show = false;
      }, 200);
    },
    handleInputDebounce: debounce(async function (e) {
      const keyword = e.target.value;
      this.value = keyword;
      if (keyword === "") {
        return;
      }
      try {
        const { data } = await request.get("/search", {
          params: {
            keywords: keyword,
          },
        });
        if (data.code === 200) {
          this.result = data.result.songs;
          this.show = true;
        }
      } catch (err) {
        console.group("Search handleInputDebounce");
        console.log(err);
        console.groupEnd("Search handleInputDebounce");
      }
    }, 500),
    async handleClick(id) {
      const { data } = await request.get("/song/detail", {
        params: {
          ids: id,
        },
      });
      if (data.code === 200) {
        this.updateCurrentPlay(parseSongInfo(data.songs[0]));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/theme";
@import "../scss/scrollbar-style";
.search-box {
  width: 10.75rem;
  height: 2.25rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
#input {
  cursor: text;
  outline: none;
  border: none;
  height: 60%;
  position: absolute;
  /*height: 60%;*/
  width: 25%;
  background-color: $theme-color;
  z-index: 5;
  /*cursor: pointer;*/
  opacity: 0;
  transition: 1s;
  border-radius: 30px;
  font-family: "Inconsolata", monospace;
  color: white;
  box-sizing: border-box;
  padding: 0 20% 0 5%;
  letter-spacing: 0.1rem;
  box-shadow: 0 0 5px 0 $theme-color;
  font-size: 0.5rem;
  &::placeholder {
    color: white;
    opacity: 0.5;
  }

  &:hover {
    cursor: pointer;
  }
  &:focus {
    opacity: 1;
    width: 100%;
    cursor: text;
  }
  &:focus + .search {
    transform: translateX(200%);
    z-index: 6;
    background: rgb(44, 43, 43);
  }
  &:focus + .search::before {
    /*线*/
    top: 0;
    left: 0;
    width: 13px;
  }
  &:focus + .search::after {
    /*圈*/
    top: 0;
    left: 0;
    width: 13px;
    height: 2px;
    border: none;
    background: white;
    border-radius: 0;
    transform: rotate(-45deg);
  }
}
.search {
  position: absolute;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: $theme-color;
  z-index: 4;
  transition: 1s;
  cursor: pointer;

  &::before {
    /*线*/
    content: "";
    position: absolute;
    top: 13px;
    right: 0;
    bottom: 0;
    left: 13px;
    margin: auto;
    width: 8px;
    height: 2px;
    background: white;
    transform: rotate(45deg);
    transition: all 1s;
  }

  &::after {
    /* 圈 */
    content: "";
    position: absolute;
    margin: auto;
    top: -3px;
    right: 0;
    bottom: 0;
    left: -3px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid white;
    transition: all 1s;
  }

  &:hover {
    cursor: pointer;
  }
}
.search-container .search-result {
  @include scrollbar();
  height: 200px;
  min-height: 200px;
  width: 10rem;
  overflow: hidden auto;
  position: absolute;
  z-index: 10;
  & > span {
    display: block;
    width: 100%;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      color: $theme-color;
    }
  }
}
</style>