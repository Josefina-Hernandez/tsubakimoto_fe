<template>
    <div class="selection">
        <LogoBanner :title="title" />
        <div class="table-container">
          <table>
            <thead class="sticky-header">
              <tr>
                <th>no</th>
                <th>Previous Model No.</th>
                <th>New Model No.<br>/New Chain Number</th>
                <th>QTY</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Price</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
                <td>{{ index + 1 }}</td>
                <td>{{ item.oldModelNo }}</td>
                <td>{{ item.newModelNo }}</td>
                <td><input type="text" v-model="item.qty"></td>
                <td>{{ item.unit }}</td>
                <td>{{ item.unitPrice }}</td>
                <td>{{ formatNumberWithCommas(item.qty * item.unitPrice) }}</td>
                <td><button @click="deleteProduct(index)"><span>Delete</span></button></td>
              </tr>
            </tbody>
          </table>  
        </div>
        <div class="total-area">
            <div class="total-label">TOTAL PRICE</div>
            <div class="total-value">{{ totalPrice }} THB</div>
            <div class="remove-all">
                <button @click="removeAllProducts"><span>Remove All</span></button>
            </div>
        </div>

        <div class="modal-mask" v-if="showModal">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-body">
                <form>
                  <div class="enduser-group">
                    <label class="enduser-label" for="qty">End User Name:</label>
                    <input type="text" name="enduser-val" v-model="endUser" @input="inputFinalInfo" class="enduser-val">
                  </div>
                  <div class="name-group">
                    <label class="name-label" for="pcode">Your Name:</label>
                    <input type="text" name="name-val" v-model="yourName" @input="inputFinalInfo" class="name-val">
                  </div>
                  <div class="remark-group">
                    <label class="remark-label" for="pcode">Remark (Optional):</label>
                    <textarea type="text" name="remark-val" v-model="remark" @input="inputFinalInfo" class="remark-val"></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="modal-default-button1" @click="showModalBack">Close</button>
                <div @click.prevent="!modalButtonDisabled && proceedToNext()">
                  <button class="modal-default-button2" :disabled="modalButtonDisabled">Done</button>
                </div>               
              </div>
            </div>
          </div>
        </div>

        <FooterBtn class="footer" :style="footerStyle" :ifShow2="ifShow2" :toWhere="previousPage" :clickFunction="handleClick" :isButtonDisabled="isButtonDisabled" />
    </div>

</template>

<script>
// @ is an alias to /src
import LogoBanner from '@/components/LogoBanner.vue'
import FooterBtn from '@/components/FooterBtn.vue'

import store from '@/store';

