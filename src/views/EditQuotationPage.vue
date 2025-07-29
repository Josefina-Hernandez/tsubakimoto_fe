<template>
    <div class="quotation" id="quote">
      <div class="top">
        <img alt="Company logo" src="../assets/logo.png" />
        <div class="tsubaki-container">
            <strong>Tsubakimoto (Thailand) Co., Ltd.</strong>
            <span><br>{{ tsubakiAddress }}</span>
        </div> 
      </div>
      <div class="title">QUOTATION</div>
      <div class="no-line">
        <div class="reg-no">COMPANY REG. NO.: 0105545036171</div>
        <div class="tax-id">TAX ID NO.: 0105545036171</div>
      </div>
      
      <hr class="hr" />
      
      <div class="upper-detail">
        <div class="detail-left">
            <div class="to-line">
                <div class="to-label">To:</div>
                <div class="to-customer">TSUBAKO KET CO., LTD.</div>
            </div>
            <div class="address-line">
                <div class="address-label"></div>
                <div class="address">952 RAMALAND BLDG. 17TH FLOOR, RAMA<br>IV ROAD SURIYAWONG, BANGRAK<br>BANGKOK 10500<br>THAILAND</div>
            </div>
            <div class="attn-line">
                <div class="attn-label">Attn:</div>
                <div class="attn">MS.WARARAT</div>
            </div>
        </div>
        <div class="detail-right">
            <div class="ref-line">
                <div class="ref-label">Your Ref.</div>
                <div class="ref">:THAI SINTO KOGIO</div>
            </div>
            <div class="id-line">
                <div class="id-label">Quote ID</div>
                <div class="id">:Q-102274</div>
            </div>
            <div class="date-line">
                <div class="date-label">Created Date</div>
                <div class="date" v-if="!ifShowEditBtn">:{{ createdDt }}</div>
                <div class="date" v-if="ifShowEditBtn"><span>:</span><input v-model="createdDt" type="text" placeholder="Edit date"></div>
            </div>
            <div class="payment-line">
                <div class="payment-label">Payment Terms</div>
                <div class="payment" v-if="!ifShowEditBtn">:{{ paymentTerms }}</div>
                <div class="payment" v-if="ifShowEditBtn"><span>:</span><input v-model="paymentTerms" type="text" placeholder="Edit payment terms"></div>
            </div>
            <div class="trade-line">
                <div class="trade-label">Trade Terms</div>
                <div class="trade">:DELEVERD DUTY PAID BANGKOK</div>
            </div>
            <div class="mode-line">
                <div class="mode-label">Delivery Mode</div>
                <div class="mode">:TRUCK</div>
            </div>
            <div class="period-line">
                <div class="period-label">Delivery Period</div>
                <div class="period">:8 WEEKS BY AIR</div>
            </div>
            <div class="validity-line">
                <div class="validity-label">Validity Terms</div>
                <div class="validity">:15 DAYS</div>
            </div>
            <div class="currency-line">
                <div class="currency-label">Currenty Code</div>
                <div class="currency">:Thai baht</div>
            </div>
            
        </div>

        <div class="detail-right"></div>
      </div>

      <div class="details">
        <table>
          <thead>
            <tr>
              <th class="index">S/No</th>
              <th class="description">Description of Comodity</th>
              <th>Qty</th>
              <th class="uom">UOM</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ index+1 }}</td>
              <td>{{ item.description }}</td>
              <td>{{ formatNumber(item.qty.toLocaleString('en-US')) }}</td>
              <td>{{ item.UOM }}</td>
              <td>{{ formatNumber(item.unitPrice.toLocaleString('en-US')) }}</td>
              <td>{{ formatNumber(item.amount.toLocaleString('en-US')) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="btn-edit" v-show="ifShowEditBtn">
            <button class="btn-edit" @click="toEditProducts"><span>Edit Products</span></button>
        </div>
        
        <div class="remarks">Remarks:&nbsp;&nbsp;&nbsp;&nbsp;PIC: Sirikamon</div>
        <div class="detail">- Price included air charge<br>- The goods to be imported from Germany.</div>
        
        <div class="sum-area">
            <div class="total-line">
                <div class="total-label">Total Price</div>
                <div class="total-sum">{{ formatNumber(total.toFixed(0)) }}</div>
            </div>
            <div class="total-line">
                <div class="total-label">Tax (VAT)</div>
                <div class="total-sum">{{ formatNumber(total * 0.07) }}</div>
            </div>
            <div class="total-line">
                <div class="total-label">Grand Total</div>
                <div class="total-sum">{{ formatNumber(total * 1.07) }}</div>
            </div>
        </div>
        
        <div class="sign-area">
            <img alt="Sign1" src="../assets/signatures/signature1.jpg" />
            <hr class="hr-sign" />
            <div>Arparwan Sanantung</div>
            <img alt="Sign1" src="../assets/signatures/signature2.jpg" />
        </div>
      </div>
      <div class="bottom-text">
        <div>Page 1 of 1</div>
        <div>&nbsE.&.O.E</div>
      </div>
    </div>
    <div class="button-area1">
        <div></div>
        <button @click="handleClickEditPage"
            :class="{'edit-mode': bottomEditBtnText === 'Edit', 'save-mode': bottomEditBtnText === 'Save Edition'}"
        ><span>{{ bottomEditBtnText }}</span></button>
    </div>
    <div class="button-area2">
      <button @click="closePage"><span>Go Back</span></button>
      <button @click="printQuote" :disabled="bottomEditBtnText === 'Save Edition'"><span>Download PDF</span></button>
    </div>
  </template>
  
  <script>
  //import jsPDF from 'jspdf'
  //import html2canvas from 'html2canvas'
  //import htmlToPdf from '@/utils/htmlToPdf'
  
  import { mapState/*, mapMutations*/ } from 'vuex'
  import store from '@/store';
  
  export default {
    name: "EditQuotationPage",
    data() {
      return {

        tsubakiAddress: "388 Exchange Tower, 19th Floor Unit 1902,\nSukumvit Road, Klongtoey, Bangkok 10110,\nThailand\nTEL: +66(2)262-0667/8/9 FAX: +66(2)262-0670",
  
        htmlTitle: "quotation_",

        ifShowEditBtn: false,

        bottomEditBtnText: 'Edit',

        createdDt: '2 Oct 2024',

        paymentTerms: '30 days Aft Mth End Close'
  
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
            // description: store.state.newCodeShow,
            // qty: store.state.orderSum,
            // unit: store.state.Unit,
            // price: store.state.Price,
            // amount: store.state.Price * store.state.orderSum,
            description: 'S0650.85.RS1.75.ST-2535 FAI/MAI W/STEEL BAND COVER ON BOTH SIDES',
            qty: 1,
            UOM: 'PC',
            unitPrice: 70350,
            amount: 70350,
          },  
        //   {
        //     description: 'S0650.85.RS1.75.ST-2535 FAI/MAI W/STEEL BAND COVER ON BOTH SIDES',
        //     qty: 1,
        //     UOM: 'PC',
        //     unitPrice: 70350,
        //     amount: 70350,
        //   },  
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
      toEditProducts() {
        this.$router.push('/editproducts');
      },

      printQuote() {
        const originalTitle = document.title;

        //获取当前时间并格式化
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        const filename = `Quotation_${yyyy}${mm}${dd}_${hh}${min}${ss}`;
        document.title = filename

        window.print();

        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
      },

      handleClickEditPage() {
        if (this.bottomEditBtnText === 'Edit') {
            this.bottomEditBtnText = 'Save Edition';
            this.ifShowEditBtn = true;
        } else {
            this.bottomEditBtnText = 'Edit';
            this.ifShowEditBtn = false;
        }
      },
  
      formatNumber(value) {
        const str = value.toString();
        const parts = str.split('.');
        if (parts.length === 1) {
            parts.push('00');
        } else if (parts[1].length === 1) {
            parts[1] = parts[1] + '0';
        } else if (parts[1].length > 2) {
            parts[1] = Math.round(parseFloat('0.' + parts[1]) * 100).toString().padStart(2, '0');
        }
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
      },
  
      closePage(){
        this.$router.push({path: '/quotation-result'});
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
    //min-height: 794*1.4142px;
    min-height: calc(794px * 1.4142); // A4 高度
    position: relative;

    .top {
      display: flex;
      justify-content: space-between;
      align-items:start;
      margin-bottom: 20px;
      margin-left: 30px;
      margin-right: 30px;
      margin-top: 30px;
      img {
        width: 200px;
        height: 35px;
        margin-left: 5px;
        margin-top: 10px;
      }

  
      .tsubaki-container{
        font-size: 14px;
        //width: 250px;
        text-align: left;
        white-space: pre-line;
      }
    }
  
    .title {
       font-size: 19px;
       font-weight: bold; 
    }

    .no-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 30px;
        margin-right: 30px;
        font-size: 13px;
        font-weight: bold;
        .reg-no {

        }
        .tax-id {

        }
    }
  
    .hr{
      border-style: solid;
      border-width: 1px 0;
      margin: 10px 30px 20px 30px;
    }

    .upper-detail {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-left: 30px;
        margin-right: 30px;
        font-size: 13px;
        .detail-left {
            text-align: left;
            width: 410px;
            .to-line {
                display: flex;
                
                .to-label {
                    width: 65px;  
                    font-weight: bold;
                }
                .to-customer {

                }
            }
            .address-line {
                display: flex;
                margin-top: 10px;
                .address-label {
                    width: 65px;
                }
                .address {

                }
            }
            .attn-line {
                display: flex;
                margin-top: 10px;
                .attn-label {
                    width: 65px;
                    font-weight: bold;
                }
                .attn {

                }
            }
       }
        .detail-right {
            text-align: left;

            .ref-line {
                display: flex;
                .ref-label {
                    width: 120px;
                    font-weight: bold;
                }
                .ref {

                }
            }
            .id-line {
                display: flex;
                margin-top: 5px;
                .id-label {
                    width: 120px;
                    font-weight: bold;
                }
                .id {

                }
            }
            .date-line {
                display: flex;
                margin-top: 5px;
                .date-label {
                    width: 120px;
                    font-weight: bold;
                }
                .date {
                    input {
                        background-color: #f8c7c4;
                        width: 200px;
                    }
                }
            }
            .payment-line {
                display: flex;
                margin-top: 5px;
                .payment-label {
                    width: 120px;
                    font-weight: bold;
                }
                .payment {
                    input {
                        background-color: #f8c7c4;
                        width: 200px;
                    }
                }
            }
            .trade-line {
                display: flex;
                margin-top: 5px;
                .trade-label {
                    width: 120px;
                    font-weight: bold;
                }
                .trade {
                    
                }
            }
            .mode-line {
                display: flex;
                margin-top: 5px;
                .mode-label {
                    width: 120px;
                    font-weight: bold;
                }
                .mode {
                    
                }
            }
            .period-line {
                display: flex;
                margin-top: 5px;
                .period-label {
                    width: 120px;
                    font-weight: bold;
                }
                .period {

                }
            }
            .validity-line {
                display: flex;
                margin-top: 5px;
                .validity-label {
                    width: 120px;
                    font-weight: bold;
                }
                .validity {

                }
            }
            .currency-line {
                display: flex;
                margin-top: 5px;
                .currency-label {
                    width: 120px;
                    font-weight: bold;
                }
                .currency {

                }
            }

        }
    }
    .details {
      margin-bottom: 20px;
      margin-left: 30px;
      margin-right: 30px;
      margin-top:40px;
  
      table {
        width: 100%;
        border-collapse: collapse;
        line-height: 14px;
        font-size: 12px;
  
        thead th {
          background-color: #f2f2f2;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          text-align: center;
          padding: 5px 8px;
          &.index {
            width: 10px;
          }
          &.description {
            width: 250px;
          }
          &.uom {
            width: 50px;
          }
          &:nth-child(5),
          &:nth-child(6) {
            text-align: right;
            padding-right: 20px;
          }
        }
        
        tbody td {
          border-bottom: 1px solid #ddd;
          padding: 3px 8px;

          &:nth-child(2) {
            text-align: left;
          }
          &:nth-child(5),
          &:nth-child(6) {
            text-align: right;
            padding-right: 20px;
          }
        }
      }
      
      .btn-edit {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 5px;

        button {
            width: 150px;
            height: 25px;
            font-size: 15px;
            color: white;
            border: none;
            border-radius: 5px;
            justify-content: center;
            background-color: #4472C4;
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
      }
      

      .remarks {
        text-align: left;
        font-size: 13px;
        margin-top: 10px;
      }
      .detail {
        text-align: left;
        font-size: 13px;
        margin-left: 65px;
        margin-top: 10px;
      }
      .sum-area {
        text-align: left;
        margin-left: 450px;
        margin-right: 30px;
        margin-top: 40px;
        font-size: 13px;
        .total-line {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            .total-label {
                font-weight: bold;
                font-size: 14px;
            }
            .total-sum {
                text-align: right;
            }
        }
      }
    }
    .sign-area {
        position: absolute;
        //margin-left: 430px;
        width: 300px;
        bottom: 20px;
        right: 20px;
        img {
            width: 130px;
            height: 70px;
        }
        .hr-sign{
            border-style: solid;
            border-width: 1px 0;
            margin-right: 30px;
        }
        div {
            text-align: right;
            margin-right: 45px;
            font-size: 12px;
            font-weight: bold;
        }
    }
  
    .bottom-text {
        position: absolute;
        bottom: 10px;
        font-size: 11px;
        text-align: left;
        margin-left: 30px;
        display: flex;
        justify-content: space-between;
        width: 300px;
    }
  
  }
  .button-area1 {
    position: fixed;
    bottom: 70px;
    left: 30px;
    right: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;

    button{
      width: 200px;
      height: 30px;
      font-size: 17px;
      background-color: #4472C4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &.edit-mode {
        background-color: #4472C4;
      }
      &.save-mode {
        background-color: #369871;
      }
  
      span {
        position: relative; 
        top: 0;
        left: 0;
        transition: top 0.2s ease, left 0.2s ease;
      }
  
      &:hover{
        &.edit-mode {
            background-color: #2C4D89;
        }
        &.save-mode {
            background-color: #1b5f44;
        }
      }
  
      &:hover span {
          top: 2px; 
          left: 2px; 
      }
    }

  }
  .button-area2 {
    position: fixed;
    bottom: 20px;
    left: 30px;
    right: 30px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 0 50px;

    button{
      width: 200px;
      height: 30px;
      font-size: 17px;
      background-color: #4472C4;
      color: white;
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
  
      &:not(:disabled):hover span {
          top: 2px; 
          left: 2px; 
      }

      &:disabled {
        background-color: #666;
        cursor: not-allowed;
      }
    }
  }

  /* === 打印样式专用设置 === */
@media print {
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  // 打印时只保留 #quote 区域
  body * {
    visibility: hidden;
  }

  #quote,
  #quote * {
    visibility: visible;
  }

  // 强制 #quote 区域定位到页面最上
  #quote {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 999;
  }

  // 打印时隐藏页面按钮区域（防止导入PDF）
  .button-area,
  .btn-edit,
  .btn-other {
    display: none !important;
  }

  // 强制页面不要截断内容（避免分页出错）
  .quotation {
    page-break-inside: avoid;
    break-inside: avoid;
    border: none !important;
  }

  // 强制签名、底部文本不被分页
  .sign-area,
  .bottom-text {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  // 可选：设置每页页边距
  @page {
    //margin: 20mm;
  }
}

  
  </style>
  