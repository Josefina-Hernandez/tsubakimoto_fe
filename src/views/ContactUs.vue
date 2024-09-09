<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <div class="title">
            <h3>Contact Us</h3>
        </div>
        
        <div class="contents">
            <div class="text">
                <b>Tsubakimoto Thailand</b><br><br><br><br>
                Address<br><br>
                Tel:<br><br>
                Mail address:<br><br>

                ・・・
            </div>
        </div>
      </div>
    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    export default {
        name: 'ContactUS',
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
                margin-top: 50px;
                align-items: center;
                height: 70px;
                h3{     
                        text-align: center;
                        font-size: 28px;
                        font-weight: bold;
                    }
            }

            .contents{
                margin-top: 50px;
                
                .text {
                    font-size: 24px;
                    text-align: left;
                    padding-left: 10%;
                }
            }
        }
    }
</style>