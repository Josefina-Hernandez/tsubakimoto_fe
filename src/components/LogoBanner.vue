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

      const welcomeMap = {
        "Tsubakimoto": 'Welcome! TTCL',
        "KTE Bangkok": 'Welcome! TSUBACO KTE CO., LTD. (Bangkok)',
        "KTE Pattaya": 'Welcome! TSUBACO KTE CO., LTD. (Pattaya)',
        "KTE Corporation": "Welcome! KTE CORPORATION CO., LTD.",
        "NICHIDEN": 'Welcome! NICHIDEN TRADING (THAILAND) CO., LTD.',
        "HRD": 'Welcome! HRD (THAILAND) CO., LTD.',
        "PLANET": "Welcome! PLANET T AND S CO., LTD.",
      };

      const welcomeText = computed(() =>
        welcomeMap[loginMode.value] ?? `Welcome! ${loginMode.value}`
      );

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
    padding: 20px;
    display: flex;
    align-items: center;
    
    img{
        width: 250px;
        margin-left: 50px;
    }
    .welcome {
      font-size: 22px;
      font-weight: bold;
      margin-right: 5vw;
      margin-left: auto;
      margin-top: 0px;
      float: right;
      color: #7C7C7C;
    }
  }

  
  .banner-container {
    //margin-top: 5px;
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
