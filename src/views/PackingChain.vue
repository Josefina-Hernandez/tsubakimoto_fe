<template>
    <div class="index">
      
      <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <h3>Standard Packing of Chain</h3>
        <h4>Chain Type</h4>
        <div class="list">
            <div class="item" v-for="item in this.items" :key="item.value">
                <div>{{ item.label }}</div>
                <div></div>
            </div>
        </div>
      </div>

    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    export default {
        name: 'PackingChain',
        data() {
            return {
                firstLabel: 'Standard Packing of Chain',
                items: [
                    {value: '1', label: 'Standard Packing of Chain'},
                    {value: '2', label: 'Standard Packing of Chain'},
                    {value: '3', label: 'Standard Packing of Chain'},
                    {value: '4', label: 'Standard Packing of Chain'},
                    {value: '5', label: 'Standard Packing of Chain'},
                    {value: '6', label: 'Standard Packing of Chain'},
                ],
            };
        },
        components: {
            BannerContainer,
        }
    }
</script>

<style scoped lang="less">
    .index {
        //max-width: 100vw;
        width: 100%;
        margin: 0 auto;

        .main-contents{
            h3{
                margin-top: 50px;
                font-size: 23px;
                font-weight: bold;
            }
            h4{
                text-align: left;
                margin-top: 50px;
                margin-left: 8%;
                font-size: 22px;
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
                    justify-content: space-between;
                    background-color: #D7F1FC;
                    height: 70px;
                    align-items: center;
                    margin-bottom: 10px;
                    padding: 0 50px;
                    font-size: 21px;
                    font-weight: bold;
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                    &:hover{
                        background-color: #53C5F4;
                        color: white;
                        transform: translate(-2px, -2px);
                    }
                    &:hover div:nth-child(2) {
                        border-top-color: white;
                        transform: translate(-2px, -2px);
                    }

                    div:nth-child(1) {

                    }
                    
                    div:nth-child(2) {
                        content: '';
                        display: inline-block;
                        margin-left: 100px;
                        width: 0;
                        height: 0;
                        border-top: 10px solid #00ACF0;
                        border-right: 10px solid transparent;
                        border-bottom: 0 solid transparent;
                        border-left: 10px solid transparent;
                        vertical-align: middle;
                        transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                    }
                }
            }
        }
    }
</style>