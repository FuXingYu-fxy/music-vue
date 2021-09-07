# music-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# branch 
* `fix-style#1`: 修改首页歌单布局样式
* `issue#1` **My**页面滑动到**140px**时页面发生莫名的抖动

# problems
* **My**页面中Tabs element组件内无法加载`PlayList`组件, 但是可以正常加载其他组件

# TODO
* 优化`PlayList`懒加载
* 对每日的推荐歌曲, 推荐歌单直接存储到`localstorage`, 当日不再请求
* 长列表虚拟滚动