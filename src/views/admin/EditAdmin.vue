<template>
    <div class="register-container">
        <BannerAdmin />
    </div>

    <div class="main">
        <h5>User Registration</h5>
        <div class="fill-area">
            <div class="name">
                <span>Name:</span>
                <input type="text" v-model="name">
            </div>
            <div class="email">
                <span>Email:</span>
                <input type="email" v-model="email">
            </div>
            <div class="password">
                <span>Password:</span>
                <input type="text" v-model="password">
            </div>
            <div class="types">
                <div class="usertype">
                    <span>User Type</span>
                    <select v-model="selectedOption">
                        <option disabled value="">Please select</option>
                        <option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</option>
                    </select>
                </div>
                <div class="accesstype">
                    <span>Access Type</span>
                    <select v-model="accessTypes" >
                        <option disabled value="">Please select</option>
                        <option v-for="option2 in options2" :value="option2.value" :key="option2.value">{{ option2.label }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div v-if="errorText" class="error-text">
        {{ errorText }}
    </div>

    <div class="footer">
        <router-link :to="'/admin/user-management'">
            <button class="back"><span>Back</span></button>
        </router-link>
        <button class="register" @click="handleClick"><span>Register</span></button>      
    </div>
</template>

<script>
import BannerAdmin from '@/components/admin/BannerAdmin.vue'
import axios from 'axios';
import config from '@/config'

export default { 
    components: {
        BannerAdmin,
    },

    data(){
        return {
            apiUrl: config.apiUrl,

            selectedOption: '',
            accessTypes: '',

            userId: 0,
            name: '',
            email: '',
            password: '',

            options: [
                { label: '选项1', value: 'option1' },
                { label: '选项2', value: 'option2' },
                { label: '选项3', value: 'option3' }
            ],

            options2: [
                { label: 'Admin1', value: 'Admin1' },
                { label: 'User1', value: 'User1' },
                { label: 'User2', value: 'User2' },
                { label: 'Distributor1', value: 'Distributor2' },
                { label: 'Distributor2', value: 'Distributor2' },
                { label: 'KET1', value: 'KET1' },
            ],

            errorText: '',
            registerResult: false,
        };
    },

    mounted(){
        this.fetchUserType();
        this.loadData();
    },

    methods: {
        fetchUserType() {
            axios.get(`${this.apiUrl}/distributors`)
            .then(response => {
                //console.log(response.data);
                //this.user_list = response.data;
                this.options = response.data.map(item => ({ label: item, value: item }));
            })
            .catch(error => {
                console.log(error);
            })
        },

        loadData(){
            //const userId = this.$route.params.userId;
            const userData = this.$route.query;

            console.log(userData);

            this.userId = userData.id;
            this.name = userData.name;
            this.email = userData.email;
            this.password = userData.password;
            this.selectedOption = userData.user_type;
            this.accessTypes = userData.access_type;
        },

        handleClick(){
            if (!this.isValidForm()) {
                return;
            }

        // 继续发送请求...

            axios.post(`${this.apiUrl}/edituser`,
                {   
                    userId: this.userId,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    selectedOption: this.selectedOption,
                    accessTypes: this.accessTypes,
                }
            )
            .then(response => {
                this.registerResult = response.data;
                if(this.registerResult.message){
                    this.$router.push('/admin/user');
                }
                console.log(this.registerResult);
            })
            .catch(error => {
                console.log(error);
            });
        },

        isValidForm() {
            if (!this.name) {
                this.errorText = 'Please input the name.';
                return false;
            }

            if (!this.email) {
                this.errorText = 'Please input the email.';
                return false;
            }
        
            if (!this.selectedOption) {
                this.errorText = 'Please select a user type.';
                return false;
            }

            if (!this.accessTypes) {
                this.errorText = 'Please select an access type.';
                return false;
            }


            this.errorText = ''; // 如果所有验证通过，清空错误文本
            return true;
        },
    }

};
</script>

<style scoped lang="less">
    .main{
        margin-top: 10vh;
        h5{
            font-size: 25px;
        }
        .fill-area{
            margin-left: 50px;
            margin-right: 50px;
            .name{
                display: flex;
                justify-content: center;
                align-items: center;
                span{
                    margin-left: 0;
                    font-size: 19px;
                }
                input{
                    width: 440px;
                    height: 40px;
                    margin-left: 40px;
                    font-size: 19px;
                }
            }

            .email{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;

                span{
                    margin-left: 0;
                    font-size: 19px;
                }
                input{
                    width: 440px;
                    height: 40px;
                    margin-left: 40px;
                    font-size: 19px;
                }
            }

            .password{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;

                span{
                    margin-left: 0;
                    font-size: 19px;
                }
                input{
                    width: 440px;
                    height: 40px;
                    margin-left: 5px;
                    font-size: 19px;
                }
            }
            .types{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
                .usertype{
                    

                    span{
                        margin-left: 0;
                        font-size: 19px;
                    }

                    select{
                        width: 150px;
                        height: 40px;
                        margin-left: 5px;
                        font-size: 17px;
                    }
                }
                .accesstype{
                    margin-left: 30px;
                    span{
                        margin-left: 0;
                        font-size: 19px;
                    }
                    select{
                        width: 150px;
                        height: 40px;
                        margin-left: 5px;
                        font-size: 17px;
                    }
                }
            }
        }
    }

    .error-text{
        color: red;
        margin-top: 15px;
        float: left;
        margin-left: 28vw;
        font-size: 15px;
        font-weight: bold;
    }
    .footer{
            position: relative;
            //bottom: 30px;
            //bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            //margin-top: 50px;
            margin-top: 50px;
            
            
            .back, .register{
                background-color: #4472C4;
                width: 130px;
                height: 35px;
                border: none;
                margin: 0 200px 50px;
                border-radius: 5px;
                color: white;
                font-size: 20px;
                cursor: pointer;

                span {
                    position: relative; 
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease;
                }

                &:hover{
                    background-color: #2C4D89;
                }

                &:hover span {
                    top: 2px; 
                    left: 2px; 
                }
            }
            .register{
                width: 200px;

                &:disabled{
                    pointer-events: none;
                    background-color: #BFBFBF;
                    user-select: none;
                    
                    &:hover{
                        pointer-events: none;
                        background-color: #BFBFBF;
                        opacity: 0.5
                    }
                }
            }

        
        }
</style>
