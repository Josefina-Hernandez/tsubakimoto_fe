<template>
  <div class="select-container">
    <BannerAdmin />
    <!-- <div class="header">
      <div class="logo">
        <img alt="Vue logo" src="../../assets/logo.png">
      </div>
    </div> -->
    <div class="buttons">
      <a href="#/admin/user" class="button"><span>User Account Management</span></a>
      <!--<a href="#/admin/quotation-results" class="button"><span>Quotation Results</span></a>-->
      <a href="#/admin/price-list" class="button"><span>Price List</span></a>
      <a href="#/admin/admin-exchange" class="button"><span>Monthly Exchange</span></a>
    </div>
    <div class="footer">
      <button @click="backToLogin">Logout</button>
    </div>
  </div>
</template>
 <script>
 import BannerAdmin from '@/components/admin/BannerAdmin.vue';
export default {
  name: 'SelectAdmin',
  data() {
    return{

    }
  },
  components: {
      BannerAdmin,
  },

  methods: {
    backToLogin() {
      this.$router.push({path: '/admin/login'});
    },
  },
}
</script>
 <style scoped lang="less">
// .header {
//   margin-top: 30px;
//   padding: 20px;
//   text-align: center;

//   .logo {
//     background-size: cover;
//     margin: 0 auto;
//   }
// }
 
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 130px;
  text-align: center;
  align-items: center;

  .button {
    margin: 0 30px;
    padding: 10px 20px;
    width: 200px;
    height: 150px;
    background-color: #4472C4;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    display: flex;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

    &:hover{
        background-color: #284782;
        transform: translate(3px, 3px);
    }

    span{
        position: relative; /* 添加相对定位 */
        top: 0;
        left: 0;
        transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
    }

    &:hover span{
        top: 2px;
        left: 2px;
    }
  }
}

.footer {
  margin-top: 150px;
  button {
    padding: 10px 20px;
    background-color: #4472C4;
    color: white;
    font-size: 18px;
    width: 200px;
    height: 40px;
    border: none;
    margin: 0 100px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

    &:hover{
        background-color: #284782;/* 鼠标悬停时改变背景色 */
        transform: translate(3px, 3px);
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