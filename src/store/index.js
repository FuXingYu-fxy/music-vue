import Vue from 'vue'
import Vuex from 'vuex'
import {
  UPDATE_USER_INFO,
  UPDATE_DAILY_PLAYLIST,
  UPDATE_CURRENT_PLAY,
} from '@/store/actionType';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 后期将这些全部存入 localStorage 避免重复请求
    userInfo: null,
    dailyPlayList: null,
    currentPlaySong: null,
  },
  getters: {
    getDailyPlayList(state) {
      return state.dailyPlayList;
    },
    getUserInfo(state) {
      return state.userInfo;
    }
  },
  mutations: {
    // 更新用户信息
    [UPDATE_USER_INFO](state, payload) {
      state.userInfo = payload;
    },
    
    // 更新每日推荐歌单
    [UPDATE_DAILY_PLAYLIST](state, payload) {
      state.dailyPlayList = payload;
    },
    
    // 更新当前播放歌曲的信息
    [UPDATE_CURRENT_PLAY](state, payload) {
      state.currentPlaySong = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
