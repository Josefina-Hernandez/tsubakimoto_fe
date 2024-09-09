<template>
    <div class="footer">
        <router-link :to="toWhere">
            <button class="back"><span>Back</span></button>
        </router-link>
        <div class="right">
            <button class="download" @click="handleClick"><span>Download All</span></button> 
        </div>            
    </div>
</template>

<script>
export default {
  name: 'ResultFooterBtn',
  props: {
    toWhere: String,
    clickFunction: Function,
  },
  methods: {
    handleClick(){
        this.clickFunction();
    },
  },
}
</script>

<style scoped lang="less">
    .footer{
            //bottom: 30px;
            //bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            margin-top: 50px;
            padding-left: 4%;
            padding-right: 4%;
            
            .back, .download {
                background-color:  #00AAEE;
                width: 130px;
                height: 35px;
                border: none;
                margin: 0 40px 50px;
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
                    background-color: #0082B3;
                }

                &:hover span {
                    top: 2px; 
                    left: 2px; 
                }
            }
            .right{
                display: flex;
                .download{
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