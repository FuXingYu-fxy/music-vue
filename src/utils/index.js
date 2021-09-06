/**
 * 将歌曲时间 ms 格式化为 mm:ss
 * @param {Number} dt 歌曲持续时间, ms
 * @returns {String}  返回 mm:ss 格式的时间
 */
function formatDuration(dt) {
  let second = Math.floor(dt / 1000);
  let minute = Math.floor(second / 60);
  second = second % 60;
  minute = minute > 9 ? minute : "0" + minute;
  second = second > 9 ? second : "0" + second;
  return `${minute}:${second}`;
}

/**
 * 防抖装饰器
 * @param fn
 * @param ms 忽略 ms 内的连续调用
 * @param immediate 是否立即执行, 默认 false, 立即执行代表在 ms 内连续调用只会执行一次
 * @return {(function(...[*]=): void)|*}
 */
function debounce(fn, ms, immediate = false) {
  let thisArg = null;
  let args = undefined;
  let timerId;
  return function (...params) {
    if (timerId) {
      clearTimeout(timerId);
    } else {
      if (immediate) {
        return fn.apply(this, params);
      }
    }
    thisArg = this;
    args = params;
    timerId = setTimeout(() => {
      if (!immediate) {
        return fn.apply(thisArg, args);
      }
      timerId = undefined;
    }, ms);
  }
}

/**
 * 节流装饰器
 * @param fn
 * @param ms 调用频率被先限制到 ms 一次
 * @return {function(...[*]): *}
 */
function throttle(fn, ms) {
  let thisArg = null;
  let args;
  let isThrottle = false;
  return function (...params) {
    if (isThrottle) {
      thisArg = this;
      args = params;
      return;
    }
    isThrottle = true;
    setTimeout(() => {
      isThrottle = false;
    }, ms);
    return fn.apply(thisArg, args);
  }
}

/**
 * 从返回的 json 中解析出 id, songTitle, durationTime, artists, album, cover
 * 可用于接口 /song/details  和 /playlist/details
 * @param item
 * @return {{cover, songTitle: (string|*), durationTime: String, artists: *, album, id}}
 */
function parseSongInfo(item) {
  // tns 是歌曲别名数组 tns[0] 是名字, 注意!!! 只有个别歌有 tns 这个字段
  // ar 是作者数组， ar[0].name 是作者名
  // al 是专辑, 一个对象
  const {name, ar, id, tns, dt, al} = item;
  const songAlias = tns && tns.join('/');
  const artists = ar.length && ar.map(artist => artist.name).join('/');
  // 歌曲标题 时长 歌手  专辑
  return {
    id: id,
    songTitle: songAlias ? name + `(${songAlias})` : name,
    durationTime: formatDuration(dt),
    artists: artists,
    album: al.name,
    cover: al.picUrl,
  }
}

export {
  formatDuration,
  debounce,
  throttle,
  parseSongInfo,
}