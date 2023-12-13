<template>
  <div class="index">
    <div class="logo-container">
      <img alt="Company logo" src="../assets/logo.png" />
    </div>
    <div class="banner-container">
      <div class="banner-options">
        <div class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <a class="first-link" href="#/index">What's New</a>
          <div class="dropdown-content" v-show="showDropdown">
            <a href="#/index">Monthly Exchange</a>
            <a href="#/index">Standard Formation of Chain</a>
            <a href="#/index">Standard Packing of Chain</a>
            <a href="#/index">RPP Website</a>
            <a href="#/index">Catalog</a>
          </div>
          <i class="fa fa-caret-down"></i>
        </div>
        <a href="#/index">How to Order</a>
        <a href="#/index">Contact Us</a>
      </div>
    </div>
    <div class="content-container">
      <router-link to="/selection">
        <button class="online">
          <span>Online Quotation</span>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showDropdown: false,
      };
    },
  };
</script>

<style scoped lang="less">
  .index {
    max-width: 100vw;
    margin: 0 auto;
  }

  .logo-container {
    text-align: left;
    padding: 30px;
  }

  .banner-container {
    height: 70px;
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

        .dropdown-content {
          position: absolute;
          top: 100%;
          left: -70px;
          z-index: 1;
          display: none;
          flex-direction: column;
          background-color:#E7E6E6;
          min-width: 300px;
          padding: 12px 1px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          text-align: center;

          a {
            color: white;
            padding: 6px 12px;
            text-decoration: none;
            display: block;
            background-color: #AFABAB;
            margin: 10px 0;
            width: 300px;
            border: 1px solid white;
          }

          a:hover {
            background-color: #00AAEE;
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

  .content-container {
    padding: 40px;
    .online{
      width: 400px;
      height: 150px;
      border-radius: 20px;
      border: none;
      background-color: #00AAEE;
      color: white;
      font-size: 30px;
      margin-top: 7vw;
      cursor: pointer;

      &:hover{
                    background-color: #0082B3; /* 鼠标悬停时改变背景色 */
                }

                span {
                    position: relative; /* 添加相对定位 */
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
                }

                &:hover span {
                    top: 2px; /* 鼠标悬停时移动文本 */
                    left: 2px; /* 鼠标悬停时移动文本 */
                }
    }

  }
</style>
