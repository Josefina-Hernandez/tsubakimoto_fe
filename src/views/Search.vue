<template>
    <div class="selection">
        <LogoBanner :title="title" :welcome="welcome" />

        <div class="mainNav">
            <div class="dropdown" @mouseleave="hideDropdown1">
                <div class="title">Distributors</div>
                <div class="custom-select">
                    <div class="selected" @click="toggleDropdown1">{{ selectedItem1 ? selectedItem1 : '--' }}</div>
                    <div class="dropdown-list" v-show="dropdownOpen1">
                        <div class="dropdown-item" v-for="(item, index) in items1" :key="index" @click="selectItem1(item)">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="dropdown" @mouseleave="hideDropdown2">
                <div class="title">Product Line</div>
                <div class="custom-select">
                    <div class="selected" @click="toggleDropdown2">{{ selectedItem2 ? selectedItem2 : '--' }}</div>
                    <div class="dropdown-list" v-show="dropdownOpen2">
                    <div class="dropdown-item" v-for="(item, index) in items2" :key="index" @click="selectItem2(item)">
                        {{ item }}
                    </div>
                    </div>
                </div>
            </div>
            <div class="search">
                <div class="upper">
                  <span>Search</span>
                  <input v-model="searchText" type="text" placeholder="ITEM Code">
                  <button @click="searchPrice"><span>Search</span></button>
                </div>
                <div class="warning" v-show="showWarning">
                  <span>Please select all the filters or input the item code!</span>
                </div>
            </div> 
        </div>

        <div class="table-container">
          <table>
            <thead class="sticky-header">
              <tr>
                <th>Select</th>
                <th>Item</th>
                <th>Unit</th>
                <th>Currency</th>
                <th>Price</th>
                <th>Multi</th>
                <th>TTCL Selling</th>
                <th>Delivery Info</th>
                <th>Remarks</th>
                <th>Details</th>
                <th>Product Info</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
                <td>
                  <input class="checker" type="checkbox" name="fruit" value="orange" v-model="item.checked" @change="handleSelect(item)">
                </td>
                <td>{{ item.item }}</td>
                <td :class="{blue: item.unit === 'L'}" @click="item.unit === 'L' ? lButtonClick(item) : null">{{ item.unit }}</td>
                <td>{{ item.currency }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.multi }}</td>
                <td>{{ item.ttcl_selling }}</td>
                <td>{{ item.delivery_info }}</td>
                <td>{{ item.remarks }}</td>
                <td>{{ item.details }}</td>
                <td>{{ item.product_info }}</td>
              </tr>
            </tbody>
          </table>  
        </div>
        <div class="empty-warning" v-show="ifShowEmpty">Sorry, we couldn't find any products that match your search criteria.</div>

        <div class="modal-mask" v-if="showModal">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label class="title" for="name">NAME:</label>
                    <input type="text" name="name" id="name" class="textbox" v-model="personName">
                  </div>
                  <div class="form-group">
                    <label class="title" for="cname">Customer Name:</label>
                    <input type="text" name="cname" id="cname" class="textbox" v-model="companyName">
                  </div>
                  <div class="form-group">
                    <label class="title" for="qty">Quantity:</label>
                    <input type="text" name="qty" id="qty" v-model.number="orderQty" @input="inputOrderQty" class="textbox" :readonly="isReadOnly">
                    <label class="unit">{{ qtyUnit }}</label>
                    <div class="radios1-container" v-show="showRadios">
                      <div class="radio1-option">
                        <input type="radio" value="option1" name="radio1-option1" v-model="selectedOption">
                        <label for="radio1-option1">&nbsp;Long Length</label>                      
                      </div>
                      <div class="radio1-option">
                        <input type="radio" value="option2" name="radio1-option2" v-model="selectedOption">
                        <label for="radio1-option2">&nbsp;End Link Assembly</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group special-css">
                    <label class="title" for="pcode">Product Code:</label>
                    <label class="unit">NEW CODE: {{this.newCodeShow}}<br><br>OLD CODE: {{this.oldCodeShow}}</label>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="modal-default-button1" @click="showModalBack">back</button>
                <div @click.prevent="openQuotationPage">
                  <button class="modal-default-button2" :disabled="modalButtonDisabled">Received Quotation</button>
                </div>               
              </div>
            </div>
          </div>
        </div>

        <div class="modal-mask2" v-if="showModal2">
          <div class="modal-wrapper2">
            <div class="modal-container2">
              <div class="modal-body2">
                <div class="title">Links Information</div>
                <div class="name-qty">
                  <div class="name">{{newCode}}</div>
                  <div class="qty">Quantity: <input type="text" name="lsk" class="lsk-input" v-model.number="lskQty" @input="inputQty"> {{qtyUnit}}</div>
                </div>
                <div class="details">
                  <div class="detail-left">
                    <div>NEW CODE: {{newCode + NewCodeAdd}}</div>
                    <div>OLD CODE: {{oldCode + oldCodeAdd}}</div>
                    <div v-show="isEven">PRICE: {{L_Price}} THB / PC </div>
                    <div v-show="!isEven">PRICE: <span style="color: red;">Please Contact Tsubaki Staff.</span></div>
                  </div>
                  <div class="detail-right">
                    <div class="radio-text">Additional Requests:</div>
                    <div class="radios">
                      <div>
                        <input type="radio" value="option1" v-model="selectedOption">
                        <span>&nbsp;Long Length</span>                      
                      </div>
                      <div>
                        <input type="radio" value="option2" v-model="selectedOption">
                        <span>&nbsp;End Link Assembly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr class="hr" />

              <div class="modal-footer2">
                <button class="modal2-default-button1" @click="showModal2 = false" v-show="showBtnBackQuotation">back</button>
                <div @click.prevent="toLinksInfo" v-show="showBtnBackQuotation">
                  <button class="modal2-default-button2" v-show="isEven">Get Quotation</button>
                </div>
           
                <button class="modal2-default-button3" @click="showModal2 = false">Done</button>
                              
              </div>
            </div>
          </div>
        </div>

      
        <FooterBtn class="footer" :ifShow2="ifShow2" :toWhere="previousPage" :clickFunction="handleClick" :isButtonDisabled="isButtonDisabled" />
    </div>
