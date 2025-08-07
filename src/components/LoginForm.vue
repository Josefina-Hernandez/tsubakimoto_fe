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
              <label for="">(Select for frontend test only!)</label>
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
        height: 520px;
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
                    top: 40%;
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
                box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4);

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
                    {value: 'kte_bangkok', label: 'KTE Bangkok'},
                    {value: 'kte_pattaya', label: 'KTE Pattaya'},
                    {value: 'kte_corporation', label: 'KTE Corporation'},
                    {value: 'nichiden', label: 'NICHIDEN'},
                    {value: 'hrd', label: 'HRD'},
                    {value: 'planet', label: 'PLANET'},
                ]
            }
        },

        computed: {
            ...mapState(['loginMode']),
            payload () {
                let companyName = '';
                let companyAddress = '';
                let paymentTerms = '';

                if (this.selectedValue === 'tsubakimoto') {
                    companyName = 'Tsubakimoto (Thailand) Co., Ltd.';
                    companyAddress = "388 Exchange Tower, 19th Floor Unit 1902,\nSukumvit Road, Klongtoey, Bangkok 10110,\nThailand\nTEL: +66(2)262-0667/8/9 FAX: +66(2)262-0670";
                    paymentTerms = '30 days Aft Mth End Close';
                } else if (this.selectedValue === 'kte_bangkok') {
                    companyName = 'TSUBAKO KTE CO., LTD. (Bangkok)';
                    companyAddress = "952 RAMALAND BLDG., 17TH FLOOR, RAMA\nIV ROAD SURIYAWONG, BANGRAK\nBANGKOK 10500\nTHAILAND";
                    paymentTerms = '30 days Aft Mth End Close';
                } else if (this.selectedValue === 'kte_pattaya') {
                    companyName = 'TSUBACO KTE CO., LTD. (Pattaya)';
                    companyAddress = "4/222 HARBOR MALL OFFICE, ROOM 5B-01\nMOO 10 SUKHUMVIT RD.TUNGSUKLA,\nSRIRACHA,\nCHONBURI 20230\nTHAILAND";
                    paymentTerms = '30 days Aft Mth End Close';
                } else if (this.selectedValue === 'kte_corporation') {
                    companyName = 'KTE CORPORATION CO., LTD.';
                    companyAddress = "6 SUKHAPIBAN 2 SOI 11 YAEK 2-1, PRAWET,\nBANGKOK 10250\nTHAILAND";
                    paymentTerms = '60 days Aft Mth End Close';
                } else if (this.selectedValue === 'nichiden') {
                    companyName = 'NICHIDEN TRADING (THAILAND) CO., LTD.';
                    companyAddress = "159/18 SERM-MIT TOWER, 11TH FL. UNIT 1103\nSUKHUMVIT 21 (ASOKE) RD., KLONGTOEY NUA,\nWATTANA,\nBANGKOK 10110\nTHAILAND";
                    paymentTerms = '30 days Aft Mth End Close';
                } else if (this.selectedValue === 'hrd') {
                    companyName = 'HRD (THAILAND) CO., LTD.';
                    companyAddress = "BANGNA TOWERS-A, 2ND. FL., 2/3 MOO 14\nBANGNA-TRAD RD., K.M.6.5, BANGKAEW,\nBANGPLEE\nSAMUTPRAKARN 10540\nTHAILAND";
                    paymentTerms = '30 days Aft Mth End Close';
                } else if (this.selectedValue === 'planet') {
                    companyName = 'PLANET T AND S CO., LTD.';
                    companyAddress = "28 KRUNGTHEP KRITHA 20 YAEK 3,\nTHAPCHANG, SAPANSUNG,\nBANGKOK 10250\nTHAILAND";
                    paymentTerms = '30 days Aft Mth End Close';
                } else {
                    companyName = '';
                    companyAddress = '';
                    paymentTerms = '';
                }
                return {
                    mode: this.selectedLabel,
                    companyName,
                    companyAddress,
                    paymentTerms,
                };
            }
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
                        this.updateLoginMode(this.payload);
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

