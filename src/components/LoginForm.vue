<template>
    <div class="login-container">
        <img alt="Vue logo" src="../assets/logo.png">
        <h4>Please login...</h4>
        <form @submit.prevent="login">
            <input type="text" v-model="username" placeholder="Username">
            <input type="password" v-model="password" placeholder="Password">
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <button type="submit"><span>Log In</span></button>
        </form>  
    </div>
</template>

<style scoped lang="less">
    .login-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50vw;
        height: 60vh;
        border: 1px solid gray;
        img{
            padding: 30px;
        }
        h4{
            color: #393939;
        }

        form{
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            input {
                margin-bottom: 20px;
                width: 250px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                
                &:last-child {
                margin-bottom: 30px;
                }
            }

            .error-message{
                color: red;
            }
            
            button {
                width: 200px;
                background-color:#00ADEF;
                color: white;
                margin-top: 25px;
                padding: 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;

                &:hover{
                    background-color: #0082B3; /* 鼠标悬停时改变背景色 */
                }

                span {
                    font-size: 15px;
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
    }
</style>

<script>
export default {
        name: 'LoginForm',
        data(){
            return{
                username: '',
                password: '',
                errorMessage: null
            }
        },
        methods: {
            login(){
                //登录逻辑
                if(this.username === "admin" & this.password === "admin"){
                    this.$router.push('/index');
                }
                else{
                    this.errorMessage = 'Invalid username or password!';
                }
            }
        }
    }   
</script>

