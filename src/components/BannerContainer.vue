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
              <a href="#/formation-chain" @click="hideItself">Product Info</a>
              <!-- <a href="#/packing-chain" @click="hideItself">Standard Packing of Chain</a> -->
              <!-- <a href="https://www.akaganethailand.co.th/" target="_blank" @click="hideItself">RPP Website</a> -->
              <!-- <a href="https://www.akaganethailand.co.th/" target="_blank" @click="hideItself">Catalog</a> -->
            </div>
            <!-- <i class="fa fa-caret-down"></i> -->
          </div>
          <a class="link-label" href="#/news-page">News</a>
          <a class="link-label" href="#/how-to-order">How to Order</a>
          <a class="link-label" href="#/contact-us">Contact Us</a>
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

      const welcomeMap = {
        "Tsubakimoto": 'Welcome! TTCL',
        "KTE Bangkok": 'Welcome! TSUBACO KTE CO., LTD. (Bangkok)',
        "KTE Pattaya": 'Welcome! TSUBACO KTE CO., LTD. (Pattaya)',
        "KTE Corporation": "Welcome! KTE CORPORATION CO., LTD.",
        "NICHIDEN": 'Welcome! NICHIDEN TRADING (THAILAND) CO., LTD.',
        "HRD": 'Welcome! HRD (THAILAND) CO., LTD.',
        "PLANET": "Welcome! PLANET T AND S CO., LTD.",
      };

      // const welcomeText = computed(() => 
      // loginMode.value === 'Tsubakimoto' ? 'Welcome! TTCL' : `Welcome! ${loginMode.value}`);

      const welcomeText = computed(() => 
        welcomeMap[loginMode.value] ?? `Welcome! ${loginMode.value}`
      );

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
        padding: 20px;
        display: flex;
        align-items: center;
        img{
            width: 250px;
            //height: 70px;
            margin-left: 50px;
        }
        .btn-back{
            margin-left: 4%;
            //margin-top: 5px;
            display: block;
            //height: 70px;
            //line-height: 70px;
            button{
                align-items: center;
                background-color: #05AAEE;
                color: white;
                font-size: 18px;
                font-weight: bold;
                height: 50px;
                width: 250px;
                border: none;
                border-radius: 10px;
                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                &:hover{
                    background-color: #0082B3; 
                    transform: translate(3px, 3px);
                }
                cursor: pointer;
            }
        }
        .welcome{
          margin-left: auto;
          margin-right: 5vw;
          font-size: 22px;
          font-weight: bold;
          float: right;
          margin-top: 0px;
          color: #7C7C7C;
        }
      }
    
      .banner-container {
        height: 50px;
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
          font-size: 20px;
          font-weight: bold;
          color: white;

          .link-label {
            transition: transform 0.3s;
            &:hover {
              transform: translate(5px, -5px) scale(1.1);
            }
          }
    
          .dropdown {
            position: relative;
            display: inline-block;
            //border: 1px solid green;
            width: 350px;
            z-index: 5;

            transition: transform 0.5s;
            &:hover {
              transform: translate(5px, -5px) scale(1.1);
            }
    
            .dropdown-content {
              position: absolute;
              top: 100%;
              left: 30px;
              z-index: 1000;
              display: none;
              flex-direction: column;
              background-color: #3EBCF2;
              min-width: 300px;
              padding: 12px 1px;
              box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.4);
              text-align: center;
              font-size: 17px;
    
              a {
                color: white;
                padding: 6px 12px;
                text-decoration: none;
                display: block;
                background-color: rgba(13, 143, 200, 0); 
                margin: 10px 0;
                width: 300px;
                border: none;
                transition: transform 0.3s;
              }
    
              a:hover {
                background-color: rgba(13, 143, 200, 0); // 50% 透明度
                transform: translate(0px, -5px) scale(1.1);
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