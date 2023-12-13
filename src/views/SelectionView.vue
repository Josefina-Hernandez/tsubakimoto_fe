<template>
    <div class="selection">
        <LogoBanner :title="title" :welcome="welcome" />

        <div class="buttons">
            <router-link to="/search">
                <button class="b-child"><span>Chain & PUTC</span></button>
            </router-link>

            <router-link to="/qtysearch">
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
        title: "",
        welcome: "Welcome! TTCL",
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
        max-width: 100vw;
        margin: 0 auto;
        .buttons{
            margin-top: 140px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
                
            .b-child{
                background-color: #00AAEE;
                color: white;
                font-size: 30px;
                width: 330px;
                height: 150px;
                border: none;
                margin: 0 100px;
                border-radius: 20px;
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