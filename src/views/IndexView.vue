<template>
  <div class="index">
    <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="ifShowBtn" :ifShowLogout="ifShowLogout" :welcomeText="welcomeText" />
    <div class="content-container">
      <div class="news" v-for="(row, index) in items.slice(0,1)" :key="index" @click="clickNews">
        <div class="news-title">★Update:  【{{ row.title }}】</div>
        <div class="news-content">   {{ row.content }}</div>  
        <div class="news-date">--  date: {{ row.date }}</div>  
      </div>
      <div class="buttons">
        <button class="online" @click="toOnline">
          <span>Quotation System</span>
        </button>
        <button class="result" @click="toResult">
          <span>Quotation Result</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import BannerContainer from '@/components/BannerContainer.vue'
  import { computed } from 'vue';
  import { useStore } from 'vuex';

  export default {
    setup() {
      const store = useStore();
      const loginMode = computed(() => store.getters.getLoginMode);

      const welcomeText = computed(() => `Welcome! ${loginMode.value}`);

      return {
        loginMode,
        welcomeText,
      }
    },

    data() {
      return {
        firstLabel: 'Information',
        ifShowBtn: false,
        ifShowLogout: true,
        items: [
                    {value: '1', title: 'New update of Quotation System 1', content: 'We have updated the system. 1', date: '2024-04-05',},
                    {value: '2', title: 'New update of Quotation System 2', content: 'We have updated the system. 2', date: '2024-04-05',},
                    {value: '3', title: 'New update of Quotation System 3', content: 'We have updated the system. 3', date: '2024-04-05',},
                    {value: '4', title: 'New update of Quotation System 4', content: 'We have updated the system. 4', date: '2024-04-05',},
                    {value: '5', title: 'New update of Quotation System 5', content: 'We have updated the system. 5', date: '2024-04-05',},
                ],
      };
    },

    components: {
      BannerContainer,
    },

    methods: {
      clickNews(){
        this.$router.push('/news-page');
      },
      toOnline(){
        this.$router.push('/selection');
      },

      toResult(){
        this.$router.push('/quotation-result');
      },
    },

    mounted() {
      console.log(this.loginMode);
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
      .news {
        padding: 10px 0;
        color: #7C7C7C;
        display: flex;
        justify-content:center;
        align-items: center;
        margin-bottom: 20px;
        margin-left: 17%;
        margin-right: 17%;
        border-radius: 7px;
        //height: 50px;
        border: 1px solid #00AAEE;
        cursor: pointer;
        &:hover {
          background: #eef4f8;
        }
        .news-title{
          text-align: start;
          font-size: 20px;
          font-weight: bold;
        }
        .news-content{
          text-align: start;
          margin-left: 40px;
          font-size: 20px;
        }
        .news-date{
          text-align: start;
          margin-left: 40px;
          font-size: 19px;
        }
      }
      .buttons {
        //border: 1px solid green;
        display: flex;
        flex-direction: row;
        height: 205px;
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
          font-size: 20px;
          //margin-top: 7vw;
          cursor: pointer;

          margin-right: 100px;

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
        .result{
          width: 200px;
          height: 150px;
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background-color: #00AAEE;
          color: white;
          font-size: 20px;
          //margin-top: 7vw;
          cursor: pointer;

          margin-left: 100px;

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
