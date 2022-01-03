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
* `issue#1` ~~**My**页面滑动到**140px**时页面发生莫名的抖动~~ (换了一种方式, 使用 translate向上移动)
* `issue#2` ~~**My**页面中Tabs element组件内无法加载`PlayList`组件, 但是可以正常加载其他组件~~(自己看漏了一个`data`字段)
* `issue#3` ~~在**My.vue**组件中, 使用对象`isInitialData`作为v-if的条件居然会失败... 在第28行~~(逻辑错误...)
* `issue#4` ~~在**PlayBar.vue组件中, 计算属性`playBtn`无法根据`audio.paused`来动态更改**播放/暂停**按钮的图片~~ (audio.paused是原型上的属性)

![issue#4](./documentImg/issue%234.png)


# TODO
- [x] el-tabs 是加一次性加载所有的子tab中的组件, 即使为显示也会加载, 使用`keep-alive`和`v-if`解决
- [x] 优化`PlayList`懒加载
- [x] 对每日的推荐歌曲, 推荐歌单直接存储到`localstorage`, 当日不再请求
- [ ] 长列表虚拟滚动