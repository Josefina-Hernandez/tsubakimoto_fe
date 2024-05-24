<template>
    <div class="selection">
        <LogoBanner :title="title" :welcome="welcome" />

        <div class="mainNav">
            <div class="search-item">
                <span>Search Item:</span>
                <input v-model="searchText" type="text" placeholder="SEARCH">
            </div>
            <div class="qty">
                  <span>Quantity (L):</span>
                  <input v-model.number="qty" type="text" placeholder="QTY" @input="inputQty">
                  <div class="checkbox">
                    <input class="checkbox-son" type="checkbox">
                    <span class="checkbox-span">End link assembly</span>
                  </div>          
            </div> 
            <div class="check-button">
              <div class="button">
                <button :disabled="chkBtnDisabled" @click="checkPrice"><span>Check Price</span></button>
              </div>
            </div> 
        </div>

        <div class="table-container" v-show="showTable">
          <table>
            <thead class="sticky-header">
              <tr>
                <th>Description of Item</th>
                <th>Unit</th>
                <th>Selling Price</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
                <td>{{ item.column1 }}</td>
                <td>{{ item.column2 }}</td>
                <td>{{ item.column3 }}</td>
                <td>{{ item.column4 }}</td>
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
                  <div class="form-group" v-for="item in formItems" :key="item.name">
                    <label class="title" :for="item.name">{{ item.label }}</label>
                    <input :type="item.type" :name="item.name" :id="item.name" v-model="item.value" v-show="item.ifshow1">
                    <label class="unit" v-show="item.ifshow2">{{item.content}}</label>
                    <div>
                      <input name="checking" class="checking" type="checkbox" v-show="item.ifshow3">
                      <label class="checktext" for="checking" v-show="item.ifshow3">End Link Assembly</label>
                    </div>
                    
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="modal-default-button1" @click="showModal = false">back</button>
                <router-link to="quotationpage">
                  <button class="modal-default-button2">Received Quotation</button>
                </router-link>               
              </div>
            </div>
          </div>
        </div>


        
        <FooterBtn class="footer" :ifShow2="ifShow2" :toWhere="previousPage" :clickFunction="handleClick" />
    </div>
</template>

