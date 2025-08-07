<template>
    <div class="footer">
        <button class="back" @click="backClick(toWhere)"><span>Back</span></button>
        <div class="right">
            <button class="previous" v-bind:disabled="isButtonDisabled1" v-show="ifShow1" @click="handleClick1"><span>Previous</span></button> 
            <button class="next" v-bind:disabled="isButtonDisabled2" v-show="ifShow2" @click="handleClick2"><span>Next</span></button>  
        </div>            
    </div>
</template>

<script>
export default {
  name: 'NewsFooterBtn',
  props: {
    ifShow1: Boolean,
    ifShow2: Boolean,
    toWhere: String,
    clickFunction1: Function,
    clickFunction2: Function,
    isButtonDisabled1: Boolean,
    isButtonDisabled2: Boolean,
  },
  methods: {
    backClick(backUrl) {
        this.$router.push(backUrl);
    },
    handleClick1(){
        this.clickFunction1();
    },
    handleClick2(){
        this.clickFunction2();
    }
  },
}
</script>

<style scoped lang="less">
    .footer{
            position: absolute;
            //bottom: 30px;
            //bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            //margin-top: 50px;
            bottom: 0px;
            
            
            .back, .previous, .next{
                background-color:  #00AAEE;
                width: 180px;
                height: 35px;
                border: none;
                margin: 0 40px 50px;
                border-radius: 5px;
                color: white;
                font-size: 18px;
                cursor: pointer;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                span {
                    position: relative; 
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease;
                }

                &:hover{
                    background-color: #0082B3;
                    transform: translate(3px, 3px);
                }

                &:hover span {
                    top: 2px; 
                    left: 2px; 
                }
            }
            .right{
                display: flex;
                .previous{
                    width: 200px;

                    &:disabled{
                        pointer-events: none;
                        background-color: #BFBFBF;
                        user-select: none;
                        
                        &:hover{
                            pointer-events: none;
                            background-color: #BFBFBF;
                            opacity: 0.5
                        }
                    }
                }
                .next{
                    width: 200px;

                    &:disabled{
                        pointer-events: none;
                        background-color: #BFBFBF;
                        user-select: none;
                        
                        &:hover{
                            pointer-events: none;
                            background-color: #BFBFBF;
                            opacity: 0.5
                        }
                    }
                }
            }


        
        }
</style>