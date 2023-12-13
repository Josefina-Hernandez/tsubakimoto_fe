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
        background-color: #00AAEE;
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
        width: 100vw;
        margin-top: 4vh;
    }
</style>