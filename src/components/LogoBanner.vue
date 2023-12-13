<template>

        <div class="logo-container">
            <img alt="Company logo" src="../assets/logo.png" />
            <div class="welcome">{{welcome}}</div>
        </div>
        <div class="banner-container">
            <div class="text">{{title}}</div>
        </div>
</template>


<script>
export default {
  name: 'LogoBanner',
  props: {
    title: String,
    welcome: String
  }
}
</script>

<style scoped lang="less">

  .logo-container {
    text-align: left;
    padding: 30px;
    .welcome {
    font-size: 28px;
    font-weight: bold;
    margin-right: 5vw;
    margin-left: auto;
    margin-top: 20px;
    float: right;
    color: #7C7C7C;
  }
  }

  
  .banner-container {
    height: 50px;
    background-color: #53C5F4;
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
      font-size: 23px;
      color: white;
    }
  }

</style>
