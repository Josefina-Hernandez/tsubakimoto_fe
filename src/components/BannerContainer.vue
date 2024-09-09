<template>
      <div class="logo-container">
        <a href="/#/index">
          <img alt="Company logo" src="../assets/logo.png" />
        </a>
        <span v-if="ifShowBtn" class="btn-back"><button @click="backToMain">Online Quotation</button></span>
        <span v-if="ifShowLogout" class="btn-back"><button @click="backToLogin">Logout</button></span>
        <span class="welcome">{{welcomeText}}</span>
      </div>

      <div class="banner-container">
        <div class="banner-options">
          <div class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
            <a class="first-link" href="#/index" @click.prevent="freezeClick">{{ firstLabel }}</a>
            <div class="dropdown-content" v-show="showDropdown">
              <a href="#/exchange"  @click="hideItself">Monthly Exchange</a>
              <a href="#/formation-chain" @click="hideItself">Standard Formation of Chain</a>
              <a href="#/packing-chain" @click="hideItself">Standard Packing of Chain</a>
              <a href="https://www.akaganethailand.co.th/" target="_blank" @click="hideItself">RPP Website</a>
              <a href="https://www.akaganethailand.co.th/" target="_blank" @click="hideItself">Catalog</a>
            </div>
            <i class="fa fa-caret-down"></i>
          </div>
          <a href="#/news-page">News</a>
          <a href="#/how-to-order">How to Order</a>
          <a href="#/contact-us">Contact Us</a>
        </div>
      </div>
</template>

<script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';

  export default {
    setup() {
      const store = useStore();
      const loginMode = computed(() => store.getters.getLoginMode);

      const welcomeText = computed(() => `Welcome! ${loginMode.value}`);

      return {
        loginMode,
        welcomeText,
      }
    },
    name: 'BannerContainer',
    data() {
        return{
            showDropdown: false,
        };
    },
    props: {
        firstLabel: String,
        ifShowBtn: Boolean,
        ifShowLogout: Boolean,
    },
    methods: {
        hideItself() {
            this.showDropdown = false;
        },

        freezeClick(event) {
            event.preventDefault();
            
        },
        backToMain() {
          this.$router.push({path: '/index'});
        },
        backToLogin() {
          this.$router.push({path: '/'})
        },
    }

  };
</script>

<style scoped lang="less">
      .logo-container {
        text-align: left;
        padding: 30px;
        display: flex;
        img{
            width: 300px;
            height: 70px;
            margin-left: 50px;
        }
        .btn-back{
            margin-left: 4%;
            margin-top: 5px;
            display: block;
            height: 70px;
            line-height: 70px;
            button{
                align-items: center;
                background-color: #53C5F4;
                color: white;
                font-size: 20px;
                font-weight: bold;
                height: 70px;
                width: 250px;
                border: none;
                border-radius: 10px;
                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                &:hover{
                    background-color: #48a6ce;
                    transform: translate(-3px, -3px);
                }
                cursor: pointer;
            }
        }
        .welcome{
          margin-left: auto;
          margin-right: 5vw;
          font-size: 28px;
          font-weight: bold;
          float: right;
          margin-top: 20px;
          color: #7C7C7C;
        }
      }
    
      .banner-container {
        height: 70px;
        width: 100%;
        background-color: #53C5F4;
        display: flex;
        justify-content: center;
        align-items: center;
    
        .banner-options {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin: 0 20px;
          padding-left: 10vw;
          padding-right: 10vw;
          font-size: 23px;
          color: white;
    
          .dropdown {
            position: relative;
            display: inline-block;
            //border: 1px solid green;
            width: 350px;
    
            .dropdown-content {
              position: absolute;
              top: 100%;
              left: 30px;
              z-index: 1;
              display: none;
              flex-direction: column;
              background-color: #3EBCF2;
              min-width: 300px;
              padding: 12px 1px;
              box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
              text-align: center;
    
              a {
                color: white;
                padding: 6px 12px;
                text-decoration: none;
                display: block;
                background-color: #3EBCF2;
                margin: 10px 0;
                width: 300px;
                border: none;
              }
    
              a:hover {
                background-color: #0D8FC8;
              }
            }
          }
    
          .dropdown:hover .dropdown-content {
            display: flex;
          }
    
          .first-link::after {
            content: '';
            display: inline-block;
            margin-left: 10px;
            width: 0;
            height: 0;
            border-top: 10px solid white;
            border-right: 10px solid transparent;
            border-bottom: 0 solid transparent;
            border-left: 10px solid transparent;
            vertical-align: middle;
          }
        }
      }
</style>