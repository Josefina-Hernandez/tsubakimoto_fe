<template>
    <div class="index">
      
      <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <h3>Standard Packing of Chain</h3>
        <h4>Chain Type</h4>
        <div class="list">
            <div class="item" v-for="item in this.items" :key="item.value">
                <div>
                    <div class="item-label" :data-selected="item.ifSelected"  @click="toggleDetail(item)">{{ item.label }}</div>
                    <div 
                        v-if="item.ifSelected"
                        class="item-detail"
                        :key="'detail-' + item.value"
                        >
                        <div class="detail-image">
                            <img :src="require(`@/assets/pics/${item.imageName}`)"  alt="Image for {{ item.label }}">
                        </div>
                        <div class="detail-text">
                            <p>Title about {{ item.label }}</p>
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>
                
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
                    {value: '1', label: 'Standard Packing of Chain 1', imageName: 'packing.jpg', description: 'Details about Standard Packing of Chain 1...', ifSelected: false},
                    {value: '2', label: 'Standard Packing of Chain 2', imageName: 'packing.jpg', description: 'Details about Standard Packing of Chain 2...', ifSelected: false},
                    {value: '3', label: 'Standard Packing of Chain 3', imageName: 'packing.jpg', description: 'Details about Standard Packing of Chain 3...', ifSelected: false},
                    {value: '4', label: 'Standard Packing of Chain 4', imageName: 'packing.jpg', description: 'Details about Standard Packing of Chain 4...', ifSelected: false},
                    {value: '5', label: 'Standard Packing of Chain 5', imageName: 'packing.jpg', description: 'Details about Standard Packing of Chain 5...', ifSelected: false},
                    {value: '6', label: 'Standard Packing of Chain 6', imageName: 'packing.jpg', description: 'Details about Standard Packing of Chain 6...', ifSelected: false},
                ],
            };
        },
        components: {
            BannerContainer,
        },
        methods: {
            toggleDetail(item) {
                item.ifSelected = !item.ifSelected;
            }
        },
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
                width: 84%;

                .item{
                    display: flex;
                    justify-content: space-between;
                    background-color: #D7F1FC;
                    width: 100%;
                    align-items: center;
                    margin-bottom: 10px;
                    //padding: 0 50px;
                    font-size: 21px;
                    font-weight: bold;
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                    border-radius: 5px;

                    &:hover{
                        background-color: #53C5F4;
                        color: white;
                        transform: translate(-2px, -2px);
                    }

                    
                    div{
                        height: auto;
                        width: 100%;
                        //border-radius: 5px;
                        .item-label {
                            display: flex;
                            align-items: center;
                            position: relative;
                            height: 70px;
                            margin-left: 50px;

                            &:hover{
                                cursor: pointer;
                            }
                            
                            &::after{
                                margin-right: 60px;
                                content: '';
                                display: inline-block;
                                width: 0;
                                height: 0;
                                border-top: 10px solid #00ACF0;
                                border-right: 10px solid transparent;
                                border-bottom: 0 solid transparent;
                                border-left: 10px solid transparent;
                                position: absolute;
                                right: 0;
                                top: 50%;
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                            }

                            &[data-selected="true"]::after {
                                transform: translateY(-50%) rotate(-90deg); /* 旋转90度 */
                            }
                                
                        }

                        .item-detail {
                            //width: 100%;
                            display: flex;
                            background-color: white;
                            padding: 30px 0;
                            margin-top: 10px;
                            font-size: 18px;
                            color: #333;
                            justify-content: space-between;

                            .detail-image {
                                //flex: 2;
                                margin-right: 70px;
                                margin-left: 0;
                                width: 500px;
                                img{
                                    width: 500px;
                                    height: auto;
                                    
                                }
                            }

                            .detail-text {
                                //flex: 3;
                                p {
                                    margin: 0 0 10px 0;
                                    text-align: left;
                                    font-weight: lighter;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>