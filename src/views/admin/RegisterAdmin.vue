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
            <div class="accesstype">
                <span>Access Type:</span>
                <select v-model="accessType" >
                    <option disabled value="">Please select</option>
                    <option v-for="option2 in options2" :value="option2.value" :key="option2.value">{{ option2.label }}</option>
                </select>
            </div>
            <div class="usertype">
                <span>Company Type:</span>
                <select v-model="selectedOption">
                    <option disabled value="">Please select</option>
                    <option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</option>
                </select>
            </div>
            <div v-if="errorText" class="error-text">
                {{ errorText }}
            </div>
            <div v-else class="error-text"></div>
        </div>
    </div>

    <div class="footer">
        <router-link :to="'/admin/user'">
            <button class="back"><span>Back</span></button>
        </router-link>
        <button class="register" @click="handleClick"><span>Register</span></button>      
    </div>

    <div class="modal-mask" v-if="showModal">
        <div class="modal-wrapper">
        <div class="modal-container">
            <div class="modal-body">
                <div class="instruct"><b>Note:</b> Only assign administrator privileges to trusted users.</div>
                <label class="modal-checkbox">
                    <input type="checkbox" v-model="isModalChecked" />
                    <span class="checkmark"></span>
                    <span class="check-text">Click below if you are sure you want to grant administrator privileges!</span>
                </label>
            </div>
            <div class="modal-footer">

                <button class="modal-btn-grant" :disabled="modalButtonDisabled" @click.prevent="submitForm()">Grant Administrator Privileges</button>

                <button class="modal-btn-cancel" @click="showModalBack">Cancel</button>          
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import BannerAdmin from '@/components/admin/BannerAdmin.vue';
import axios from 'axios';
import config from '@/config';
import qs from 'qs';

