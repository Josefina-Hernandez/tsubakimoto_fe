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

    export default {
        name: 'NewsPage',
        data() {
            return {
                firstLabel: 'Information',
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
                margin-top: 50px;
                font-size: 28px;
                font-weight: bold;
            }

            .list{
                margin-left: 8%;
                margin-right: 8%;
                margin-top: 30px;
                display: flex;
                flex-direction: column;

                .item{
                    display: flex;
                    height: 70px;
                    align-items: center;
                    margin-bottom: 15px;
                    padding: 0 50px;
                    font-size: 21px;
                    font-weight: bold;
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                    &:hover{
                        background-color: #53C5F4;
                        color: white;
                        transform: translate(-2px, -2px);
                        cursor: pointer;
                    }
                    .decoration{
                        flex: 0.2;
                        height: 70px;
                        background-color: #53C5F4;
                        border-radius: 3px;
                    }
                    .title{
                        margin-left: 10px;
                        flex: 15;
                    }
                    .contents{
                        flex: 10;
                        font-weight: lighter;
                    }
                    .date{
                        flex: 6;
                    }

                }
            }
        }
    }
</style>