<template>
  <div class="index">
    <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="ifShowBtn" :ifShowLogout="ifShowLogout" />
    <div class="content-container">
      <div class="news" v-for="(row, index) in items.slice(-1)" :key="index" @click="clickNews">
        <div class="news-title">★Update:  【{{ row.title }}】</div>
        <div class="news-content">   {{ row.content }}</div>  
        <div class="news-date">--  date: {{ row.date }}</div>  
      </div>
      <div class="buttons">
        <button class="online" @click="toOnline">
          <span>Online Price List System</span>
        </button>
        <button class="result" @click="toResult">
          <span>Quotation Record</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import BannerContainer from '@/components/BannerContainer.vue'
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import axios from 'axios';
  import config from '@/config.js';

  export default {
    setup() {
      const store = useStore();
      const loginMode = computed(() => store.getters.getLoginMode);

      const welcomeText = computed(() => `Welcome! ${loginMode.value}`);
      console.log(loginMode);

      return {
        loginMode,
        welcomeText,
      }
    },

    data() {
      return {
        apiUrl: config.apiUrl,
        firstLabel: 'Information',
        ifShowBtn: false,
        ifShowLogout: true,
        items: [],
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

      async fetchNewsInfo() {
          this.items = [];
          try {
              const response = await axios.post(`${this.apiUrl}/news_info/listall`);
              var rawData = response.data;
              //console.log(rawData);
              for (var i=0; i<rawData.length; i++) {
                  this.items.push({
                      value: rawData[i][0],
                      title: rawData[i][1],
                      content: (rawData[i][2] || '').replace(/\\n/g, '\n'),
                      date: rawData[i][3] ? rawData[i][3].split(' ')[0] : '',
                      whole_content: rawData[i][2],
                  });
              }
              console.log(this.items);
          } catch (error) {
              console.error('Error fetch news information', error);
          }
      },
    },

    mounted() {
      this.fetchNewsInfo();
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
        //color: #7C7C7C;
        color: #fc426a;
        display: flex;
        justify-content:space-between;
        align-items: center;
        margin-bottom: 20px;
        margin-left: 5%;
        margin-right: 5%;
        border-radius: 7px;
        border: 1px solid #00AAEE;
        cursor: pointer;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
        padding-left: 1vw;
        padding-right: 1vw;
        &:hover {
          background: #eef4f8;
        }
        .news-title{
          flex: 3;
          text-align: start;
          font-size: 16px;
          font-weight: bold;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .news-content{
          flex: 5;
          text-align: start;
          margin-left: 40px;
          font-size: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .news-date{
          flex: 1;
          text-align: start;
          margin-left: 40px;
          font-size: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
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
          width: 320px;
          height: 90px;
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background-color: #00AAEE;
          color: white;
          font-size: 18px;
          //margin-top: 7vw;
          cursor: pointer;
          margin-right: 100px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
          transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

          &:hover{
              background-color: #0082B3; /* 鼠标悬停时改变背景色 */
              transform: translate(3px, 3px);
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
          width: 320px;
          height: 90px;
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background-color: #00AAEE;
          color: white;
          font-size: 18px;
          //margin-top: 7vw;
          cursor: pointer;
          margin-left: 100px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
          transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

          &:hover{
              background-color: #0082B3; /* 鼠标悬停时改变背景色 */
              transform: translate(3px, 3px);
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

  /* 移动端适配 */
  @media (max-width: 768px) {
    .index .content-container {
      padding: 20px 15px;

      .news {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        margin-left: 2%;
        margin-right: 2%;
        padding: 12px;

        .news-title,
        .news-content,
        .news-date {
          flex: none;
          width: 100%;
          margin-left: 0;
          white-space: normal;
          text-overflow: unset;
          overflow: visible;
        }

        .news-title {
          font-size: 14px;
        }

        .news-content {
          font-size: 13px;
        }

        .news-date {
          font-size: 12px;
          color: #888;
        }
      }

      .buttons {
        flex-direction: column;
        height: auto;
        gap: 20px;
        padding: 20px 0;

        .online,
        .result {
          width: 100%;
          max-width: 300px;
          height: 70px;
          margin: 0;
          font-size: 16px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .index .content-container {
      padding: 15px 10px;

      .news {
        .news-title {
          font-size: 13px;
        }

        .news-content,
        .news-date {
          font-size: 12px;
        }
      }

      .buttons {
        .online,
        .result {
          height: 60px;
          font-size: 15px;
        }
      }
    }
  }
</style>