export default { 
    components: {
        BannerAdmin,
    },

    data(){
        return {
            apiUrl: config.apiUrl,

            selectedOption: '',
            accessType: 'user',

            name: '',
            email: '',
            password: '',

            options: [
                { label: 'TTCL (User)', value: 'ttcl_user' },
                { label: 'NICHIDEN TRADING', value: 'nichiden' },
                { label: 'TSUBACO KTE (BKK)', value: 'kte_bkk' },
                { label: 'TSUBACO KTE (SRIRACHA)', value: 'kte_sri' },
                { label: 'KTE CORPORATION', value: 'kte_corp' },
                { label: 'HRD', value: 'hrd' },
                { label: 'PLANET T AND S', value: 'planet' },
            ],

            options2: [
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
            ],

            errorText: '',
            registerResult: false,

            showModal: false,
            isModalChecked: false,
            modalButtonDisabled: true,
        };
    },

    watch: {
        isModalChecked(newVal, oldVal) {
            if (newVal === true) {
                this.modalButtonDisabled = false;
            } else {
                this.modalButtonDisabled = true;
            }
        },

        accessType(newVal, oldVal) {
            if (newVal === 'user') {
                this.options = [
                    { label: 'TTCL (User)', value: 'ttcl_user' },
                    { label: 'NICHIDEN TRADING', value: 'nichiden' },
                    { label: 'TSUBACO KTE (BKK)', value: 'kte_bkk' },
                    { label: 'TSUBACO KTE (SRIRACHA)', value: 'kte_sri' },
                    { label: 'KTE CORPORATION', value: 'kte_corp' },
                    { label: 'HRD', value: 'hrd' },
                    { label: 'PLANET T AND S', value: 'planet' },
                ];
                this.selectedOption = '';
            } else if (newVal === 'admin') {
                this.options = [
                    { label: 'TTCL (Admin)', value: 'ttcl_admin' },
                ];
                this.selectedOption = 'ttcl_admin';
            }
        },
    },

    mounted(){
        // this.fetchUserType();
    },

    methods: {
        // fetchUserType() {
        //     axios.get(`${this.apiUrl}/distributors`)
        //     .then(response => {
        //         console.log(response.data);
        //         //this.user_list = response.data;
        //         this.options = response.data.map(item => ({ label: item, value: item }));
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
        // },

        showModalBack() {
            this.isModalChecked = false;
            this.showModal = false;
        },

        submitForm() {
            // 继续发送请求...
            axios.post(`${this.apiUrl}/user/add`,
                qs.stringify(
                    {
                        name: this.name,
                        usr: this.email,
                        pwd: this.password,
                        access: this.accessType,
                        company: this.selectedOption,
                    }
                ),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                
            )
            .then(response => {
                this.registerResult = response.data;
                if(this.registerResult.status === "true"){
                    this.$router.push('/admin/user');
                }
                //console.log(this.registerResult);
            })
            .catch(error => {
                console.log(error);
            });
        },

        handleClick(){
            if (!this.isValidForm()) {
                return;
            }

            if(this.accessType === 'admin') {
                this.showModal = true;
            } else {
                this.submitForm();
            }     
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

            // ⭐ 新增：TTCL Admin / User 必须用 @tsubakimoto.co.th
            const ttclTypes = ['ttcl_admin', 'ttcl_user'];
            if (ttclTypes.includes(this.selectedOption)) {
                const emailLower = this.email.trim().toLowerCase();
                if (!emailLower.endsWith('@tsubakimoto.co.th')) {
                    this.errorText = 'For TTCL users, email must end with @tsubakimoto.co.th!';
                    return false;
                }
            }
        
            if (!this.selectedOption) {
                this.errorText = 'Please select a company type.';
                return false;
            }

            if (!this.accessType) {
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
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            width:38vw;
            .name{
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
                span{
                    text-align: left;
                    margin-left: 0;
                    font-size: 19px;
                    flex: 1;
                }
                input{
                    height: 40px;
                    font-size: 19px;
                    flex: 3;
                    padding: 0 10px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                    }
                }
            }

            .email{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                width: 100%;
                span{
                    text-align: left;
                    margin-left: 0;
                    font-size: 19px;
                    flex: 1;
                }
                input{
                    height: 40px;
                    font-size: 19px;
                    flex: 3;
                    padding: 0 10px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                    }
                }
            }

            .password{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                width: 100%;

                span{
                    text-align: left;
                    margin-left: 0;
                    font-size: 19px;
                    flex: 1;
                }
                input{
                    height: 40px;
                    font-size: 19px;
                    flex: 3;
                    padding: 0 10px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                    }
                }
            }

            .usertype{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                width: 100%;
                span{
                    margin-left: 0;
                    font-size: 19px;
                    text-align: left;
                    white-space: nowrap;
                    flex: 1;
                }

                select{
                    height: 40px;
                    //margin-left: 14px;
                    font-size: 17px;
                    flex: 3;
                    padding: 0 10px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                    }
                }
            }
            .accesstype{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                width: 100%;
                span{
                    margin-left: 0;
                    font-size: 19px;
                    text-align: left;
                    white-space: nowrap;
                    flex: 1;
                }
                select{
                    height: 40px;
                    font-size: 17px;
                    flex: 3;
                    padding: 0 10px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                    }
                }
            }

            .error-text{
                color: red;
                margin-top: 25px;
                text-align: left;
                width: 100%;
                height: 50px;
                font-size: 15px;
                font-weight: bold;
            }
        }
    }

    
    .footer{
        //position: absolute;
        //bottom: 30px;
        //bottom: 10px;
        width: 38vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        //top: 700px;
        
        
        .back, .register{
            background-color: #4472C4;
            width: 180px;
            height: 35px;
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 17px;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

            span {
                position: relative; 
                top: 0;
                left: 0;
                transition: top 0.2s ease, left 0.2s ease;
            }

            &:hover{
                background-color: #284782;
                transform: translate(3px, 3px);
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

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
        .modal-wrapper {
            display: table-cell;
            vertical-align: middle;

            .modal-container {
                width: 800px;
                margin: 0px auto;
                padding: 20px 30px;
                background-color: #fff;
                border-radius: 2px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
                transition: all .3s ease;
                font-family: Helvetica, Arial, sans-serif;
                border-radius: 20px;

                .modal-body {
                    margin: 20px 30px 0 30px;
                    display: flex;
                    flex-direction: column;
                    .instruct {
                        font-size: 18px;
                        text-align: left;
                        justify-content: start;
                        margin-left: 5px;
                    }

                    .modal-checkbox {
                        display: inline-flex;
                        align-items: center;
                        
                        cursor: pointer;
                        user-select: none;
                        margin-top: 20px;
                        font-size: 18px;
                        font-weight: bold;
                        justify-content: start;

                        input[type="checkbox"] {
                            appearance: none;
                            //-webkit-appearance: none;
                            width: 25px;
                            height: 25px;
                            border: 2px solid #ccc;
                            border-radius: 4px;
                            margin-right: 8px;
                            position: relative;
                            transition: all 0.2s ease;
                            cursor: pointer;

                            &::after {
                                content: "✔";
                                color: white;
                                font-size: 14px;
                                position: absolute;
                                top: 1px;
                                left: 5px;
                                opacity: 0;
                                transition: opacity 0.2s ease;
                                pointer-events: none;
                            }

                            &:checked {
                                background-color: #02B302;
                                border-color: #02B302;

                                &::after {
                                    opacity: 1;
                                }
                            }
                        }

                        .check-text {
                            color:red;
                        }
                    }

                }

                .modal-footer{
                    margin-top: 20px;
                    margin-bottom: 20px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    align-items: center;
                    width: 100%;
                    
                    .modal-btn-grant {
                        width: 350px;
                        height: 45px;
                        background: #4472C4;
                        border-radius: 3px;
                        font-size: 17px;
                        color: white;
                        border: none;
                        cursor: pointer;
                        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                        transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                        
                        &:hover {
                            background: #284782;
                            transform: translate(3px, 3px);
                        }

                        &:disabled {
                            pointer-events: none;
                            background-color: #BFBFBF;
                            user-select: none;
                        }
                    }
                    .modal-btn-cancel {
                        margin-top: 15px;
                        width: 350px;
                        height: 45px;
                        background: white;
                        border-radius: 3px;
                        font-size: 17px;
                        color: #4472C4;
                        border: 1px solid #4472C4;
                        cursor: pointer;
                        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
                        transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                        //cursor: not-allowed;

                        &:hover {
                            background: #eceaea;
                            transform: translate(3px, 3px);
                        }
                    }
                }

            }
        } 

    }
</style>
