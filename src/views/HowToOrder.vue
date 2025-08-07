<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <div class="title">
            <h3>How to Order</h3>
        </div>
        
        <div class="contents">
            <div class="text">
                ① Click Online Quatation button <br>
                【画像】<br><br>
                ② Choose Chain type<br>
                【画像】<br><br>
                ・・・
            </div>
        </div>
      </div>
    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    export default {
        name: 'HowToOrder',
        data() {
            return {
                firstLabel: 'Information',

            };
        },

        components: {
            BannerContainer,
        },

        methods: {

        },

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
                margin-top: 20px;
                align-items: center;
                height: 70px;
                h3{     
                        text-align: center;
                        font-size: 22px;
                        font-weight: bold;
                    }
            }

            .contents{
                margin-top: 50px;
                
                .text {
                    font-size: 20px;
                    text-align: left;
                    padding-left: 10%;
                }
            }
        }
    }
</style>