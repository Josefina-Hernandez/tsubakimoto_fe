<template>
  <div class="select-container">
    <div class="header">
      <div class="logo">
        <img alt="Vue logo" src="../../assets/logo.png">
      </div>
    </div>
    <div class="buttons">
      <a href="#/admin/user" class="button"><span>Users</span></a>
      <a href="#/admin/quotation-results" class="button"><span>Quotation Results</span></a>
      <a href="#/admin/price-list" class="button"><span>Price List</span></a>
      <a href="#/admin/distributors-page" class="button"><span>Distributors</span></a>
    </div>
  </div>
</template>
 <script>
export default {
  name: 'SelectAdmin',
}
</script>
 <style scoped lang="less">
.header {
  margin-top: 30px;
  padding: 20px;
  text-align: center;

  .logo {
    background-size: cover;
    margin: 0 auto;
  }
}
 
 .buttons {
  display: flex;
  justify-content: center;
  margin-top: 150px;
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
    font-size: 20px;
    justify-content: center;
    align-items: center;
    display: flex;

    &:hover{
        background-color: #284782;
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
 
</style>