<template>
    <div class="selection">
        <LogoBanner :title="title" />

        <div class="buttons">
            <router-link to="/onlinepricelist">
                <button class="b-child"><span>Online Price List</span></button>
            </router-link>

            <router-link to="/chaincutting">
                <button class="b-child"><span>Chain Cutting & Assembled at TTCL warehouse</span></button>
            </router-link>
        </div>
        <FooterBtn :ifShow2="ifShow2" :toWhere="nextPage" />
    </div>

</template>

<script>
// @ is an alias to /src
import LogoBanner from '@/components/LogoBanner.vue'
import FooterBtn from '@/components/FooterBtn.vue'

export default {
  name: 'SelectionView',
  data(){
    return{
        title: "Online Quotation",
        ifShow2: false,
        nextPage: '/index'
    }
  },
  components: {
    LogoBanner,
    FooterBtn,
  }
}
</script>


<style scoped lang="less">
    .selection {
        //max-width: 100vw;
        width: 100%;
        margin: 0 auto;
        .buttons{
            margin-top: 170px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
                
            .b-child{
                padding: 10px 20px;
                line-height: 1.5;
                background-color: #00AAEE;
                color: white;
                font-size: 18px;
                width: 320px;
                height: 90px;
                border: none;
                margin: 0 100px;
                border-radius: 5px;
                cursor: pointer;

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

</style>