</template>

<style scoped lang="less">
  .mainNav {
    display: flex;
    align-items: center;
    margin-top: 30px;
    padding-left: 100px;
    padding-right: 100px;
    justify-content: space-between;
    .dropdown {
      margin-left: 0;
      margin-right: 0;
      width: 350px;
    

      .title{
        background-color: #53C5F4;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: white;
        font-size: 20px;
        border-radius: 5px;
      }
      
      .custom-select {
            position: relative;
            display: inline-block;
            width: 350px;
            height: 40px;
            border-radius: 5px;
            background-color: #E7E6E6;
            cursor: pointer;
            margin-top: 1px;
            .selected {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                padding: 0 20px 0 20px;
                font-size: 17px;
                color: #333;
                
            }

            .selected::after {
            content: '';
                display: inline-block;
                margin-top: 1px;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid #333;
            }
            .dropdown-list {
                position: absolute;
                top: 100%;
                left: 0;
                z-index: 1;
                width: 100%;
                max-height: 200px;
                overflow-y: auto;
                background-color: #E7E6E6;
                border-radius: 5px;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                .dropdown-item {
                    height: 40px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    color: #333;
                    cursor: pointer;
                    justify-content: center;
                }

                .dropdown-item:hover {
                    background-color: white;
                }
            }
        }

        .custom-select.show .dropdown-list {
        display: block;
        }

    
    }
    .search {
      margin-left: 20px;
      .upper{
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          font-size: 20px;
          font-weight:550;
        }
        input{
          width: 300px;
          height: 50px;
          border: 1px solid #333;
          padding: 0 10px;
          font-size: 19px;
          color: #333;
          margin-left: 30px;
        }
        button{
          width: 100px;
          height: 50px;
          margin-left: 30px;
          vertical-align: bottom;
          background-color: #53C5F4;
          color: white;
          font-size: 17px;
          border-radius: 5px;
          border: none;
          cursor: pointer;

          span{
            position: relative;
            top: 0;
            left: 0;
            transition: top 0.2s ease, left 0.2s ease;
          }

          &:hover{
            background-color: #0E9BD8;

            span{
              top: 2px;
              left: 2px;
            }
          }
        }
      }

      .warning{
        text-align: center;
        margin-top: 10px;
        font-weight: bold;
        color: red;
      }
    }
  }

  .table-container {
    max-height: 300px;
    border-collapse: collapse;
    overflow-y: scroll;
    margin-top: 40px;
    display: flex;
    justify-content: center; 
    margin-right: 40px;
    margin-left: 40px;

    table {
      width: 100%;
      padding-right: 0;

      .sticky-header {
        position: sticky;
        top: 0;
       
        th {
          background-color: #00AAEE;
          color: white;
          height: 50px;
          overflow: hidden;
          word-wrap: break-word;
          text-overflow: ellipsis;
          max-width: 100px;
          min-width: 20px;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }

      
      tbody {
        tr {
          td {
            padding: 10px;
            overflow: hidden;
            word-wrap: break-word;
            text-overflow: ellipsis;
            max-width: 100px;
            min-width: 20px;
            vertical-align: middle;
            cursor: pointer;
            //&:hover {
             //text-decoration: underline;
            //}

            .checker{
              //appearance: none;
              width: 20px;
              height: 20px;
              display: inline-block;
            }

            &.blue{
              color: blue;
              text-decoration: underline;
            }
          }

          &.even-row {
            background-color: #E9EBF5;
          }

          &.odd-row {
            background-color: #CFD5EA;
          }
        }
      }
    }
  }

  .empty-warning{
    margin-top: 30px;
    margin-left: 40px;
    font-size: 23px;
    color: #DD0000;
    text-align: center;
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

        .modal-body {
          margin: 40px 70px 0 0;

          .form-group {
            display: flex;
            margin-bottom: 20px;
            align-items:baseline;

            .title {
              margin-left: 0;
              margin-right: 0;
              width: 200px;
              min-width: 200px;
              font-weight: bold;
            }

            .unit{
              margin-left: 20px;
              font-weight: bold;
              white-space: pre-line;
              text-align: left;
            }
            .textbox {
              margin-left: 10px;
              flex-grow: 1;
              min-width: 50px;
              padding: 5px;
              height: 40px;
            }

            .radios1-container{
              display: flex;
              align-items: center;
              height: 40px;
              width: 400px;
              margin-left: 50px;

              .radio1-option{
                display: flex;
                align-items: center;
                font-size: 13px;

                input[type="radio"]{
                  margin-right: 5px;
                }

                &:last-child{
                  margin-left: auto;
                }
              }
              
            }
          }

          .special-css{
            margin-top: 30px;
          }

        }

        .modal-footer{
          margin-top: 40px;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          justify-content:space-between;
          align-items: flex-end;

          button:hover{
            background: #1F3663;
          }
          .modal-default-button1 {
            float: left;
            margin-left: 30px;
            width: 130px;
            height: 30px;
            background: #4472C4;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;
          }

          .modal-default-button2 {
            float: right;
            margin-right: 30px;
            width: 200px;
            height: 30px;
            background: #4472C4;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;

            &:disabled{
                    pointer-events: none;
                    background-color: #BFBFBF;
                    user-select: none
            
            }

          }
        }

      }
    } 

  }
  .modal-mask2 {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    .modal-wrapper2 {
      display: table-cell;
      vertical-align: middle;

      .modal-container2 {
        width: 800px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;

        .modal-body2 {
          margin: 10px 50px 0 50px;

          .title{
            font-size: 21px;
          }
          
          .name-qty{
            width: 100%;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-top: 20px;
           
            .name{
              font-size: 23px;
              font-weight: bold;
            }

            .qty{
              font-size: 21px;
              display: flex; /* 添加 display: flex */
              align-items: center; /* 添加 align-items: center */

              .lsk-input{
                width: 70px;
                height: 30px;
                background-color: #E7E6E6;
                border: 1px solid black;
                margin-left: 15px;
                margin-right: 8px;
                font-size: 15px;
              }
            }
          }

          .details{
            display: flex;
            align-items:normal;
            justify-content: space-between;
            margin-top: 10px;
            .detail-left{
              text-align: left;
              padding-top: 16px;
              
              div{
                margin-bottom: 5px;
                font-weight:500;
              }
            }

            .detail-right{
              width: 215px;
              text-align: left;
        
              .radio-text{
                font-size: 16px;
              }
              .radios{

                div{
                  margin-top: 10px;
                  font-size: 13px;
                  display: flex;
                  align-items: center;

                  span{
                    vertical-align: middle;
                    display: inline-block;
                    height: 10px;
                    margin-left: 10px;
                  }
                  input[type="radio"]{
                    appearance: none;
                    position: relative;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 1px solid #4472C4;
                    background-color: #E7E6E6;
                    //transition: all 0.2s ease;

                    &::before, &::after{
                      content: "";
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    }

                    &::before{
                      width: 10px;
                      height: 10px;
                      border-radius: 50%;
                      background-color: #E7E6E6;
                      //transition: all 0.2s ease;
                    }

                    &:checked::before{
                      background-color: #4472C4;
                      width: 12px;
                      height: 12px;
                    }
 
                  }

                }
              }
            }
          }

        }

        .hr{
          border-style: dashed;
          border-width: 1px 0;
          margin: 30px 30px 40px 30px;
        }
        .modal-footer2{
          margin-bottom: 10px;
          margin-top: 20px;
          position: relative;
          display: flex;
          justify-content:space-between;
          align-items:center;
          width: 100%;
          height: 30px;

          button:hover{
            background: #1F3663;
          }
          .modal2-default-button1 {
            float: left;
            margin-left: 30px;
            width: 130px;
            height: 30px;
            background: #4472C4;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;
          }

          .modal2-default-button2 {
            position: absolute;
            float: right;
            right: 200px;
            top: 0;
            width: 200px;
            height: 30px;
            background: #4472C4;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;

            &:disabled{
                    pointer-events: none;
                    background-color: #BFBFBF;
                    user-select: none
            
            }
            
          }

          
          .modal2-default-button3 {
            position: absolute;
            float: right;
            right: 30px;
            width: 150px;
            height: 30px;
            background: #4472C4;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;
          }
          
          

        }
      }

    }
  }


  .footer{
    position: fixed;
    margin-bottom: 5px;
  }


