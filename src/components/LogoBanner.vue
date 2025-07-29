<template>
        <div class="logo-container">
            <a href="/#/index">
              <img alt="Company logo" src="../assets/logo.png" />
            </a> 
            <div class="welcome">{{welcomeText}}</div>
        </div>
        <div class="banner-container">
            <div class="text">{{title}}</div>
        </div>
</template>


<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  setup() {
      const store = useStore();
      const loginMode = computed(() => store.getters.getLoginMode);

      const welcomeText = computed(() => 
        loginMode.value === 'Tsubakimoto' ? 'Welcome! TTCL' : `Welcome! ${loginMode.value}`);

      return {
        loginMode,
        welcomeText,
      }
    },
  name: 'LogoBanner',
  props: {
    title: String,
  }
}
</script>

<style scoped lang="less">

  .logo-container {
    text-align: left;
    padding: 30px;
    img{
        width: 300px;
        height: 70px;
        margin-left: 50px;
    }
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
    margin-top: 5px;
    height: 70px;
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
