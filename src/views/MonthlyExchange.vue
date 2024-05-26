<template>
    <div class="index">
      
      <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="true" />

      <div class="lower-area">
        <div class="content-container">
          <div class="title">Calculation</div>
          <div class="calculator">
            <input type="text" 
              v-model="formattedValue" 
              @input="formateInput" 
              @blur="formatValue" 
              onkeyup="this.value=this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
              placeholder="Enter amount"
            >
            <div class="custom-dropdown" ref="dropdown">
              <div class="dropdown-selected" @click="toggleDropdown">
                {{ selectedLabel }}
                <span class="selected-flag" :style="{ backgroundImage: `url(${selectedIcon})`}"></span>
              </div>
              <div class="dropdown-options" v-if="isOpen">
                <div class="dropdown-option" v-for="option in options" :key="option.value" @click="selectOption(option)">
                  {{ option.label }}
                  <span class="option-flag" :style="{ backgroundImage: `url(${option.icon})`}"></span>
                </div>
              </div>
            </div>
            <button class="btn-cal">Calculate</button>
          </div>
          <div class="table-area">
            <table>
              <thead>
                <th></th>
                <th></th>
                <th>Current Rate</th>
                <th>Result Amount</th>
              </thead>
              <tbody>
                <tr v-for="line in tableLines" :key="line.value">
                  <td class="flag-icon"><span class="line-flag" :style="{ backgroundImage: `url(${line.icon})` }"></span></td>
                  <td class="currency-txt">{{ line.label }}</td>
                  <td class="rate-txt">{{ line.rate }}</td>
                  <td class="amount-txt">{{ line.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="btn-area">
          <button class="update">Update Current Rate</button>
        </div>     
      </div>
    </div>
  </template>
  
  <script>
    import BannerContainer from '@/components/BannerContainer.vue'
    export default {
      name: 'MonthlyExchange',
      data() {
        return {
          firstLabel: 'Monthly Exchange',

          isOpen: false,
          selectedCurrency: 'USD',
          selectedLabel: 'USD',
          selectedIcon: require('../assets/flags/usd.png'),

          inputAmount: '',
          options: [
            {value: 'USD', label: 'USD', icon: require('../assets/flags/usd.png')},
            {value: 'EUR', label: 'EUR', icon: require('../assets/flags/eur.png')},
            {value: 'JPY', label: 'JPY', icon: require('../assets/flags/jpy.png')},
            {value: 'CNY', label: 'CNY', icon: require('../assets/flags/cny.png')},
            {value: 'THB', label: 'THB', icon: require('../assets/flags/thb.png')},
          ],
          tableLines: [
            {value: 'USD', icon: require('../assets/flags/usd.png'), label: 'USD', rate: 1, amount: 0},
            {value: 'EUR', icon: require('../assets/flags/eur.png'), label: 'EUR', rate: 0.92, amount: 0},
            {value: 'JPY', icon: require('../assets/flags/jpy.png'), label: 'JPY', rate: 151.12, amount: 0},
            {value: 'CNY', icon: require('../assets/flags/cny.png'), label: 'CNY', rate: 7.23, amount: 0},
            {value: 'THB', icon: require('../assets/flags/thb.png'), label: 'THB', rate: 36.74, amount: 0},
          ],
        };
      },
      components: {
        BannerContainer,
      },
      computed: {
        formattedValue: {
          get() {
            console.log('get');
            console.log(this.inputAmount);
            return this.inputAmount;//this.formatNumber(this.inputAmount);
          },
          set(newAmount) {
            console.log('set');
            this.inputAmount = newAmount.replace(/,/g, '');
          }
        }
      },

      methods: {
        backToIndex() {
          this.$router.push({path: '/index'});
        },
        toggleDropdown() {
          this.isOpen = !this.isOpen;
        },

        selectOption(option) {
          this.selectedCurrency = option.value;
          this.selectedLabel = option.label;
          this.selectedIcon = option.icon;
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

      mounted() {
        document.addEventListener('click', (event) => this.handleClickOutside(event));
      },

      beforeUnmount() {
        document.removeEventListener('click', (event) => this.handleClickOutside(event));
      },
    };
  </script>
  
  <style scoped lang="less">
    .index {
      max-width: 100vw;
      margin: 0 auto;
        
      .lower-area {
        display: flex;
        .content-container {
          padding: 40px;
          //border: 1px solid red;
          margin-left: 100px;
          flex: 8;
          .title{
            height: 50px;
            font-size: 22px;
            font-weight: bold;
            //border: 1px solid red;
            text-align: left;
          }

          .calculator{
            //border: 1px solid red;
            display: flex;
            justify-content: center;
            input{
              flex: 3;
              font-size: 20px;
              text-align: right;
              color: #525252;
              padding-right: 20px;
              border-radius: 5px;
              border: 1px solid #ccc;
              cursor: pointer;
              &:hover{
                background-color: #f0f0f0;
              }
            }
            .custom-dropdown{
              position: relative;
              margin-left: 5px;
              flex: 2;
              .dropdown-selected{
                font-size: 20px;
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f0f0f0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .selected-flag{
                  width: 50px;
                  height: 30px;
                  background-size: cover;
                  background-position: center;
                  display: inline-block;
                  margin-right: 10px;
                  background-repeat: no-repeat;
                }
              }

              .dropdown-options{
                font-size: 20px;
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
                  .option-flag{
                    width: 50px;
                    height: 30px;
                    margin-right: 10px;
                    background-size: cover;
                    background-position: center;
                    display: inline-block;
                    background-repeat: no-repeat;
                  }
                }
              }
            }

            .btn-cal{
              flex: 1;
              cursor: pointer;
              background-color: #53C5F4;
              color: white;
              font-size: 20px;
              font-weight: bold;
              margin-left: 10px;
              border: none;
              border-radius: 5px;
              transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
              &:hover{
                background-color: #48a6ce;
                transform: translate(-3px, -3px);
              }
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

                  &:nth-of-type(3),
                  &:nth-of-type(4) {
                    flex: 3; /* 后两个 th 使用 */
                    font-size: 20px;
                    font-weight: bold;
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
                  .flag-icon{
                    flex: 1;
                    .line-flag{
                      width: 90px;
                      height: 55px;
                      margin-right: 10px;
                      background-size: cover;
                      background-position: center;
                      display: inline-block;
                      background-repeat: no-repeat;
                    }
                  }
                  .currency-txt{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    justify-content: center;
                  }
                  .rate-txt{
                    background-color: #53C5F4;
                    color: white;
                    margin: 0 20px;
                    flex: 3;
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    justify-content: flex-end;
                    padding-right: 20px;
                    border-radius: 5px;
                  }
                  .amount-txt{
                    background-color: #53C5F4;
                    color: white;
                    flex: 3;
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    justify-content: flex-end;
                    padding-right: 20px;
                    border-radius: 5px;
                  }
                }
              }
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
            height: 100px;
            background-color: #53C5F4;
            color: white;
            border-radius: 10px;
            border: none;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 13%;
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
              &:hover{
                background-color: #48a6ce;
                transform: translate(-3px, -3px);
              }
            cursor: pointer;
          }
        }
      }
    }
  </style>
  