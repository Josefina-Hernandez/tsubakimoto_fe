<template>
    <div class="blue-box">
        <div class="circle"></div>
        <p>Welcome Admin!</p>
    </div>
    <div class="top">
        <div class="logo">
            <img src="../../assets/logo.png" alt="logo">
        </div>
    </div>  
</template>

<script>
export default {
  name: 'BannerAdmin',
}
</script>

<style scoped lang="less">
    .blue-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 250px;
        height: 60px;
        background-color: #4472C4;
        border-radius: 3px;

        .circle{
            position: absolute;
            left: 25px;
            top: 15px;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            background: white;
        }
        p{
            position: absolute;
            top: 20px;
            left: 75px;
            color: white;
            font-size: 17px;
        }
    }
    .top{
        //width: 100vw;
        width: 100%;
        margin-top: 4vh;
        .logo{
            padding-right: 40px;
        }
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .blue-box {
            width: 100%;
            height: 45px;
            border-radius: 0;

            .circle {
                left: 12px;
                top: 10px;
                width: 20px;
                height: 20px;
            }

            p {
                top: 12px;
                left: 45px;
                font-size: 14px;
            }
        }

        .top {
            margin-top: 3px;

            .logo {
                padding-right: 0;
                text-align: center;

                img {
                    max-width: 28%;
                    height: auto;
                }
            }
        }
    }

    @media (max-width: 480px) {
        .blue-box {
            height: 40px;

            .circle {
                left: 10px;
                top: 9px;
                width: 18px;
                height: 18px;
            }

            p {
                top: 10px;
                left: 38px;
                font-size: 13px;
            }
        }

        .top {
            margin-top: 3px;

            .logo img {
                max-width: 25%;
            }
        }
    }
</style>