</style>

<script>
// @ is an alias to /src
import LogoBanner from '@/components/LogoBanner.vue'
import FooterBtn from '@/components/FooterBtn.vue'

import config from '@/config'
import axios from 'axios'

import store from '@/store';


export default {
  name: 'SearchView',
  data(){
    return{
        title: "Chain & PTUC",
        welcome: "Welcome! TTCL",
        ifShow2: true,
        previousPage: '/selection',
        isButtonDisabled: true,
        modalButtonDisabled: true,
      
        selectedItem1: '',
        selectedItem2: '',
        searchText: '',
        items1: ['--', 'KTE', 'TKT', 'HRD', 'PLANET', 'NICHIDEN'],
        items2: ['--', 'Chain & Sprocket', 'PTUC', 'Cableveyor', 'Belt & Pulley'],

        showWarning: false,
        dropdownOpen1: false,
        dropdownOpen2: false,
        ifShowEmpty: false, 

        items: [
          // More items...
        ],

        newCode: '',
        oldCode: '',

        addMiddle: '____',

        showModal: false,
        showModal2: false,

        apiUrl: config.apiUrl,

        prevChecked: false,

        selectedOption: 'option1',

        lskQty: 0,

        orderQty: 0,
        companyName: '',
        personName: '',

        selectedDataLine: null,

        showBtnBackQuotation: false,

        qtyUnit: 'FT',

        showRadios: false,

        isEven: true,

        isReadOnly: false,
    }
  },

  computed: {
    /*formItems(){
      return [
          { label: 'NAME:', name: 'name', type: 'text', ifshow1: true, ifshow2: false, value: '', content: '', function: null},
          { label: 'Customer Name:', name: 'cname', type: 'text', ifshow1: true, ifshow2: false, value: '', content: '', function: null},
          { label: 'Quantity:', name: 'qty', type: 'text', ifshow1: true, ifshow2: true, value: this.orderQty, content: 'FT', function: this.inputOrderQty},
          { label: 'Product Code:', name: 'pcode', type: 'text', ifshow1: false, ifshow2: true, value: '', content: `NEW CODE: ${this.newCodeShow}\n\nOLD CODE: ${this.oldCodeShow}`, function: null},
        ];
    },*/

    NewCodeAdd(){
      return '+' + this.addMiddle + 'L-JP';
    },

    oldCodeAdd(){
      return ' (' + this.addMiddle + ' LSK/PC)';
    },

    L_Price(){
      if (this.selectedDataLine == null){
        return 0;
      }
      else{
        if (this.lskQty == 0){
          return Math.round(this.selectedDataLine.ttcl_selling).toLocaleString();
        }
        else{
          return Math.round(this.selectedDataLine.ttcl_selling * this.lskQty).toLocaleString();
        }
      }
    },

    oldCodeShow(){
      if (this.selectedDataLine.unit === 'L'){
        return this.oldCode + this.oldCodeAdd;
      }else{
        return this.oldCode;
      }
      
    },

    newCodeShow(){
      if (this.selectedDataLine.unit === 'L'){
        return this.newCode + this.NewCodeAdd;
      }else{
        return this.newCode;
      }
      
    },
  },

  components: {
    LogoBanner,
    FooterBtn,
  },

  watch: {
    companyName(){
      this.isEnableProceedBtn();
    },
    personName(){
      this.isEnableProceedBtn();
    },

    selectedItem1(){
      this.checkInputs();
    },
    selectedItem2(){
      this.checkInputs();
    },
    searchText(){
      this.checkInputs();
    },

    lskQty(){
      if (!/^\d+$/.test(this.lskQty)) {
        this.lskQty = 0;
      }

      if (this.lskQty.length > 8) {
        this.lskQty = this.lskQty.slice(0, 8);
      }

      if(this.lskQty!=0){
        this.showBtnBackQuotation = true;
        this.addMiddle = this.lskQty;
      }else{
        this.showBtnBackQuotation = false;
        this.addMiddle = '____';
      }
    },

    orderQty(){
      if (!/^\d+$/.test(this.orderQty)) {
        this.orderQty = 0;
      }

      if (this.orderQty.length > 8) {
        this.orderQty = this.orderQty.slice(0, 8);
      }

      this.isEnableProceedBtn();
    },
  },

  methods: {
    isEnableProceedBtn(){
      if(this.companyName=='' || this.personName=='' || this.orderQty==0){
        this.modalButtonDisabled = true;
      }
      else{
        this.modalButtonDisabled = false;
      }
    },

    checkInputs(){
      if((this.selectedItem1 && this.selectedItem2) || this.searchText){
        this.showWarning = false;
      }
    },


    searchPrice() {
      if ((!this.selectedItem1 || !this.selectedItem2) && !this.searchText) {
        this.showWarning = true;
        return;
      }

      axios.post(`${this.apiUrl}/search`,
        {
          selectedItem1: this.selectedItem1,
          selectedItem2: this.selectedItem2,
          searchText: this.searchText,
        }
      )
      .then(response => {
        this.items = response.data;
        this.ifShowEmpty = !this.items || !this.items.length;

        if(!this.ifShowEmpty){
          this.items.forEach(item => {
            item.checked = false;
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
  
    toggleDropdown1() {
      this.dropdownOpen1 = !this.dropdownOpen1;
      //console.log(this.dropdownOpen1);
    },
    toggleDropdown2() {
      this.dropdownOpen2 = !this.dropdownOpen2;
    },

    hideDropdown1(){
      this.dropdownOpen1 = false;
    },

    hideDropdown2(){
      this.dropdownOpen2 = false;
    },

    selectItem1(item) {
      if(item == '--'){
        this.selectedItem1 = '';
      }else{
        this.selectedItem1 = item;
      }
      
      this.dropdownOpen1 = false;
    },

    selectItem2(item) {
      if(item == '--'){
        this.selectedItem2 = '';
      }else{
        this.selectedItem2 = item;
      }
      
      this.dropdownOpen2 = false;
    },

    lButtonClick(item_){
      this.prevChecked = false;
      this.handleSelect(item_);
      if (!this.selectedDataLine){
        this.selectedDataLine = item_
      }
      this.handleClick();
    },

    handleClick(){
      //console.log(this.selectedDataLine.unit);
      if(this.selectedDataLine.unit === 'L'){
        this.showModal2=true;
        this.qtyUnit = 'LKS';
      }else{
        this.showModal = true;
        this.isReadOnly = false;
        this.qtyUnit = this.selectedDataLine.unit;
        this.showRadios = false;
      }
    },

    handleSelect(item_){
      if(this.prevChecked){
        if(item_.checked){
          this.items.forEach((item) => {
            item.checked = false;
          });
          item_.checked = true;
          this.prevChecked = true;
        }else{
          item_.checked = false;
          this.prevChecked = false;
        }  
        
      }else{
        this.items.forEach((item) => {
          item.checked = false;
        });
        item_.checked = true;
        this.prevChecked = item_.checked;
      }
      //console.log(this.prevChecked);

      if(this.prevChecked){
        this.isButtonDisabled = false;
        this.oldCode = item_.item;
        this.newCode = item_.item;
        this.selectedDataLine = item_;
      }else{
        this.isButtonDisabled = true;
        this.oldCode = '';
        this.newCode = '';
        this.selectedDataLine = null;
      }

    },

    openQuotationPage(){
      store.dispatch('passOrderQty', this.orderQty);
      store.dispatch('passCompanyName', this.companyName);
      store.dispatch('passPersonName', this.personName);
      store.dispatch('passNewCodeShow', this.newCodeShow);
      store.dispatch('passUnit', this.selectedDataLine.unit === 'L' ? 'LSK' : this.selectedDataLine.unit);
      store.dispatch('passPrice', this.selectedDataLine.price);

      console.log(this.companyName, this.personName, this.newCodeShow, this.unit);
      const newWindow = window.open('/#quotationpage', '_blank');
      newWindow.onload = () => {
        newWindow.store.replaceState(store.state);
      };
      //this.$router.push({ path: '/quotationpage' });
    },

    inputQty(){
      this.lskQty = this.lskQty.toString().replace(/[^\d]/g, '');
      var numTemp = parseInt(this.lskQty);
      if (numTemp % 2 === 0){
        this.isEven = true;
      }else{
        this.isEven = false;
      }
    },

    inputOrderQty(){
      this.orderQty = this.orderQty.toString().replace(/[^\d]/g, '');
    },

    toLinksInfo(){
      this.showModal2 = false;
      this.showModal = true;
      this.isReadOnly = true;
      this.orderQty = this.lskQty;
      this.qtyUnit = 'LSK';
      this.showRadios = true;
    },

    showModalBack(){
      if (this.isReadOnly){
        this.showModal = false;
        this.showModal2 = true;
      }else{
        this.showModal = false;
      }
    },

  }
}
</script>