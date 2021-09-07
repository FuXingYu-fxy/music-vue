<template>
  <div class="calendar-wrapped">
    <div class="calendar-container">
      <div class="calendar">
        <span>星期{{week}}</span>
        <span>{{day}}</span>
      </div>
      <div class="calendar-text">
        <h2>每日歌曲推荐</h2>
        <h4>根据你的音乐口味生成, 每天6:00更新</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendar.vue",
  data() {
    return {
      day: 0,
      week: '一',
    }
  },
  mounted() {
    const date = new Date();
    let day = date.getDate();
    let week = date.getDay();
    this.day = day;
    switch (week) {
      case 0:
        this.week = '日'
        break;
      case 1:
        this.week = '一'
        break;
      case 2:
        this.week = '二'
        break;
      case 3:
        this.week = '三'
        break;
      case 4:
        this.week = '四'
        break;
      case 5:
        this.week = '五'
        break;
      case 6:
      default:
        this.week = '六'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/flex-layout";

.calendar-wrapped {
  @include flex-layout('row');
  justify-content: center;
}

.calendar-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 640px;
  height: 180px;
  background-size: cover;
  background: url("../image/daily-songs-bg.jpg") no-repeat;
}

.calendar-text {
  text-align: left;
}

.calendar {
  width: 110px;
  height: 110px;
  border-radius: 8px;
  position: relative;
  background-color: rgb(243, 243, 243);

  & > span:nth-child(1) {
    box-sizing: border-box;
    text-align: center;
    border-radius: inherit;
    border-bottom-right-radius: initial;
    border-bottom-left-radius: initial;
    height: 20%;
    display: block;
    background-color: teal;
  }

  & > span:nth-child(2) {
    display: block;
    position: absolute;
    font-size: 4em;
    text-align: center;
    top: 20%;
    width: 100%;
    font-weight: bold;
    z-index: 3;

    &::before {
      content: "";
      display: block;
      position: absolute;
      background-color: rgba(151, 151, 151, .23);
      width: 97%;
      transform: translateX(2px);
      height: 55%;

    }
  }
}

</style>