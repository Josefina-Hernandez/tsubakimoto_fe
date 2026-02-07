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
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            bottom: 0px;
            
            .back, .download {
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

    /* 移动端适配 */
    @media (max-width: 768px) {
        .footer {
            position: relative;
            flex-direction: column;
            gap: 10px;
            padding: 15px;
            bottom: auto;

            > a {
                width: 100%;
            }

            .back,
            .download {
                width: 100%;
                height: 40px;
                margin: 0;
                font-size: 16px;
            }

            .back {
                background-color: #DD0000;

                &:hover {
                    background-color: #AA0000;
                }
            }

            .right {
                width: 100%;
                justify-content: center;

                .download {
                    width: 100%;
                }
            }
        }
    }

    @media (max-width: 480px) {
        .footer {
            .back,
            .download {
                height: 38px;
                font-size: 15px;
            }
        }
    }
</style>