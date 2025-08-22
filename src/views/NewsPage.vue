<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <h3>News</h3>
        <div class="list">
            <div class="item" v-for="item in items" :key="item.value" @click="goToDetail(item)">
                <div class="decoration"></div>
                <div class="title">{{ item.title }}</div>
                <div class="contents">{{ item.content }}</div>
                <div class="date">{{ item.date }}</div>
            </div>
        </div>
      </div>

    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    import config from '@/config.js';
    import axios from 'axios';

    export default {
        name: 'NewsPage',
        data() {
            return {
                apiUrl: config.apiUrl,

                firstLabel: 'Information',
                items: [
                    // {value: '1', title: 'New update of Quotation System 1', content: 'We have updated the system. 1', date: '2024-04-05',},
                    // {value: '2', title: 'New update of Quotation System 2', content: 'We have updated the system. 2', date: '2024-04-05',},
                    // {value: '3', title: 'New update of Quotation System 3', content: 'We have updated the system. 3', date: '2024-04-05',},
                    // {value: '4', title: 'New update of Quotation System 4', content: 'We have updated the system. 4', date: '2024-04-05',},
                    // {value: '5', title: 'New update of Quotation System 5', content: 'We have updated the system. 5', date: '2024-04-05',},
                ],
            };
        },
        components: {
            BannerContainer,
        },

        mounted() {
            this.fetchNewsInfo();
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
                    }
                    this.items.reverse();
                    console.log(this.items);
                } catch (error) {
                    console.error('Error fetch news information', error);
                }
            },

            goToDetail(item) {
                this.$router.push({name: 'newsdetail', params: {id: item.value}});
            }
        }
    }
</script>

<style scoped lang="less">
    .index {
        //max-width: 100vw;
        margin: 0 auto;
        width: 100%;

        .main-contents{
            h3{
                margin-top: 20px;
                font-size: 22px;
                font-weight: bold;
            }

            .list{
                margin-left: 8%;
                margin-right: 8%;
                margin-top: 30px;
                display: flex;
                flex-direction: column;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                height: 75vh;
                overflow-y: auto;

                /* 关键：添加上下透明边框 */
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;

                .item{
                    display: flex;
                    min-height: 50px;
                    align-items: center;
                    margin-bottom: 15px;
                    padding: 0 50px;
                    font-size: 19px;
                    font-weight: bold;
                    border-radius: 5px;
                    color: rgb(79, 79, 79);
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                    &:first-child {
                        margin-top: 20px;
                    }
                    &:hover{
                        background-color: #53C5F4;
                        color: white;
                        transform: translate(0px, -2px);
                        cursor: pointer;
                    }
                    .decoration{
                        flex: 0.1;
                        height: 40px;
                        background-color: #53C5F4;
                        border-radius: 3px;
                    }
                    .title{
                        margin-left: 3vw;
                        flex: 10;
                        text-align: left;
                    }
                    .contents{
                        flex: 40;
                        font-weight: lighter;
                        margin-left: 3vw;
                        text-align: left;

                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .date{
                        flex: 10;
                        text-align: right;
                    }

                }
            }
        }
    }
</style>