<template>
    <div class="outer-container">
        <div class="login-container">
            <img alt="Vue logo" src="../../assets/logo.png">
            <h4>Admin login</h4>
            <form @submit.prevent="login">
                <input type="text" v-model="username" placeholder="Username">
                <input type="password" v-model="password" placeholder="Password">
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                <button type="submit"><span>Log In</span></button>
            </form>  
        </div>
    </div>
    
</template>

<style scoped lang="less">

    .outer-container{
        position: absolute;
        top: 43%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40vw;
        //height: 67vh;
        border: 10px solid #00AAEE;
        padding: 10px; /* 矩形边框的内边距 */
        box-sizing: border-box; /* 盒模型的边框盒 */
    }
    .login-container {
        position: relative;
        margin:15px 15px 15px 15px;
        border: 10px solid #00AAEE; /* 添加蓝色边框 */
        padding: 10px; /* 矩形边框的内边距 */
        box-sizing: border-box; /* 盒模型的边框盒 */
        img{
            padding: 30px;
        }
        h4{
            color: #00AAEE;
            font-size: 21px;
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
                margin-bottom: 50px;
                padding: 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4);

                &:hover{
                    background-color: #0082B3;
                }

                span {
                    font-size: 15px;
                    position: relative;
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease;
                }

                &:hover span {
                    top: 2px;
                    left: 2px;
                }
            }
        }
    }
</style>


<script>
import axios from 'axios';
import config from '@/config';

export default {
        name: 'LoginForm',
        data(){
            return{
                username: '',
                password: '',
                errorMessage: null,

                apiUrl: config.apiUrl,
            }
        },
        methods: {
            // login(){
            //     //登录逻辑
            //     if(this.username === "admin" & this.password === "admin"){
            //         this.$router.push('/admin/select');
            //     }
            //     else{
            //         this.errorMessage = 'Invalid username or password!';
            //     }
            // }
            async login () {
                try {
                    const response = await axios.post(this.apiUrl + '/user-login', {
                        username: this.username,
                        password: this.password,
                    });

                    this.$store.dispatch('updateToken', response.data.token);
                    this.$store.dispatch('updateUserName', response.data.user_name); //更新用户
                    this.$router.push('/admin/select');
                } catch (error) {
                    this.errorMessage = 'Invalid username or password!';
                }
            }
        }
    }   
</script>