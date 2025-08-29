<template>
    <div class="footer">
        <button class="back" @click="backFunc(toWhere)"><span>Add Other Product</span></button>
        <button class="quotation" v-bind:disabled="isButtonDisabled" v-show="ifShow2" @click="handleClick"><span>Get Quotation</span></button>      
    </div>
</template>

<script>
export default {
  name: 'FooterBtn',
  props: {
    ifShow1: Boolean,
    ifShow2: Boolean,
    toWhere: String,
    clickFunction: Function,
    isButtonDisabled: Boolean,
  },
  methods: {
    handleClick(){
        this.clickFunction();
    },

    backFunc(backUrl) {
        this.$router.push(backUrl);
    },
  },
}
</script>

<style scoped lang="less">
    .footer{
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            //margin-top: 50px;
            bottom: 0px;
            
            
            .back, .quotation{
                background-color:  #00AAEE;
                width: 280px;
                height: 35px;
                border: none;
                margin: 0 40px 30px;
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
            .quotation{
                width: 280px;

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
</style>