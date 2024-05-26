<template>
  <div class="index">
    <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="ifShowBtn" />
    <div class="content-container">
      <router-link to="/selection">
        <button class="online">
          <span>Online Quotation</span>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
  import BannerContainer from '@/components/BannerContainer.vue'
  export default {
    data() {
      return {
        firstLabel: 'Information',
        ifShowBtn: false,
      };
    },

    components: {
      BannerContainer,
    },
  };
</script>

<style scoped lang="less">
  .index {
    max-width: 100vw;
    margin: 0 auto;

    .content-container {
      padding: 40px;
      .online{
        width: 400px;
        height: 150px;
        border-radius: 20px;
        border: none;
        background-color: #00AAEE;
        color: white;
        font-size: 30px;
        margin-top: 7vw;
        cursor: pointer;

        &:hover{
                      background-color: #0082B3; /* 鼠标悬停时改变背景色 */
                  }

                  span {
                      position: relative; /* 添加相对定位 */
                      top: 0;
                      left: 0;
                      transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
                  }

                  &:hover span {
                      top: 2px; /* 鼠标悬停时移动文本 */
                      left: 2px; /* 鼠标悬停时移动文本 */
                  }
      }

    }
  }
</style>