<style scoped lang="less">
  .mainNav {
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    margin-top: 30px;
    padding-left: 100px;
    padding-right: 50px;
    justify-content: space-between;
    
    .search-item, .qty {
      width: 100%;
      margin-bottom: 30px;
      //margin-left: 200px;
      span{
        font-size: 20px;
        font-weight:550;
        float: left;
        height: 50px;
        line-height: 50px;
      }
      input{
        width: 400px;
        height: 50px;
        border: 1px solid #333;
        padding: 0 10px;
        font-size: 19px;
        color: #333;
        margin-left: 30px;
        float: left;
      }
      .checkbox{
        float: right;
        margin-right: 350px;
        height: 50px;
        padding-right: 100px;
        .checkbox-son{
          width: 30px;
          height: 50px;
          vertical-align: middle;
        }
        .checkbox-span{
          line-height: 55px;
          padding-left: 20px;
        }
      }
    }

    .check-button{
      width: 100%;
      .button{
        float: right;
        margin-right: 0px;
        
        button{
          width: 200px;
          height: 35px;
          background-color: #4472C4;
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 5px;
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
          &:disabled{
            pointer-events: none;
            background-color: #BFBFBF;
            user-select: none          
          }
        }
      }
    }
  }

  .table-container {
    max-height: 200px;
    border-collapse: collapse;
    overflow-y: scroll;
    margin-top: 30px;
    display: flex;
    justify-content: center; 
    margin-right: 40px;
    margin-left: 40px;

    table {
      width: 100%;
      padding-right: 0;
      white-space: pre-wrap;
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
            color: #090909;
            padding: 10px;
            height: 80px;
            overflow: hidden;
            word-wrap: break-word;
            text-overflow: ellipsis;
            max-width: 150px;
            min-width: 20px;
            vertical-align: middle;
            cursor: pointer;
            
            &:first-child{
              min-width: 100px;
            }

            &:last-child{
              min-width: 100px;
            }

            &:hover {
              text-decoration: underline;
            }

            .checker{
              //appearance: none;
              width: 20px;
              height: 20px;
              display: inline-block;
            }
          }

          &.even-row {
            background-color: #CFD5EA;
          }

          &.odd-row {
            background-color: #E9EBF5;
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
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 800px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }


  .modal-body {
    margin: 40px 70px 0 0;
    .form-group {
      display: flex;
      margin-bottom: 20px;
      align-items:center;

      .title {
        margin-right: 0;
        width: 200px;
        font-weight: bold;
      }

      .unit{
        margin-left: 20px;
        font-weight: bold;
        white-space: pre-line;
      }
      input {
        flex-grow: 1;
        padding: 5px;
        height: 40px;
      }

      div{
        display: flex;
        align-items: center;
        margin-left: 20px;
        height: 50px;
        .checking{
          margin-right: 15px;
          height: 30px;
          width: 30px;
        }
        .checktext{
          font-weight: bold;
        }
      }
      
    }

  }

  .modal-footer{
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
import axios from 'axios'
import config from '@/config'

export default {
  name: 'SearchView',
  data(){
    return{
        title: "Chain Cutting & Assembled at TTCL warehouse",
        welcome: "Welcome! TTCL",
        ifShow2: true,
        previousPage: '/selection',

        searchText: '',
        qty: 0,
        chkBtnDisabled: true,

        apiUrl: config.apiUrl,

        ifShowEmpty: false,
        showTable: false,

        items: [
          /*{
            column1: 'RS80-1-RP+80L-MWJMWJ\nOld code: RS80-1-RP (81LKS/PC)',
            column2: 'PC',
            column3: '1,812',
            column4: 'The chain will have 79 links +1 MWJL at one side 1 MWJL at another',
          },*/
          // More items...
        ],

        formItems: [
          { label: 'NAME:', name: 'name', type: 'text', ifshow1: true, ifshow2: false, ifshow3: false, value: '', content: ''},
          { label: 'Customer Name:', name: 'cname', type: 'text', ifshow1: true, ifshow2: false, ifshow3: false, value: '', content: ''},
          { label: 'Quantity:', name: 'qty', type: 'text', ifshow1: true, ifshow2: true, ifshow3: true, value: '', content: 'LSK'},
          { label: 'Product Code:', name: 'pcode', type: 'text', ifshow1: false, ifshow2: true, ifshow3: false, value: '', content: 'NEW CODE: RF2050R\nOLD CODE: RF2050R'}
        ],

        showModal: false,

        
    }
  },
  components: {
    LogoBanner,
    FooterBtn,
  },
  watch: {
    searchText(){
      this.isEnableCheckBtn();
    },
    qty(){
      if (!/^\d+$/.test(this.qty)) {
        this.qty = 0;
      }

      if (this.qty.length > 8) {
        this.qty = this.qty.slice(0, 8);
      }

      this.isEnableCheckBtn();
    },
  },
  methods: {
    checkPrice(){
      axios.post(`${this.apiUrl}/qtysearch`, 
        {
          searchText: this.searchText,

        }
      )
      .then(response => {
        this.items = response.data;
        this.ifShowEmpty = !this.items || !this.items.length;
        this.chkBtnDisabled = !(!this.items || !this.items.length);
        this.showTable = true;
        alert(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    },

    isEnableCheckBtn(){
      if (!this.searchText || this.qty == 0){
        this.chkBtnDisabled = true;
      }else{
        this.chkBtnDisabled = false;
      }
    },
    handleClick(){
      this.showModal=true;
    },
    inputQty(){
      this.qty = this.qty.toString().replace(/[^\d]/g, '');
    },
  }
}
</script>