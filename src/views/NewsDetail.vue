<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <transition :name="transitionName" mode="out-in">
        <div class="main-contents" :key="$route.params.id">
            <div class="title">
                <div class="decoration"></div>
                <h3>{{ title }}</h3>
            </div>
            
            <div class="contents">
                <div class="text">{{ content }}</div>
                <div class="date">{{ date }}</div>
            </div>
        </div>
      </transition>
      

      <NewsFooterBtn :ifShow1="true" :ifShow2="true" :toWhere="prevousPage" :clickFunction1="goToPrev"
      :clickFunction2="goToNext" :isButtonDisabled1="prevDisabled" :isButtonDisabled2="nextDisabled" />
    </div>
  </template>

<script>
    import axios from 'axios';
    import BannerContainer from '@/components/BannerContainer.vue';
    import NewsFooterBtn from '@/components/NewsFooterBtn.vue';
    import config from '@/config.js';
    export default {
        name: 'NewsDetail',
        data() {
            return {
                apiUrl: config.apiUrl,

                prevousPage: "/news-page",
                firstLabel: 'Information',
                items: [],
                title: '',
                content: '',
                date: '',

                prevDisabled: false,
                nextDisabled: false,

                transitionName: 'slide-left',
            };
        },
        async created() {
            await this.fetchNewsInfo();
            const newsId = this.$route.params.id;
            this.fetchNewsContent(newsId);
            this.checkPreviousNext();
        },  
        components: {
            BannerContainer,
            NewsFooterBtn,
        },

        methods: {
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
                        //console.log(rawData[i]);
                    }
                    //console.log(this.items);
                    this.items.reverse();
                } catch (error) {
                    console.error('Error fetch news information', error);
                }
            },

            checkPreviousNext() {
                const id = this.$route.params.id;
                const pre_id = (parseInt(id) - 1).toString();
                const next_id = (parseInt(id) + 1).toString();

                const foundPrevous = this.items.find(item => item.value === pre_id);
                if (foundPrevous) {
                    this.prevDisabled = false;
                    //console.log('pre enabled');
                } else {
                    this.prevDisabled = true;
                    //console.log('pre disabled');
                }

                const foundNext = this.items.find(item => item.value === next_id);
                if (foundNext) {
                    this.nextDisabled = false;
                    //console.log('next enabled');
                } else {
                    this.nextDisabled = true;
                    //console.log('next disabled');
                }

                this.fetchNewsContent(id);
            },

            fetchNewsContent(id) {
                const selectedItem = this.items.find(item => item.value === id);
                this.title = selectedItem.title;
                this.content = selectedItem.content;
                this.date = selectedItem.date;
            },
            goToPrev (){
                const id = this.$route.params.id;
                const pre_id = (parseInt(id) - 1).toString();
                if (!this.prevDisabled) {
                    this.transitionName = 'slide-right';
                    this.$router.push({name: 'newsdetail', params: {id: pre_id}});
                }       
            },
            goToNext (){
                const id = this.$route.params.id;
                const next_id = (parseInt(id) + 1).toString();
                if (!this.nextDisabled) {
                    this.transitionName = 'slide-left';
                    this.$router.push({name: 'newsdetail', params: {id:next_id}});
                }
            }
        },

        mounted () {
            
        },

        watch: {
            '$route.params.id' : 'checkPreviousNext',
        }
    }
</script>

<style scoped lang="less">
    .index {
        //max-width: 100vw;
        margin: 0 auto;
        width: 100%;
        overflow-x: hidden;  //在新闻页进行横向slide的期间，禁止浏览器下方出现横向滚动条，以撑大高度

        .main-contents{
            margin-top: 20px;
            margin-left: 8%;
            margin-right: 8%;
            margin-bottom: 10px;
            height: calc(73vh);
            //border: 1px solid red;
            /* 关键：添加上下透明边框 */
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            .title{
                margin-top: 10px;
                margin-left: 2vw;
                margin-right: 2vw;
                display: flex;
                align-items: center;
                height: 70px;
                .decoration{
                        height: 50px;
                        //width: 10px;
                        background-color: #53C5F4;
                        border-radius: 3px;
                        flex: 0.15;
                    }
                h3{     
                        text-align: left;
                        font-size: 24px;
                        font-weight: bold;
                        padding-left: 10%;
                        flex: 31;
                    }
            }

            .contents{
                margin-top: 50px;
                margin-left: 2vw;
                margin-right: 2vw;
                
                .text {
                    white-space: pre-line;
                    font-size: 22px;
                    text-align: left;
                    padding-left: 10%;
                }
                .date{
                    font-size: 20px;
                    text-align:start;
                    padding-left: 10%;
                    margin-top: 60px;
                }
            }
        }
    }

    .slide-left-enter-active {
        animation: slideInFromRight 0.6s ease;
    }

    .slide-left-leave-active {
        animation: slideOutToLeft 0.03s ease;
    }

    .slide-right-enter-active {
        animation: slideInFromLeft 0.6s ease;
    }

    .slide-right-leave-active {
        animation: slideOutToRight 0.03s ease;
    }

    @keyframes slideInFromRight {
        from {
            opacity: 1;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutToLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 1;
            transform: translateX(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutToRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
</style>