export default {
  name: 'EditProducts',
  data(){
    return{
        title: "Edit Products",
        ifShow2: true,
        previousPage: '/onlinepricelist',
        isButtonDisabled: false,

        showModal: false,

        endUser: '',
        yourName: '',
        remark: '',

        modalButtonDisabled: false,

        items: [
            // {
            //     description: 'RF2050R-2NT9',
            //     qty: 10,
            //     unit: 'BOX',
            //     unitPrice: 235.75,
            //     price: 2829,
            // },
            // {
            //     description: 'RF2050R-2NT9',
            //     qty: 10,
            //     unit: 'BOX',
            //     unitPrice: 235.75,
            //     price: 2829,
            // },
            // {
            //     description: 'RF2050R-2NT9',
            //     qty: 10,
            //     unit: 'BOX',
            //     unitPrice: 235.75,
            //     price: 2829,
            // },
        ],
    }
  },
  components: {
    LogoBanner,
    FooterBtn,
  },

  mounted() {
    this.items = this.$store.state.partList;
    console.log(this.items);
    this.inputFinalInfo();
  },

  computed: {
    footerStyle() {
      return {
        top: this.windowHeight > 0.9 * window.screen.height ? '810px' : '750px',
      };
    },

    totalPrice() {
        const total = this.items.reduce((sum, item) => {
            const qty = Number(item.qty) || 0;
            const price = Number(item.unitPrice) || 0;
            return sum + qty * price;
        }, 0);

        return this.formatNumberWithCommas(total);
    },
  },

  methods: {
    removeAllProducts() {
        const confirmed = window.confirm(`Are you sure you want to remove all of the products on the table?`);
        if (confirmed) {
            this.items = [];
            this.$store.commit('setPartList', this.items);
        }
    },

    deleteProduct(index) {
        const confirmed = window.confirm(`Are you sure you want to delete the product of ${this.items[index].newModelNo}?`);
        if (confirmed) {
            //console.log(index);
            this.items.splice(index, 1);
            this.$store.commit('setPartList', this.items);
        }
    },

    handleClick(){
        this.showModal = true;
    },

    formatNumberWithCommas(value) {
        const num = Number(value);
        if (isNaN(num)) return value;
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    showModalBack() {
        this.showModal = false;
    },

    inputFinalInfo() {
        if (!this.endUser || !this.yourName) {
            this.modalButtonDisabled = true;
        } else {
            this.modalButtonDisabled = false;
        }
    },

    proceedToNext() {
        this.$store.commit('setEndUserName', this.endUser);
        this.$store.commit('setYourName', this.yourName);
        this.$store.commit('setRemark', this.remark);

        const updatedItems = this.items.map(item => {
            const qty = Number(item.qty) || 0;
            const price = Number(item.unitPrice) || 0;
            return {
                ...item,
                amount: qty * price,
            };
        });

        this.$store.commit('setPartList', updatedItems);

        this.$router.push('/presubmitquotation');
    },
    
  },
}
</script>


<style scoped lang="less">
    .selection {
        //max-width: 100vw;
        width: 100%;
        margin: 0 auto;
        
        .table-container {
            max-height: 380px;
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
                    z-index: 1000;
                    background-color: #00AAEE;
                    
                    th {
                        color: white;
                        height: 50px;
                        overflow: hidden;
                        word-wrap: break-word;
                        text-overflow: ellipsis;
                        max-width: 100px;
                        min-width: 20px;

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
                            //max-width: 100px;
                            min-width: 20px;
                            vertical-align: middle;
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

                            &:nth-child(1) {
                                width: 80px;
                            }

                            &:nth-child(4) {
                                width: 130px;

                                input {
                                    width: 130px;
                                    height: 25px;
                                    text-align: right;
                                    margin: 0 10px;
                                    font-size: 16px;
                                }
                            }

                            &:nth-child(5) {
                                width: 100px;
                            }

                            &:nth-child(6) {
                                text-align: right;
                                width: 160px;
                            }

                            &:nth-child(7) {
                                text-align: right;
                                width: 200px;
                            }

                            &:nth-child(8) {
                                width: 140px;
                                button {
                                    width: 100px;
                                    height: 25px;
                                    background-color: rgb(190, 5, 5);
                                    border: none;
                                    border-radius: 3px;
                                    font-size: 13px;
                                    color: white;
                                    cursor: pointer;
                                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果

                                    span {
                                        position: relative;
                                        top: 0;
                                        left: 0;
                                        transition: top 0.2s ease, left 0.2s ease;
                                    }

                                    &:hover span {
                                        top: 2px;
                                        left: 2px;
                                    }

                                    &:hover {
                                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); // hover 时加深阴影
                                    }
                                }
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
    
        .total-area {
            margin-right: 40px;
            margin-left: 40px;
            margin-top: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;

            font-size: 18px;
            font-weight: bold;

            .total-label {
                display: flex;
                flex: 5;
                background: #00AAEE;
                height: 50px;
                justify-content: center;
                align-items: center;
                color: white;
            }

            .total-value {
                display: flex;
                flex: 2;
                background: #E9EBF5;
                height: 50px;
                justify-content: center;
                align-items: center;
                margin-right: 5px;
                margin-left: 5px;
            }
            .remove-all {
                flex: 1;;
                button {
                    margin-right: 18px;
                    width: 100%;
                    height: 40px;
                    background-color: rgb(190, 5, 5);
                    border: none;
                    border-radius: 3px;
                    font-size: 15px;
                    font-weight: bold;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果

                    span {
                        position: relative;
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease;
                    }

                    &:hover span {
                        top: 2px;
                        left: 2px;
                    }

                    &:hover {
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); // hover 时加深阴影
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

                    .modal-body {
                        margin: 40px 70px 0 30px;

                        .enduser-group {
                            display: flex;
                            margin-bottom: 20px;
                            align-items:baseline;

                            .enduser-label {
                                margin-left: 0;
                                margin-right: 0;
                                width: 150px;
                                min-width: 150px;
                                font-weight: bold;
                                text-align: left;
                            }

                            .enduser-val {
                                margin-left: 10px;
                                flex-grow: 1;
                                min-width: 50px;
                                padding: 5px;
                                height: 40px;
                                font-size: 15px;
                            }
                        }

                        .name-group {
                            display: flex;
                            margin-bottom: 20px;
                            align-items:baseline;
                            justify-content: left;

                            .name-label {
                                margin-left: 0;
                                margin-right: 0;
                                width: 150px;
                                min-width: 150px;
                                font-weight: bold;
                                text-align: left;
                            }

                            .name-val {
                                margin-left: 10px;
                                flex-grow: 1;
                                min-width: 50px;
                                padding: 5px;
                                height: 40px;
                                font-size: 15px;
                            }
                        }

                        .remark-group {
                            display: flex;
                            margin-bottom: 20px;
                            align-items:baseline;

                            .remark-label {
                                margin-left: 0;
                                margin-right: 0;
                                width: 150px;
                                min-width: 150px;
                                font-weight: bold;
                                text-align: left;
                            }

                            .remark-val {
                                margin-left: 10px;
                                flex-grow: 1;
                                min-width: 50px;
                                padding: 5px;
                                height: 140px;
                                font-size: 15px;
                                //line-height: 1.4;
                                vertical-align: top;
                                font-family: Helvetica, Arial, sans-serif;
                            }
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
                            background: #0082B3;
                        }
                        .modal-default-button1 {
                            float: left;
                            margin-left: 30px;
                            width: 130px;
                            height: 30px;
                            background: #00AAEE;
                            border-radius: 3px;
                            font-size: 17px;
                            color: white;
                            border: none;
                            cursor: pointer;
                        }

                        .modal-default-button2 {
                            float: right;
                            margin-right: 70px;
                            width: 130px;
                            height: 30px;
                            background: #00AAEE;
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
    }

</style>