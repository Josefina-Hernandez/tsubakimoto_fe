<template>
  <div class="quotation" id="quote">
    <div class="top">
      <div class="logo">KTE Thailand</div>
      <div class="customer-name">{{ customerName }}</div> 
    </div>
    <div class="address">
      <div class="left-address">{{ left_address }}</div>
      <div class="right-address">{{ right_address }}</div>
    </div>

    <div class="person-name">{{ personName }}</div>
    
    <hr class="hr" />

    <div class="details">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>QTY</th>
            <th>UNIT</th>
            <th>PRICE</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.description }}</td>
            <td>{{ formatNumber(item.qty.toLocaleString('en-US')) }}</td>
            <td>{{ formatNumber(item.unit.toLocaleString('en-US')) }}</td>
            <td>{{ formatNumber(item.price) }}</td>
            <td>{{ formatNumber(item.amount.toFixed(0)) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="total">Total: {{ formatNumber(total.toFixed(0)) }} THB</div>
    </div>
    <div class="remarks">
      Remarks: <br><br>This quotation is online generated quotation. For more information, please contact 02-xxx-xxxx.
    </div>
    
  </div>
  <div class="button-area">
    <button @click="closePage"><span>Close</span></button>
    <button @click="downloadPDF"><span>Download as PDF</span></button>
  </div>
</template>

<script>
//import jsPDF from 'jspdf'
//import html2canvas from 'html2canvas'
import htmlToPdf from '@/utils/htmlToPdf'

import { mapState/*, mapMutations*/ } from 'vuex'
import store from '@/store';

export default {
  name: "QuotationPage",
  data() {
    return {
      
      left_address: "Address:\nXXX Sukhumvit rd. Klongtoey BKK 10110,123 Main Street, Bangkok, Thailand",
      right_address: "Address:",

      htmlTitle: "quotation_",

      
    };
  },

  computed: {
    total() {
      return this.items.reduce((sum, item) => sum + item.amount, 0);

    },

    ...mapState(
      {
        orderSum: state => state.orderSum
      }
    ),

    items(){
      return [
        {
          description: store.state.newCodeShow,
          qty: store.state.orderSum,
          unit: store.state.Unit,
          price: store.state.Price,
          amount: store.state.Price * store.state.orderSum,
        },  
      ];
    },
    
    customerName(){
      return store.state.companyName;
    },
    
    personName(){
      return "Ms./Mr. " + store.state.personName.toString();
    },

  },

  methods: {
    downloadPDF(){
      htmlToPdf.getPdf(this.htmlTitle);
      //console.log(store.state.orderSum);
      //console.log(store.state.newCodeShow);
      //console.log(store.state.companyName);
      //console.log(store.state.personName);
      //console.log(store.state.Unit);
      //console.log(store.state.Price);
    },

    formatNumber(value) {
      const str = value.toString();
      const parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    },

    closePage(){
      window.close();
    },
  }
};
</script>

<style scoped lang="less">
.quotation {
  width: 794px;
  margin: 30px auto;
  font-size: 16px;
  font-family: Arial, sans-serif;
  line-height: 1.5;
  border: 1px solid black;
  min-height: 794*1.4142px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-left: 30px;
    margin-right: 30px;
    margin-top: 30px;
    .logo {
      font-size: 24px;
      font-weight: bold;
    }

    .customer-name{
      font-size: 24px;
      font-weight: bold;
      width: 250px;
      text-align: left;
    }
  }

  .address{
    display: flex;
    justify-content: space-between;
    align-items: top;
    text-align: left;
    margin-left: 30px;
    margin-right: 30px;
    white-space: pre-line;

    .left-address{
      width: 250px;
      font-size: 14px;
      
    }

    .right-address{
      width: 250px;
      font-size: 14px;
      
    }
  }

  .person-name{
    text-align: left;
    margin-left: 30px;
    font-size: 17px;
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .hr{
    border-style: dashed;
    border-width: 1px 0;
    margin: 10px 30px 40px 30px;
  }
  .details {
    margin-bottom: 20px;
    margin-left: 30px;
    margin-right: 30px;

    table {
      width: 100%;
      border-collapse: collapse;
      line-height: 30px;

      thead th {
        background-color: #f2f2f2;
        text-align: center;
        padding: 8px;
      }

      tbody td {
        border-bottom: 1px solid #ddd;
        padding: 8px;
      }
    }

    .total {
      font-size: 18px;
      font-weight: bold;
      text-align: right;
      margin-top: 50px;
    }
  }

  .remarks {
    font-size: 14px;
    margin-top: 50px;
    margin-left: 100px;
    margin-right: 100px;
    margin-bottom: 100px;
    text-align: left;
  }

}

.button-area{
  position: fixed;
  bottom: 20px;
  left: 30px;
  right: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button{
    width: 200px;
    height: 30px;
    font-size: 17px;
    background-color: #4472C4;
    color: white;
    border: none;
    border-radius: 5px;

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
}

</style>
