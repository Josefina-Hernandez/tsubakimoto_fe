<template>
    <div class="login-container">
        <img alt="Vue logo" src="../assets/logo.png">
        <h4>Please login...</h4>
        <form @submit.prevent="login">
            <input type="text" v-model="username" placeholder="Username">
            <input type="password" v-model="password" placeholder="Password">

            <div class="custom-dropdown" ref="dropdown" v-click-outside="handleClickOutside">
              <div class="dropdown-selected" @click="toggleDropdown">
                {{ selectedLabel }}
              </div>
              <div class="dropdown-options" v-if="isOpen">
                <div class="dropdown-option" v-for="option in options" :key="option.value" @click="selectOption(option)">
                  {{ option.label }}
                </div>
              </div>
            </div>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="typeMessage" class="error-message">{{ typeMessage }}</p>
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
            margin-top: 30px;
        }

        form{
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            input {
                font-size: 16px;
                margin-bottom: 20px;
                width: 250px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                
                &:last-child {
                margin-bottom: 30px;
                }
            }
            .custom-dropdown{
              position: relative;
              margin-left: 0;
              width: 250px;
              flex: 2;
              .dropdown-selected{
                font-size: 16px;
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: rgb(232, 240, 254);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;

                        /* Add the triangle using ::after */
                &::after {
                    content: '';
                    position: absolute;
                    right: -15px; /* Adjust the distance from the right */
                    top: 60%;
                    transform: translateY(-50%);
                    border-width: 7px;
                    border-style: solid;
                    border-color: #00ADEF transparent transparent transparent;
                }
              }

              .dropdown-options{
                font-size: 16px;
                display: block;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #fff;
                z-index: 1000;

                .dropdown-option{
                  padding: 10px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  &:hover{
                    background-color: #f0f0f0;
                  }
                }
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
import { mapState, mapActions } from 'vuex';

export default {
        name: 'LoginForm',
        data(){
            return{
                username: '',
                password: '',
                errorMessage: null,
                typeMessage: null,
                isOpen: false,
                selectedLabel: '-Please select the access type-',
                selectedValue: 'default',
                options: [
                    {value: 'default', label: '-Please select the access type-'},
                    {value: 'tsubakimoto', label: 'Tsubakimoto'},
                    {value: 'kte', label: 'KTE'},
                    {value: 'agency', label: 'Agency'},
                ]
            }
        },

        computed: {
            ...mapState(['loginMode']),
        },

        methods: {
            ...mapActions(['updateLoginMode']),

            handleClickOutside() {
            // 这里写点击 div 外部时触发的逻辑
                //console.log('Clicked outside:', event);
                this.isOpen = false;
            },

            toggleDropdown() {
                this.isOpen = !this.isOpen;
            },

            selectOption(option) {
                this.selectedLabel = option.label;
                this.selectedValue = option.value;
                this.isOpen = false;
            },

            login(){
                //登录逻辑
                if(this.username === "admin" & this.password === "admin"){
                    if(this.selectedValue === "default") {
                        this.typeMessage = 'Please select the access type first!';
                    }else{
                        this.updateLoginMode(this.selectedLabel);
                        this.$router.push('/index');
                    }       
                }
                else{
                    this.errorMessage = 'Invalid username or password!';
                }
            }
        }
    }   
</script>

