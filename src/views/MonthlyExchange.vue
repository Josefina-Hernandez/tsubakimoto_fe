<template>
    <div class="index">
      
      <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="true" />

      <div class="lower-area">
        <div class="content-container">
          
          <div class="pulldown-wrapper">
            <div class="title">Monthly Exchange</div>
            <div class="custom-dropdown" ref="dropdown">
              <div class="dropdown-selected" @click="toggleDropdown">
                {{ formatDateTime(selectedOption) }}
              </div>
              <div class="dropdown-options" v-if="isOpen">
                <div class="dropdown-option" v-for="(option, index) in options" :key="index" @click="selectOption(option, index)">
                  {{ formatDateTime(option) }}
                </div>
              </div>
            </div>
            <div class="updated-text">Updated: {{ formatDateTime(selectedOption) }}</div>       
          </div>
          <div class="table-area">
            <table>
              <thead>
                <th></th>
                <th class="flag-icon"><span class="line-flag" :style="{ backgroundImage: `url(${require('../assets/flags/jpy.png')})` }"></span><span>JPY</span></th>
                <th class="flag-icon"><span class="line-flag" :style="{ backgroundImage: `url(${require('../assets/flags/usd.png')})` }"></span><span>USD</span></th>
                <th class="flag-icon"><span class="line-flag" :style="{ backgroundImage: `url(${require('../assets/flags/eur.png')})` }"></span><span>EUR</span></th>
              </thead>
              <tbody>
                <tr v-for="line, index in filteredTableLines" :key="index">
                  <td class="currency-txt">{{ line.label }}</td>
                  <td class="rate-txt">{{ line.jpy }}</td>
                  <td class="rate-txt">{{ line.usd }}</td>
                  <td class="amount-txt">{{ line.eur }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="remark">
            <h3>Remark:</h3>
            <div> {{ this.currentRow[13] }} </div>
          </div>
        </div>
        <div class="btn-area" v-if="isShowingUpdateBtn">
          <input type="file" ref="fileInput" accept=".xlsx" @change="handleFileChange" hidden />
          <button class="update" @click="triggerSelect">Update Current Rate</button>
        </div>     
      </div>
    </div>
    <teleport to='body'>
      <div v-if="isUploading" class="modal-loading">
        <div class="spinner"></div>
        <div class="upload-msg">Uploading and processing excel file, please wait...</div>
      </div>
    </teleport>
  </template>
  
  <script>
    import { computed, nextTick } from 'vue';
    import { mapGetters, useStore } from 'vuex';
    import config from '@/config.js';
    import BannerContainer from '@/components/BannerContainer.vue'
    import axios from 'axios';
    
    export default {
      name: 'MonthlyExchange',
      data() {
        return {
          isUploading: false,

          apiUrl: config.apiUrl,
          firstLabel: 'Monthly Exchange',

          isOpen: false,
          selectedOption: '',

          isShowingUpdateBtn: true,

          inputAmount: '',
          options: [],
          // tableLines: [
          //   {value: 'USD', icon: require('../assets/flags/usd.png'), label: 'USD', rate: 1, amount: 0},
          //   {value: 'EUR', icon: require('../assets/flags/eur.png'), label: 'EUR', rate: 0.92, amount: 0},
          //   {value: 'JPY', icon: require('../assets/flags/jpy.png'), label: 'JPY', rate: 151.12, amount: 0},
          //   {value: 'CNY', icon: require('../assets/flags/cny.png'), label: 'CNY', rate: 7.23, amount: 0},
          //   {value: 'THB', icon: require('../assets/flags/thb.png'), label: 'THB', rate: 36.74, amount: 0},
          // ],
          tableLines: [
            {label: 'Bank Rate', jpy:  0.92, usd:  0.92, eur: 1},
            {label: 'Cost Rate', jpy: '', usd: '', eur: 0.92},
            {label: 'Pricelist Rate', jpy: '', usd: '', eur: 151.12},
            {label: 'Quotation Rate', jpy: '', usd: '', eur: 7.23},
          ],

          rateFileList: [],
          currentRow: [],

          isAdmin: false,

          fill: null,
          selectedFileName: '',
        };
      },
      components: {
        BannerContainer,
      },
      computed: {
        ...mapGetters(['getLoginMode']),

        loginMode() {
          return this.getLoginMode;
        },
        // formattedValue: {
        //   get() {
        //     console.log('get');
        //     console.log(this.inputAmount);
        //     return this.inputAmount;//this.formatNumber(this.inputAmount);
        //   },
        //   set(newAmount) {
        //     console.log('set');
        //     this.inputAmount = newAmount.replace(/,/g, '');
        //   }
        // }
        filteredTableLines() {
          return this.tableLines.filter((_, index) => {
            return index === 0 || (index !==0 && this.isAdmin === true);
          });
        },
      },

      async mounted() {
        document.addEventListener('click', (event) => this.handleClickOutside(event));
        if(this.loginMode === "Tsubakimoto") {
          this.isShowingUpdateBtn = true;
        } else {
          this.isShowingUpdateBtn = false;
        }

        await this.fetchRateFiles();

        this.isAdmin = this.loginMode === 'Tsubakimoto';
      },

      beforeUnmount() {
        document.removeEventListener('click', (event) => this.handleClickOutside(event));
      },

      methods: {
        formatDateTime(input) {
          const date = new Date(input);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const day = date.getDate();
          const month = date.toLocaleString('en-US', { month: 'short' });
          const year = date.getFullYear();
          return `${month} ${day}, ${year}, ${hours}:${minutes}`;
        },

        formatYearMonth(input) {
          const date = new Date(input);
          // const hours = date.getHours().toString().padStart(2, '0');
          // const minutes = date.getMinutes().toString().padStart(2, '0');
          // const day = date.getDate();
          const month = date.toLocaleString('en-US', { month: 'short' });
          const year = date.getFullYear();
          return `${month}, ${year}`;
        },

        triggerSelect() {
          this.fill = null;
          this.selectedFileName = '';
          this.$refs.fileInput.click();
        },

        handleFileChange() {
          const file = this.$refs['fileInput'].files[0];
          if (file) {
            this.file = file;
            this.selectedFileName = file.name;
            this.uploadExcel(file);
          } else {
            this.file = null;
            this.selectedFileName = '';
          }
        },

        async uploadExcel(file) {
          const formData = new FormData();
          formData.append('file', file);

          this.isUploading = true;  //开始上传

          try {
            const response = await fetch(`${this.apiUrl}/exchange_rate/upload`, {
              method: 'POST',
              body: formData
            });
            const result = await response.json();
            if (result.status && result.status === 'true' ) {
              await this.fetchRateFiles();
              this.isUploading = false;

              setTimeout(() => {
                alert('Exchange rate file has been uploaded successfully!');
              }, 100);
              
            } else {
              this.isUploading = false;

              setTimeout(() => {
                alert('File upload failed.');
              }, 100);  
            }
          } catch (err) {
            this.isUploading = false;

            setTimeout(() => {
              alert('Upload error: ' + err.message);
            }, 100);
          } finally {
            this.file = null;
            this.selectedFileName = null;
          }
        },

        updateTableLine() {
          this.tableLines[0]['jpy'] = this.currentRow[9];
          this.tableLines[0]['usd'] = this.currentRow[1];
          this.tableLines[0]['eur'] = this.currentRow[5];
          
          this.tableLines[1]['jpy'] = this.currentRow[10];
          this.tableLines[1]['usd'] = this.currentRow[2];
          this.tableLines[1]['eur'] = this.currentRow[6];

          this.tableLines[2]['jpy'] = this.currentRow[11];
          this.tableLines[2]['usd'] = this.currentRow[3];
          this.tableLines[2]['eur'] = this.currentRow[8];

          this.tableLines[3]['jpy'] = this.currentRow[12];
          this.tableLines[3]['usd'] = this.currentRow[4];
          this.tableLines[3]['eur'] = this.currentRow[7];
        },

        async fetchRateFiles() {
          this.options = [];
          try {
            const response = await axios.post(`${this.apiUrl}/exchange_rate/listall`);
            this.rateFileList = response.data;
            for (var i=0; i<this.rateFileList.length; i++) {
              this.options.push(this.rateFileList[i][16]);
            }
            this.options.reverse();
            this.selectedOption = this.options[0];
            this.rateFileList.reverse();
            this.currentRow = this.rateFileList[0];

            this.updateTableLine();
          }
          catch (error) {
            console.error('Error fetch rate list', error);
            alert('Failed to load data');
          }
        },

        backToIndex() {
          this.$router.push({path: '/index'});
        },
        toggleDropdown() {
          this.isOpen = !this.isOpen;
        },

        selectOption(option, index) {
          this.selectedOption = option;
          this.currentRow = this.rateFileList[index];

          this.updateTableLine();

          this.isOpen = false;
        },

        handleClickOutside(event) {
          if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
            this.isOpen = false;
          }
        },

        formateInput(event) {
          const input = event.target.value
          if (/^\d*\.?\d*$/.test(input)) {
            this.inputAmount = input;
          }
        },

        formatValue() {
          const parts = this.inputAmount.split('.');
          if (parts.length > 2) {
            parts.pop(); // 移除多余的小数点
          }
          let integerPart = parts[0];
          let decimalPart = parts[1] || '';

          // 去除整数部分的前导零，但保留单个0
          if (integerPart.length > 1) {
            integerPart = integerPart.replace(/^0+/, '');
          }
          if (integerPart === '') {
            integerPart = '0';
          }
          this.inputAmount = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
          this.inputAmount = this.formatNumber(this.inputAmount);
        },

        formatNumber(value) {
          if (!value) return '';
          const parts = value.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return parts.join('.');
        }

      },
    };
  </script>
  
  <style scoped lang="less">
    .index {
      width: 100%;
      //max-width: 100vw;
      margin: 0 auto;
        
      .lower-area {
        display: flex;
        .content-container {
          padding: 20px 40px 0;
          //border: 1px solid red;
          margin-left: 20px;
          margin-right: 20px;
          flex: 8;
          

          .pulldown-wrapper{
            //border: 1px solid red;
            display: flex;
            justify-content: center;
            align-items: center;

            .title{
              height: 30px;
              font-size: 20px;
              font-weight: bold;
              //border: 1px solid red;
              text-align: left;
              line-height: 30px;
            }
            
            .custom-dropdown{
              position: relative;
              margin-left: 2vw;
              flex: 2;
              
              .dropdown-selected{
                font-size: 20px;
                width: 20vw;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f0f0f0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */

                &::after {
                  content: '';
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-top: 6px solid #333;
                  margin-left: 10px;
                  display: inline-block;
                }

                &:hover {
                    background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
                    outline: none; /* 去除默认的聚焦边框 */
                    box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                }
              }

              .dropdown-options{
                font-size: 20px;
                display: block;
                position: absolute;
                top: 100%;
                left: 0;
                width: 20vw;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #fff;
                z-index: 1;

                max-height: 400px;
                overflow-y: auto;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加轮廓阴影 */
                

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

            .updated-text {
              height: 30px;
              font-size: 18px;
              text-align: right;
              line-height: 30px;
            }
          }

          .table-area{
            //border: 1px solid green;
            table{
              width: 100%;
              margin-top: 30px;
              thead{
                display: flex;
                //border: 1px solid yellow;
                th{
                  flex: 1; /* 默认值，前两个 th 使用 */
                  font-size: 19px;
                  font-weight: bold;
                }
                .flag-icon{
                  flex: 2;
                  display: flex;
                  align-items: center;
                  justify-content: space-evenly;
                  
                  .line-flag{
                    width: 90px;
                    height: 55px;
                    margin-right: 10px;
                    background-size: cover;
                    background-position: center;
                    display: inline-block;
                    background-repeat: no-repeat;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* 添加轮廓阴影 */
                  }
                }
                
              }

              tbody{
                width: 100%;
                display: block;
                //border: 1px solid black;
                tr{
                  width: 100%;
                  margin-top: 20px;
                  display: flex;
                  height: 60px;
                  
                  .currency-txt{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    justify-content: end;
                    font-size: 18px;
                  }
                  .rate-txt{
                    background-color: #53C5F4;
                    color: white;
                    margin: 0 20px;
                    flex: 2;
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    justify-content: flex-end;
                    padding-right: 20px;
                    border-radius: 5px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                  }
                  .amount-txt{
                    background-color: #53C5F4;
                    color: white;
                    flex: 2;
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    justify-content: flex-end;
                    padding-right: 20px;
                    border-radius: 5px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                  }
                }
              }
            }      
          }

          .remark {
            //width: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 7vw;
            margin-top: 20px;

            h3 {
              text-align: left;
            }

            div {
              text-align: left;
              white-space: pre-line;
            }
          }
        }

        .btn-area {
          flex: 2;
          //border: 1px solid green;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-left: 50px;
          padding-right: 50px;
          .update{
            height: 50px;
            background-color: #53C5F4;
            color: white;
            border-radius: 10px;
            border: none;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4); /* 添加轮廓阴影 */
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
              &:hover{
                background-color: #0082B3;
                transform: translate(3px, 3px);
              }
            cursor: pointer;
          }
        }
      }
    }

    .modal-loading {
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: all;

      .spinner {
        width: 60px;
        height: 60px;
        //margin-bottom: 100px;
        border: 10px solid #ffffff;
        border-top: 10px solid #53C5F4;
        border-radius: 50%;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
        animation: spin 1s linear infinite;
        box-sizing: border-box;
      }

      .upload-msg {
        margin-top: 40px;
        margin-bottom: 100px;
        font-size: 24px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
        animation: fadeBounce 2.0s cubic-bezier(0.6, 0, 0.2, 1) infinite, colorPulse 2.0s ease-in-out infinite;

      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes fadeBounce {
        0% {
          opacity: 0;
          transform: translateY(0) scale(1);
        }
        30% {
          opacity: 1;
          transform: translateY(-5px) scale(1.1);
        }
        50% {
          opacity: 1;
          transform: translateY(-5px) scale(1.1);
        }
        80% {
          opacity: 1;
          transform: translateY(-5px) scale(1.1);
        }
        100% {
          opacity: 0;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes colorPulse {
        0% { color: #eceff0; }
        50% { color: #ffffff; }
        100% { color: #eceff0; }
      }
    }
  </style>
  