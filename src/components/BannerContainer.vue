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
        <!-- 汉堡菜单按钮（移动端显示） -->
        <div class="hamburger-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="banner-options" :class="{ 'mobile-open': mobileMenuOpen }">
          <div class="dropdown" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click="toggleMobileDropdown">
            <a class="first-link" href="#/index" @click.prevent="freezeClick">{{ firstLabel }}</a>
            <div class="dropdown-content" v-show="showDropdown || mobileDropdownOpen">
              <a href="#/exchange" @click="closeMobileMenu">Monthly Exchange</a>
              <a href="#/formation-chain" @click="closeMobileMenu">Product Info</a>
              <!-- <a href="#/packing-chain" @click="closeMobileMenu">Standard Packing of Chain</a> -->
              <!-- <a href="https://www.akaganethailand.co.th/" target="_blank" @click="closeMobileMenu">RPP Website</a> -->
              <!-- <a href="https://www.akaganethailand.co.th/" target="_blank" @click="closeMobileMenu">Catalog</a> -->
            </div>
            <!-- <i class="fa fa-caret-down"></i> -->
          </div>
          <a class="link-label" href="#/news-page" @click="closeMobileMenu">News</a>
          <a class="link-label" href="#/how-to-order" @click="closeMobileMenu">User Manual</a>
          <a class="link-label" href="#/contact-us" @click="closeMobileMenu">Contact Us</a>
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
            mobileMenuOpen: false,
            mobileDropdownOpen: false,
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
        toggleMobileMenu() {
          this.mobileMenuOpen = !this.mobileMenuOpen;
          if (!this.mobileMenuOpen) {
            this.mobileDropdownOpen = false;
          }
        },
        toggleMobileDropdown() {
          if (window.innerWidth <= 768) {
            this.mobileDropdownOpen = !this.mobileDropdownOpen;
          }
        },
        handleMouseEnter() {
          if (window.innerWidth > 768) {
            this.showDropdown = true;
          }
        },
        handleMouseLeave() {
          if (window.innerWidth > 768) {
            this.showDropdown = false;
          }
        },
        closeMobileMenu() {
          this.mobileMenuOpen = false;
          this.mobileDropdownOpen = false;
          this.showDropdown = false;
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
        position: relative;

        .hamburger-btn {
          display: none;
        }
    
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

      /* 移动端适配 */
      @media (max-width: 768px) {
        .logo-container {
          flex-wrap: wrap;
          padding: 10px 15px;
          justify-content: center;

          img {
            width: 180px;
            margin-left: 0;
          }

          .btn-back {
            order: 3;
            margin-left: 0;
            margin-top: 10px;
            width: 100%;
            text-align: center;

            button {
              width: 100%;
              max-width: 280px;
              height: 40px;
              font-size: 15px;
            }
          }

          .welcome {
            order: 2;
            width: 100%;
            text-align: center;
            margin: 8px 0;
            font-size: 14px;
            margin-right: 0;
          }
        }

        .banner-container {
          height: auto;
          min-height: 50px;
          padding: 8px 0;
          flex-direction: column;

          .hamburger-btn {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 45px;
            height: 24px;
            cursor: pointer;
            padding: 10px;
            align-self: flex-start;
            margin-left: 15px;
            box-sizing: content-box;

            span {
              display: block;
              width: 100%;
              height: 4px;
              background-color: white;
              border-radius: 2px;
            }
          }

          .banner-options {
            display: none;
            flex-direction: column;
            width: 100%;
            padding: 0;
            margin: 0;
            font-size: 24px;
            background-color: #53C5F4;

            &.mobile-open {
              display: flex;
            }

            .dropdown {
              width: 100%;
              text-align: center;
              padding: 14px 0;
              border-top: 1px solid rgba(255, 255, 255, 0.2);

              .first-link {
                display: block;
              }

              .dropdown-content {
                position: static;
                transform: none;
                min-width: 100%;
                box-shadow: none;
                background-color: #3EBCF2;
                font-size: 16px;
                padding: 5px 0;

                a {
                  width: 100%;
                  padding: 12px;
                }
              }
            }

            .link-label {
              display: block;
              width: 100%;
              text-align: center;
              padding: 14px 0;
              border-top: 1px solid rgba(255, 255, 255, 0.2);
            }

            .first-link::after {
              border-top-width: 7px;
              border-right-width: 7px;
              border-left-width: 7px;
              margin-left: 5px;
            }
          }
        }
      }

      @media (max-width: 480px) {
        .logo-container {
          img {
            width: 150px;
          }

          .welcome {
            font-size: 12px;
          }

          .btn-back button {
            font-size: 14px;
            height: 36px;
          }
        }

        .banner-container .banner-options {
          font-size: 16px;

          .link-label, .dropdown {
            padding: 10px 0;
          }

          .dropdown-content {
            font-size: 15px;
          }
        }
      }
</style>