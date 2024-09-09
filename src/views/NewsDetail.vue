<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <div class="title">
            <div class="decoration"></div>
            <h3>{{ title }}</h3>
        </div>
        
        <div class="contents">
            <div class="text">{{ content }}</div>
            <div class="date">{{ date }}</div>
        </div>
      </div>

      <NewsFooterBtn :ifShow1="true" :ifShow2="true" :toWhere="prevousPage" :clickFunction1="goToPrev"
      :clickFunction2="goToNext" :isButtonDisabled1="prevDisabled" :isButtonDisabled2="nextDisabled" />
    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    import NewsFooterBtn from '@/components/NewsFooterBtn.vue'
    export default {
        name: 'NewsDetail',
        data() {
            return {
                prevousPage: "/news-page",
                firstLabel: 'Information',
                items: [
                    {value: '1', title: 'New update of Quotation System 1', content: 'We have updated the system. 1', date: '2024-04-05',},
                    {value: '2', title: 'New update of Quotation System 2', content: 'We have updated the system. 2', date: '2024-04-05',},
                    {value: '3', title: 'New update of Quotation System 3', content: 'We have updated the system. 3', date: '2024-04-05',},
                    {value: '4', title: 'New update of Quotation System 4', content: 'We have updated the system. 4', date: '2024-04-05',},
                    {value: '5', title: 'New update of Quotation System 5', content: 'We have updated the system. 5', date: '2024-04-05',},
                ],
                title: '',
                content: '',
                date: '',

                prevDisabled: false,
                nextDisabled: false,
            };
        },
        created() {
            const newsId = this.$route.params.id;
            this.fetchNewsContent(newsId);
        },  
        components: {
            BannerContainer,
            NewsFooterBtn,
        },

        methods: {
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
                    this.$router.push({name: 'newsdetail', params: {id: pre_id}});
                }       
            },
            goToNext (){
                const id = this.$route.params.id;
                const next_id = (parseInt(id) + 1).toString();
                if (!this.nextDisabled) {
                    this.$router.push({name: 'newsdetail', params: {id:next_id}});
                }
            }
        },

        mounted () {
            this.checkPreviousNext();
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

        .main-contents{
            margin-left: 8%;
            margin-right: 8%;
            .title{
                margin-top: 50px;
                display: flex;
                align-items: center;
                height: 70px;
                .decoration{
                        height: 70px;
                        //width: 10px;
                        background-color: #53C5F4;
                        border-radius: 3px;
                        flex: 0.2;
                    }
                h3{     
                        text-align: left;
                        font-size: 28px;
                        font-weight: bold;
                        padding-left: 10%;
                        flex: 31;
                    }
            }

            .contents{
                margin-top: 50px;
                
                .text {
                    font-size: 24px;
                    text-align: left;
                    padding-left: 10%;
                }
                .date{
                    font-size: 22px;
                    text-align:start;
                    padding-left: 10%;
                    margin-top: 50px;
                }
            }
        }
    }
</style>