<template>
  <div style="height: 2000px">
    <div>
      <div class="banner" id="banner">
        <img class="avatar" alt="avatar" />
        <div class="user-profile">
          <h1>帮主我们唐门不能群龙无首啊</h1>
          <ul>
            <li>
              <a href="#">
                <strong>0</strong>
                <span>关注</span>
              </a>
            </li>
            <li>
              <a href="">
                <strong>0</strong>
                <span>粉丝</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="recommend">
        <h3>Hi,帮助我们唐门不能群龙无首啊</h3>
        <h5>今日为你推荐</h5>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
    </div>
  </div>
</template>

<script>
// import {throttle} from '@/utils';
function updateHeight() {
  let recommend = document.querySelector(".recommend");
  let referenceHeight = document.querySelector('.banner').clientHeight;
  let start = 0;
  let end = 200;
  let rate = window.pageYOffset / (end - start);
  let offset = rate * referenceHeight;
  recommend.style.transform = `translateY(-${offset}px)`;
}

export default {
  name: "My",
  data() {
    return {
      activeName: "second",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  // ↓ ↓ ↓ ↓ ↓ 生命周期 ↓ ↓ ↓ ↓ ↓ ↓
  mounted() {
    window.addEventListener("scroll", updateHeight);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", updateHeight);
  },
  // ↑ ↑ ↑ ↑ ↑ 生命周期 ↑ ↑ ↑ ↑ ↑ ↑
};
</script>

<style lang="scss" scoped>
.recommend {
  background: white;
}
.banner {
  margin-top: 10px;
  background-image: url("../image/music-player.jpg");
  width: 100%;
  height: 60vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  position: relative;
  overflow: hidden;
  transition: height 0.2s;

  .avatar {
    content: url("../image/avatar-fallback.jpg");
    position: relative;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: auto;
    display: block;
    border: 2px solid #ade2e2;
    border-radius: 50%;
  }
}

.user-profile {
  h1 {
    color: white;
  }

  ul {
    list-style: none;

    & li {
      display: inline-block;
      margin: 0 10px;

      & a {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: white;

        & > strong {
          transition: 0.5s;
          font-size: 1.3em;
        }

        &:hover > strong {
          color: #31c27c;
        }
      }
    }

    &:first-child {
      border-right: 1px solid red;
    }
  }
}
</style>