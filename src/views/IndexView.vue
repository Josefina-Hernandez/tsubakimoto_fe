<template>
  <div class="index">
    <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="ifShowBtn" :ifShowLogout="ifShowLogout" />
    <div class="content-container">
      <div class="buttons">
        <button class="online" @click="toOnline">
          <span>Start</span>
        </button>
      </div>
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
        ifShowLogout: true,
      };
    },

    components: {
      BannerContainer,
    },

    methods: {
      toOnline(){
        this.$router.push('/selection');
      },
    },
  };
</script>

<style scoped lang="less">
  .index {
    width: 100%;
    //max-width: 100vw;
    margin: 0 0;

    .content-container {
      padding: 40px;
      .buttons {
        //border: 1px solid green;
        display: flex;
        flex-direction: column;
        height: 350px;
        align-items: center;
        justify-content: center;
        .online{
          width: 200px;
          height: 150px;
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background-color: #00AAEE;
          color: white;
          font-size: 25px;
          //margin-top: 7vw;
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
  }
</style>
