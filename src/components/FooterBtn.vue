<template>
    <div class="footer">
        <router-link :to="toWhere">
            <button class="back"><span>Back</span></button>
        </router-link>
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
            top: 680px;
            
            
            .back, .quotation{
                background-color: #4472C4;
                width: 130px;
                height: 35px;
                border: none;
                margin: 0 200px 50px;
                border-radius: 5px;
                color: white;
                font-size: 20px;
                cursor: pointer;

                span {
                    position: relative; 
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease;
                }

                &:hover{
                    background-color: #2C4D89;
                }

                &:hover span {
                    top: 2px; 
                    left: 2px; 
                }
            }
            .quotation{
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
</style>