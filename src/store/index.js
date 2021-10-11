import Vue from 'vue'
import Vuex from 'vuex'
import {
  UPDATE_USER_INFO,
  UPDATE_CURRENT_PLAY,
  UPDATE_CURRENT_PLAY_LIST,
  UPDATE_CURRENT_TIME,
} from '@/store/actionType';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 后期将这些全部存入 localStorage 避免重复请求
    userInfo: null,
    
    // 当前播放的音乐
    currentPlaySong: null,
    
    // 当前的音乐列表
    currentPlayList: null,

    // 当前音乐进度
    currentTime: 0,
  },
  getters: {
    userInfo(state) {
      return state.userInfo;
    },
    
    currentPlaySong(state) {
      return state.currentPlaySong;
    },
    
    currentPlayList(state) {
      return state.currentPlayList;
    },
    currentTime(state) {
      return state.currentTime;
    }
  },
  mutations: {
    // 更新用户信息
    [UPDATE_USER_INFO](state, payload) {
      state.userInfo = payload;
    },
    
    [UPDATE_CURRENT_PLAY_LIST](state, payload) {
      if (state.currentPlayList === payload) {
        return;
      }
      state.currentPlayList = payload;
    },
    
    // 更新当前播放歌曲的信息
    [UPDATE_CURRENT_PLAY](state, payload) {
      state.currentPlaySong = payload;
    },
    [UPDATE_CURRENT_TIME](state, payload) {
      state.currentTime = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
