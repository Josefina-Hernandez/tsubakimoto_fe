<template>
  <div class="selection">
      <LogoBanner2 :title="title" :cartCount="cartCount" :clickFunction="toEditProductsPage" />

      <div class="mainNav">
          <div class="dropdown" @mouseleave="hideDropdown1" v-if="ifShowDistributors">
              <div class="title">Distributor Name</div>
              <div class="custom-select">
                  <div class="selected" @click="toggleDropdown1">{{ selectedItem1 ? selectedItem1 : '--' }}</div>
                  <div class="dropdown-list" v-show="dropdownOpen1">
                      <div class="dropdown-item" v-for="(item, index) in items1" :key="index" @click="selectItem1(item)">
                          {{ item && item.length > 1 ? item[1] : '' }}
                      </div>
                  </div>
              </div>
          </div>
          <div class="dropdown" @mouseleave="hideDropdown2">
              <div class="title">Price List Name</div>
              <div class="custom-select">
                  <div class="selected" @click="toggleDropdown2">{{ selectedItem2 ? selectedItem2 : '--' }}</div>
                  <div class="dropdown-list" v-show="dropdownOpen2">
                  <div class="dropdown-item" v-for="(item, index) in sortedItems2" :key="index" @click="selectItem2(item)">
                      {{ item }}
                  </div>
                  </div>
              </div>
          </div>
          <div class="search">
              <div class="upper">
                <div class="checks" v-if="ifShowChecks">
                  <div class="check1">
                    <div>Stock</div>
                    <input
                      type="checkbox"
                      id="stocked"
                      v-model="stocked"
                    />
                  </div>
                  
                  <div class="check2">
                    <div>Non-Stock</div>
                    <input
                      type="checkbox"
                      id="non-stocked"
                      v-model="nonStocked"
                    />
                  </div>

                </div>
                <div class="divider"></div>
                <span>Search</span>
                <input v-model="searchText" type="text" placeholder="Pevious/New Model No.">
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
              <th v-for="(header, index) in loginMode === 'Tsubakimoto' ? headers_tsubaki : headers" :key="index">
                  {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in loginMode === 'Tsubakimoto' ? items_tsubaki : items" :key="index" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
              <td>
                <input class="checker" type="checkbox" name="fruit" value="orange" v-model="item.checked" @change="handleSelect(item)">
              </td>
              <td>{{ item.category }}</td>
              <td>{{ (item.partNo != null && item.partNo != '-') ? (Number(item.partNo) > 9999 ? String(item.partNo).padStart(5, '0') : String(item.partNo).padStart(4, '0'))  : '' }}</td>
              <td>{{ item.oldModelNo }}</td>
              <td>{{ item.newModelNo }}</td>
              <td>{{ item.unit }}</td>
              <td v-if="loginMode === 'Tsubakimoto'">{{ item.poPrice }}</td>
              <td v-if="loginMode === 'Tsubakimoto'">{{ item.thbCost }}</td>
              <td v-if="loginMode === 'Tsubakimoto'">{{ item.unitPrice == 'Quotation' || item.unitPrice == null || item.unitPrice == '' ? '' :  item.gp }}</td>
              <!-- <td>{{ (this.formatNumberWithCommas(item.unitPrice, 2) != '0.00' ? this.formatNumberWithCommas(item.unitPrice * 1.1, 2) : null) || 'Quotation' }}</td> -->
               <td>Please add quantity</td>
              <td>{{ item.detail }}</td>
              <td>{{ item.priceListName }}</td>
              <td :class="{blue: item.unit}" @click="rppButtonClick(item)">
                <a href="http://202.149.101.188:1110/" v-if="item.stockReference === 'YES'" target='_blank'>RPP</a>
              </td>
            </tr>
          </tbody>
        </table>  
      </div>
      <div class="empty-warning" v-show="ifShowEmpty">Sorry, we couldn't find any products that match your search criteria.</div>

      <div class="slider-wrapper">
        <!-- 左侧按钮 -->
        <button class="slider-btn" @click="goToPage(sliderPage - 10)"><i class="fas fa-backward"></i></button>
        <button class="slider-btn" @click="goToPage(sliderPage - 1)"><i class="fas fa-chevron-left"></i></button>
        <input 
          type="range"
          :min = "1"
          :max = "totalPages"
          v-model="sliderPage"
          @change="goToPage(sliderPage)"
          class="slider"
        >
        <!-- 右侧按钮 -->
        <button class="slider-btn" @click="goToPage(sliderPage + 1)"><i class="fas fa-chevron-right"></i></button>
        <button class="slider-btn" @click="goToPage(sliderPage + 10)"><i class="fas fa-forward"></i></button>

        <div class="page-text">Page: {{ this.sliderPage }} / {{ this.totalPage }}</div>
        <div class="part-text">{{ rangeText }}</div>
        <div class="total-text">Total Part Amount: {{ this.totalItems }}</div>
      </div>

      <div class="modal-mask" v-if="showModal">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <form>
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
                  <label class="unit">New Model No.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;{{newCode}}<br><br>Previous Model No.: &nbsp;&nbsp;&nbsp;&nbsp;{{oldCode}}</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="modal-default-button1" @click="showModalBack">Close</button>
              <div @click.prevent="!modalButtonDisabled && addProductNormal()">
                <button class="modal-default-button2" :disabled="modalButtonDisabled">Add to Quotation</button>
              </div>               
            </div>
          </div>
        </div>
      </div>

      <div class="modal-mask2" v-if="showModal2">
        <div class="modal-wrapper2">
          <div class="modal-container2">
            <div class="modal-body2">
              <!-- <div class="title">Links/FT Information</div> -->
              <div class="name-qty">
                <div class="name">{{newCode}}</div>
                
              </div>
              <div class="details">
                <div class="detail-left">
                  <div><strong>NEW Model No.:</strong> {{newCode}}</div>
                  <div><strong>Previous Model No.:</strong> {{oldCode}}</div>
                  <div class="category-dropdown">
                      <div class="category-title">Price List Name: {{ priceListName }}</div>
                      <!-- <div class="category-select">
                          <div class="selected" @click="toggleCategoryDropdown">{{ selectedCategoryItem }}</div>
                          <div class="dropdown-list" v-show="categoryDropdownOpen">
                              <div class="dropdown-item" v-for="(item, index) in categoryItems" :key="index" @click="selectCategoryItem(item)">
                                  {{ item }}
                              </div>
                          </div>
                      </div> -->
                  </div>
                  <div class="linknum-area">
                      <div class="linknum-label">No. of Link</div>
                      <input type="text" class="linknum-input" name="lsk" v-model.number="inputBoxLinkQty" @input="inputLinkQty" @focusout="inputLinkQty">
                        <div class="linknum-unit">Link(s)</div>
                        <div class="red-label">Maximum Length = {{ this.maxLinks }} LKS/PC</div>
                        <div v-show="false" class="red-label">Attachment Unit: {{ this.stat }}</div>
                  </div>
                  <div class="a-dropdown" @mouseleave="hideADropdown">
                      <div class="a-label">End-link A side:</div>
                      <div class="a-select">
                          <div class="selected" @click="toggleADropdown">{{ selectedAItem }}</div>
                          <div class="dropdown-list" v-show="aDropdownOpen">
                              <div class="dropdown-item" v-for="(item, index) in aItems" :key="index" @click="selectAItem(item)">
                                  {{ item }}
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="b-dropdown" @mouseleave="hideBDropdown">
                      <div class="b-label">End-link B side:</div>
                      <div class="b-select">
                          <div class="selected" @click="toggleBDropdown">{{ selectedBItem }}</div>
                          <div class="dropdown-list" v-show="bDropdownOpen">
                              <div class="dropdown-item" v-for="(item, index) in bItems" :key="index" @click="selectBItem(item)">
                                  {{ item }}
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="offset-dropdown" @mouseleave="hideOffsetDropdown">
                      <div class="offset-label">Other offset link:</div>
                      <div class="offset-select">
                          <div class="selected" @click="toggleOffsetDropdown">{{ selectedOffsetItem ? selectedOffsetItem : '---'}}</div>
                          <div class="dropdown-list" v-show="offsetDropdownOpen">
                              <div class="dropdown-item" v-for="(item, index) in offsetItems" :key="index" @click="selectOffsetItem(item)">
                                  {{ item }}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

                <div class="detail-right">
                  <div class="radio-text">Additional Requests:</div>
                  <div class="radios">
                    <label>
                      <input type="radio" value="option2" v-model="selectedOption" :disabled="!isEnabledNoOption">
                      <span>&nbsp;No Opthion</span>
                    </label>
                    <label>
                      <input type="radio" value="option1" v-model="selectedOption" :disabled="!isEnabledLongLength">
                      <span>&nbsp;Long Length (T)</span>                      
                    </label>                     
                  </div>
                  <div class="remark-text">Other options, please contact TTCL</div>
                </div>
              </div>
            </div>

            <div class="finalcode-area">
              <div class="final-left">
                <div class="final-label">Chain Formation:</div>
                <div class="final-code">{{ this.chainFormation }}</div>
              </div>
            </div>

            <div class="finalcode-area">
              <div class="final-left">
                <div class="final-label">Chain Unit Price:</div>
                <div class="final-code">{{ this.formatNumberWithCommas(this.formationPrice.toFixed(2), 2) }} THB</div>
              </div>
            </div>

            <div class="finalcode-area">
              <div class="final-left">
                  <div class="final-label">New Chain Number:</div>
                  <div class="final-code">{{ this.newChainNo }}</div>
              </div>
              <div class="final-right">
                  <div class="qty-label">Quantity:</div>
                  <input class="qty-input" type="text" name="qty" v-model.number="orderQty" @input="inputOrderQty">
                  <div class="qty-unit">PC</div>
              </div>
            </div>

            <hr class="hr" />

            <div class="modal-footer2">
              <button class="modal2-default-button1" @click="showModal2 = false">Close</button>

              <button class="modal2-default-button2" @click.prevent="!modalButtonDisabled2 && addProductChain()" :disabled="modalButtonDisabled2">Add to Quotation</button>

         
              <!--<button class="modal2-default-button3" @click="showModal2 = false">Done</button>-->
                            
            </div>
          </div>
        </div>
      </div>

    
      <FooterBtn2 class="footer" :ifShow1="isShow1" :ifShow2="ifShow2" :toWhere="previousPage" :switchTo="switchTo" :switchLabelText="switchLabelText" :clickFunction="handleClick" :isButtonDisabled="isButtonDisabled" />
  </div>
</template>

<style scoped lang="less">
.selection {
  //max-width: 100vw;
  width: 100%;
  margin: 0 auto;
  .mainNav {
    display: flex;
    align-items: center;
    margin-top: 15px;
    padding-left: 6vw;
    padding-right: 6vw;
    justify-content: space-between;
    .dropdown {
      margin-left: 0;
      margin-right: 0;
      width: 22vw;

      .title{
        background-color: #53C5F4;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: white;
        font-size: 18px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加轮廓阴影 */
      }
      
      .custom-select {
            position: relative;
            display: inline-block;
            width: 22vw;
            height: 35px;
            border-radius: 5px;
            //background-color: #E7E6E6;
            background-color: #E9EBF5;
            cursor: pointer;
            margin-top: 1px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加轮廓阴影 */

            .selected {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                padding: 0 20px 0 20px;
                font-size: 15px;
                color: #333;
                
            }

            .selected::after {
            content: '';
                display: inline-block;
                margin-top: 1px;
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-top: 7px solid #333;
            }
            .dropdown-list {
                position: absolute;
                top: 100%;
                left: 0;
                z-index: 1;
                width: 100%;
                max-height: 60vh;
                overflow-y: auto;
                //background-color: #E7E6E6;
                background-color: #E9EBF5;
                border-radius: 5px;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                .dropdown-item {
                    height: 40px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    font-size: 15px;
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
          .checks {
            display: flex;
            justify-content:center; /* 横向居中 */
            align-items: center;     /* 纵向居中 */

            .check1 {
              display: flex;
              div {
                font-size: 20px;
                font-weight: 550;
              }
              #stocked {
                width: 20px;
                height: 20px;
                margin-left: 3px;
                margin-right: 20px;
              }
            }

            .check2{
              display: flex;
              div {
                font-size: 20px;
                font-weight: 550;
              }
              #non-stocked {
                width: 20px;
                height: 20px;
                margin-left: 3px;
                margin-right: 40px;
              }
            }

          }
          
          .divider {
              width: 13vw;
          }

        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          font-size: 19px;
          font-weight:550;
        }
        input{
          width: 20vw;
          height: 50px;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 17px;
          color: #333;
          margin-left: 30px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加轮廓阴影 */
          transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
            &:hover {
                background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
            }

            &:focus {
                outline: none; /* 去除默认的聚焦边框 */
                box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.5); /* 聚焦时的轮廓阴影 */
            }
        }
        button{
          width: 8vw;
          height: 50px;
          margin-left: 30px;
          vertical-align: bottom;
          background-color: #53C5F4;
          color: white;

          border-radius: 5px;
          border: none;
          cursor: pointer;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
          transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

          span{
            position: relative;
            top: 0;
            left: 0;
            transition: top 0.2s ease, left 0.2s ease;
            font-size: 18px;
          }

          &:hover{
            background-color: #0E9BD8;
            transform: translate(3px, 3px);

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
    height: calc(63vh - 20px);

    overflow-y: scroll;
    margin-top: 15px;
    // display: flex;
    // justify-content: center; 
    margin-right: 40px;
    margin-left: 40px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

    table {
      width: 100%;
      //padding-right: 0;
      font-size: 14px;
      border-collapse: collapse;

      .sticky-header {
        position: sticky;
        top: 0;
        opacity: 1;
      
        th {
          background-color: #00AAEE;
          color: white;
          height: 50px;
          overflow: hidden;
          word-wrap: break-word;
          text-overflow: ellipsis;
          max-width: 120px;
          min-width: 20px;
          cursor: pointer;
          padding: 0 2px;
          border-right: 1px solid white;
          &:last-child {
            border-right: none;
          }

          &:hover {
            text-decoration: underline;
          }
        }
      }

      
      tbody {
        tr {
          border: 2px solid white;
          td {
            border-right: 1px solid white;
            &:last-child {
              border-right: none;
            }

            padding: 10px;
            overflow: hidden;
            word-wrap: break-word;
            text-overflow: ellipsis;
            max-width: 160px;
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

  .slider-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 20px 40px;

    .slider-btn {
      background-color: #00AAEE;
      border: none;
      border-radius: 6px;
      padding: 5px 10px;
      font-size: 18px;
      font-weight: bold;
      color: white;
      cursor: pointer;
      transition: transform 0.1s, background-color 0.3s;
      margin: 0 5px;

      i {
        font-size: 15px;
      }

      &:hover {
        background-color: #007bbd;
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }


    .slider {
      -webkit-appearance: none;
      flex: 6;
      height: 14px;
      border-radius: 10px;
      background: linear-gradient(to right, #51bfea, #00AAEE);
      box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.35);
      outline: none;
      transition: background 0.3s;
      cursor: pointer;

      &:hover {
        background: linear-gradient(to right, #51bfea, #00AAEE);
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ffffff, #959494);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        transition: transform 0.2s;
      }

      &::-webkit-slider-thumb:hover {
        transform: scale(1.3);
      }

      &::-moz-range-thumb {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ffffff, #959494);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        transition: transform 0.2s;
      }
      &::-moz-range-thumb:hover {
        transform: scale(1.3);
      }

    }
    .page-text {
      min-width: 100px;
      font-weight: bold;
      flex: 0.5;
      text-align: right;
      font-size: 15px;
    }
    .part-text {
      min-width: 100px;
      font-weight: bold;
      flex: 0.7;
      text-align: right;
      font-size: 15px;
      white-space: nowrap;
    }
    .total-text {
      min-width: 100px;
      font-weight: bold;
      flex: 1.4;
      text-align: right;
      font-size: 15px;
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
              border: 1px solid grey;
              border-radius: 4px;
              transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
              &:hover {
                  background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
              }

              &:focus {
                  outline: none; /* 去除默认的聚焦边框 */
                  box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
              }
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
            background: #0082B3;
            transform: translate(3px, 3px);
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
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
          }

          .modal-default-button2 {
            float: right;
            margin-right: 30px;
            width: 200px;
            height: 30px;
            background: #00AAEE;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

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
        width: 950px;
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
            margin-top: 10px;
          
            .name{
              font-size: 23px;
              font-weight: bold;
            }
          }

          .details{
            display: flex;
            align-items:normal;
            justify-content: space-between;
            margin-top: 20px;
            position: relative;
            .detail-left{
              text-align: left;
              //padding-top: 16px;
              
              div{
                margin-bottom: 5px;
                font-weight:500;
                font-size: 14px;
              }

              .category-dropdown{
                  font-size: 14px;
                  margin-top: 20px;

                  .category-title{
                      font-weight: bold;
                  }

                  .category-select {
                      position: relative;
                      display: inline-block;
                      width: 250px;
                      height: 30px;
                      border-radius: 5px;
                      background-color: #E7E6E6;
                      cursor: pointer;
                      margin-top: 1px;
                      margin-left: -10px;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                      .selected {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          height: 100%;
                          padding: 0 10px 0 10px;
                          font-size: 14px;
                          color: #333;                         
                      }

                      .selected::after {
                      content: '';
                          display: inline-block;
                          margin-top: 1px;
                          width: 0;
                          height: 0;
                          border-left: 5px solid transparent;
                          border-right: 5px solid transparent;
                          border-top: 5px solid #333;
                      }
                      .dropdown-list {
                          position: absolute;
                          top: 100%;
                          left: 0;
                          z-index: 1;
                          width: 100%;
                          max-height: 250px;
                          overflow-y: auto;
                          background-color: #E7E6E6;
                          border-radius: 5px;
                          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                          .dropdown-item {
                              height: 30px;
                              padding: 0 20px;
                              display: flex;
                              align-items: center;
                              font-size: 14px;
                              color: #333;
                              cursor: pointer;
                              justify-content: start;
                          }

                          .dropdown-item:hover {
                              background-color: white;
                          }
                      }
                  }
              }

              .linknum-area{
                  display: flex;
                  justify-content: start;
                  align-items: center;
                  margin-top: 20px;

                  .linknum-label{
                      font-size: 14px;
                      font-weight: bold;

                      display: flex;
                      align-items: center;
                  }
                  .linknum-input{
                      font-size: 16px;
                      height: 30px;
                      width: 130px;
                      text-align: right;
                      background: #E7E6E6;
                      border-radius: 5px;
                      border: 1px solid #2b2a2a;
                      padding: 0 5px;
                      margin-left: 40px;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                      transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                      &:hover {
                          background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
                      }

                      &:focus {
                          outline: none; /* 去除默认的聚焦边框 */
                          box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                      }
                  }
                  .linknum-unit{
                      font-size: 14px;
                      font-weight: bold;
                      display: flex;
                      align-items: center;
                      margin-left: 10px;
                  }
                  .red-label{
                      font-size: 17px;
                      color: red;
                      font-weight: bold;
                      margin-left: 30px;
                  }
              }

              .a-dropdown{
                  font-size: 14px;
                  margin-top: 20px;
                  display: flex;
                  justify-content: start;
                  align-items: center;

                  .a-label{
                      font-weight: bold;
                  }

                  .a-select {
                      position: relative;
                      display: inline-block;
                      width: 125px;
                      height: 30px;
                      border-radius: 5px;
                      background-color: #E7E6E6;
                      cursor: pointer;
                      margin-top: 1px;
                      margin-left: 10px;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                      .selected {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          height: 100%;
                          padding: 0 10px 0 10px;
                          font-size: 14px;
                          color: #333;                         
                      }

                      .selected::after {
                      content: '';
                          display: inline-block;
                          margin-top: 1px;
                          width: 0;
                          height: 0;
                          border-left: 5px solid transparent;
                          border-right: 5px solid transparent;
                          border-top: 5px solid #333;
                      }
                      .dropdown-list {
                          position: absolute;
                          top: 100%;
                          left: 0;
                          z-index: 1;
                          width: 100%;
                          max-height: 250px;
                          overflow-y: auto;
                          background-color: #E7E6E6;
                          border-radius: 5px;
                          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                          .dropdown-item {
                              height: 30px;
                              padding: 0 20px;
                              display: flex;
                              align-items: center;
                              font-size: 14px;
                              color: #333;
                              cursor: pointer;
                              justify-content: start;
                          }

                          .dropdown-item:hover {
                              background-color: white;
                          }
                      }
                  }
              }

              .b-dropdown{
                  font-size: 14px;
                  margin-top: 20px;
                  display: flex;
                  justify-content: start;
                  align-items: center;

                  .b-label{
                      font-weight: bold;
                  }

                  .b-select {
                      position: relative;
                      display: inline-block;
                      width: 125px;
                      height: 30px;
                      border-radius: 5px;
                      background-color: #E7E6E6;
                      cursor: pointer;
                      margin-top: 1px;
                      margin-left: 10px;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                      .selected {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          height: 100%;
                          padding: 0 10px 0 10px;
                          font-size: 14px;
                          color: #333;                      
                      }

                      .selected::after {
                      content: '';
                          display: inline-block;
                          margin-top: 1px;
                          width: 0;
                          height: 0;
                          border-left: 5px solid transparent;
                          border-right: 5px solid transparent;
                          border-top: 5px solid #333;
                      }
                      .dropdown-list {
                          position: absolute;
                          top: 100%;
                          left: 0;
                          z-index: 1;
                          width: 100%;
                          max-height: 250px;
                          overflow-y: auto;
                          background-color: #E7E6E6;
                          border-radius: 5px;
                          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                          .dropdown-item {
                              height: 30px;
                              padding: 0 20px;
                              display: flex;
                              align-items: center;
                              font-size: 14px;
                              color: #333;
                              cursor: pointer;
                              justify-content: start;
                          }

                          .dropdown-item:hover {
                              background-color: white;
                          }
                      }
                  }
              }

              .offset-dropdown{
                  font-size: 14px;
                  margin-top: 20px;
                  margin-bottom: 20px;
                  display: flex;
                  justify-content: start;
                  align-items: center;

                  .offset-label{
                      font-weight: bold;
                      margin-left: -5px;
                  }

                  .offset-select {
                      position: relative;
                      display: inline-block;
                      width: 125px;
                      height: 30px;
                      border-radius: 5px;
                      background-color: #E7E6E6;
                      cursor: pointer;
                      margin-top: 1px;
                      margin-left: 10px;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                      .selected {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          height: 100%;
                          padding: 0 10px 0 10px;
                          font-size: 14px;
                          color: #333;                          
                      }

                      .selected::after {
                      content: '';
                          display: inline-block;
                          margin-top: 1px;
                          width: 0;
                          height: 0;
                          border-left: 5px solid transparent;
                          border-right: 5px solid transparent;
                          border-top: 5px solid #333;
                      }
                      .dropdown-list {
                          position: absolute;
                          top: 100%;
                          left: 0;
                          z-index: 1;
                          width: 100%;
                          max-height: 250px;
                          overflow-y: auto;
                          background-color: #E7E6E6;
                          border-radius: 5px;
                          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                          .dropdown-item {
                              height: 30px;
                              padding: 0 20px;
                              display: flex;
                              align-items: center;
                              font-size: 14px;
                              color: #333;
                              cursor: pointer;
                              justify-content: start;
                          }

                          .dropdown-item:hover {
                              background-color: white;
                          }
                      }
                  }
              }
            }

            .detail-right{
              width: 305px;
              text-align: left;
              position: absolute;

              top: 200px;
              left: 300px;
              .radio-text{
                font-size: 16px;
              }
              .radios{
                label{
                  margin-top: 10px;
                  font-size: 13px;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  transition: background-color 0.1s ease;

                  &:hover {
                    background-color: #cfdff7;
                  }

                  span{
                    vertical-align: middle;
                    display: inline-block;
                    height: 16px;
                    line-height: 16px;
                    margin-left: 10px;
                    color: red;
                    font-weight: bold;

                  }
                  input[type="radio"]{
                    appearance: none;
                    position: relative;
                    margin: 2px 3px 2px 20px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 1px solid #4472C4;
                    background-color: #E7E6E6;
                    //transition: all 0.2s ease;
                    cursor: pointer;

                    &::before, &::after{
                      content: "";
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    }

                    &::before{
                      width: 8px;
                      height: 8px;
                      border-radius: 50%;
                      background-color: #E7E6E6;
                      //transition: all 0.2s ease;
                    }

                    &:checked::before{
                      background-color: #4472C4;
                      width: 8px;
                      height: 8px;
                    }

                    &:disabled {
                      border-color: #ccc;
                      background-color: #f5f5f5;
                      cursor: not-allowed;
                    }

                    &:disabled + span {
                      color: #999;
                    }

                  }

                }
              }
              .remark-text{
                  font-size: 12px;
                  font-weight: bold;
                  color: red;
                  margin-top: 13px;
              }
            }
            
          }

        }

        .finalcode-area{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 40px;
          margin-right: 40px;
          margin-top: 20px;

          .final-left{
              display: flex;
              justify-content: left;
              align-items: center;
              .final-label{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #00AAEE;
                  font-size: 16px;
                  font-weight: bold;
                  color: white;
                  width: 180px;
                  height: 30px;
                  border-radius: 5px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
              }
              .final-code{
                  margin-left: 15px;
                  font-size: 16px;
                  font-weight: bold;
              }
          }

          .final-right{
              display: flex;
              justify-content: right;
              align-items: center;
              .qty-label{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #00AAEE;
                  font-size: 16px;
                  font-weight: bold;
                  color: white;
                  width: 100px;
                  height: 30px;
                  border-radius: 5px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
              }

              .qty-input{
                  font-size: 16px;
                  height: 30px;
                  width: 120px;
                  text-align: right;
                  background: #E7E6E6;
                  border-radius: 5px;
                  border: 1px solid #2b2a2a;
                  padding: 0 5px;
                  margin-left: 10px;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 阴影效果
                  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                  &:hover {
                      background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
                  }

                  &:focus {
                      outline: none; /* 去除默认的聚焦边框 */
                      box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                  }
              }

              .qty-unit{
                  font-size: 17px;
                  font-weight: bold;
                  margin-left: 10px;
              }
          }
        }

        .hr{
          border-style: dashed;
          border-width: 1px 0;
          margin: 30px 30px 1% 30px;
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
            background: #0082B3;
            transform: translate(3px, 3px);
          }
          .modal2-default-button1 {
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
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
          }

          .modal2-default-button2 {
            position: absolute;
            float: right;
            right: 25px;
            top: 0;
            width: 200px;
            height: 30px;
            background: #00AAEE;
            border-radius: 3px;
            font-size: 17px;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

            &:disabled{
              pointer-events: none;
              background-color: #BFBFBF;
              user-select: none          
            }
          }

          
          //.modal2-default-button3 {
          //  position: absolute;
          //  float: right;
          //  right: 30px;
          //  width: 150px;
          //  height: 30px;
          //  background: #00AAEE;
          //  border-radius: 3px;
          //  font-size: 17px;
          //  color: white;
          //  border: none;
          //  cursor: pointer;
          //}
        }
      }
    }
  }


  // .footer{
  //   position: absolute;
  // }
}

</style>

<script>
// @ is an alias to /src
import LogoBanner2 from '@/components/LogoBanner2.vue'
import FooterBtn2 from '@/components/FooterBtn2.vue'

import config from '@/config'
import axios from 'axios'

import store from '@/store';

import '@fortawesome/fontawesome-free/css/all.css';

import qs from 'qs';

export default {
name: 'ChainCutting',

data(){
  return{
      MODE: 0,

      isEnabledLongLength: true,
      isEnabledNoOption: true,

      windowHeight: window.innerHeight,

      title: "Chain Cutting & Assembly at TTCL Warehouse",
      isShow1: true,
      ifShow2: true,
      previousPage: '/selection',
      switchTo: '/onlinepricelist',
      switchLabelText: 'Online Price List',
      isButtonDisabled: true,
      modalButtonDisabled: true,
    
      selectedItem1: '',
      selectedId1: null,
      selectedItem2: '',
      selectedCategoryItem: 'Drive Chain',
      selectedAItem: '---',
      selectedBItem: '---',
      selectedOffsetItem: '',

      searchText: '',


      totalItems: 0,
      pageSize: 100,
      sliderPage: 1,
      totalPage: 1,

      // items1: ['--', 'KTE', 'TKT', 'HRD', 'PLANET', 'NICHIDEN'],
      // items2: ['--', 'THB DRICE CHAIN', 'PRICE LIST NAME 2', 'PRICE LIST NAME 3', 'PRICE LIST NAME 4'],
      items1: [null, '--'],
      items2: ['--'],

      ruleRows: [],
      connListForRef: [],
      //categoryItems: ['Drive chain', 'Small size conveyor chain', 'Large size conveyor chain', 'Cableveyors', 'Top chains(ST/RT)', 'Top chains(RS)', 'Top chains(TS/TSA)'],
      aItems: ['MWJ', 'MWJK', 'MCJ', 'MCJK', 'MSJ', 'MSJK', 'FWJ', 'FCJ', 'FSJ'],
      bItems: ['R'],
      offsetItems: ['---', '2O', '2OK', '4O', '4OK', 'O', 'OK', 'R'],

      showWarning: false,
      dropdownOpen1: false,
      dropdownOpen2: false,
      //categoryDropdownOpen: false,
      aDropdownOpen: false,
      bDropdownOpen: false,
      offsetDropdownOpen: false,

      ifShowEmpty: false,
      
      cartCount: 0,

      headers: [
          'Select',
          'Category',
          'Part No.',
          'Previous Model No.',
          'New Model No.',
          'Unit',
          'Unit Price (THB)',
          'Detail',
          'Price List Name',
          'Stock Reference (RPP)',
      ],

      items: [],

      headers_tsubaki: [
          'Select',
          'Category',
          'Part No.',
          'Previous Model No.',
          'New Model No.',
          'Unit',
          '(TTCL Internal Use) PO Price',
          '(TTCL Internal Use) THB Cost',
          '(TTCL Internal Use) GP',
          'Unit Price (THB)',
          'Detail',
          'Price List Name',
          'Stock Reference (RPP)',
      ],

      items_tsubaki: [],

      newCode: '',
      oldCode: '',
      priceListName: '',
      standardLinks: '',
      maxLinks: '',
      calCase: '',
      stat: '',
      unitPriceNum: 0,

      newChainNo: '',

      // addMiddle: '____',

      showModal: false,
      showModal2: false,

      apiUrl: config.apiUrl,

      prevCheckedId: null,

      selectedOption: 'option2',

      lskQty: 0,
      inputBoxLinkQty: 0,

      orderQty: 0,
      //companyName: '',
      //personName: '',

      selectedDataLine: null,

      addedDataList: [],

      // showBtnBackQuotation: false,

      qtyUnit: 'Link',

      showRadios: false,

      isEven: true,

      isReadOnly: false,

      ifShowDistributors: true,

      stocked: true,
      nonStocked: true,

      ifShowChecks: true,

      connPriceData: [],

      lskQtyAfterLeave: '',

      refDataLine: {},
  }
},

computed: {
  sortedItems2 () {
    return [...this.items2].sort((a, b) => 
      a.localeCompare(b, 'en', { sensitivity: 'base' }));
  },

  loginMode() {
    return this.$store.getters.getLoginMode;
  },

  totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  },

  rangeText() {
    const start = (this.sliderPage - 1) * this.pageSize + 1;
    let end = this.sliderPage * this.pageSize;
    if (end > this.totalItems) end = this.totalItems;
    return `Part: ${start} - ${end}`;
  },

  formationPrice() {
    //console.log('888888888', this.connPriceData);
    var lskQtyInt = parseInt(this.lskQty);
    if (lskQtyInt === 0) {
      return 0;
    }
    //console.log(this.selectedAItem, this.selectedBItem, this.selectedOffsetItem);
    if (this.calCase?.trim().toUpperCase() === "DRIVE CHAIN" || this.calCase?.trim().toUpperCase() === "SMALL SIZE") {
      if (this.selectedAItem && this.selectedAItem !== '---') {
        if ((this.selectedBItem !== '---' && this.selectedOffsetItem === '---') || (this.selectedBItem === '---' && this.selectedOffsetItem !== '---')) {
          var count = 0;
          for (const each of [this.selectedAItem, this.selectedBItem, this.selectedOffsetItem]) {
            console.log(each)
            if (each === 'R') {
              count += 1;
            }
          }
          console.log(count)
          const result = 1.1 * (lskQtyInt + count - 1) * this.unitPriceNum
            + (this.selectedAItem === '---' ? 0 : parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedAItem)?.unit_price) || 0)
            + (this.selectedBItem === '---' ? 0 : parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedBItem)?.unit_price) || 0)
            + (this.selectedOffsetItem === '---' ? 0 : parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedOffsetItem)?.unit_price) || 0);
          console.log('case 2')
          //console.log((lskQtyInt - 1) * this.unitPriceNum, (this.selectedBItem === '---' ? 0 : parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedBItem)?.unit_price) || 0), (this.selectedOffsetItem === '---' ? 0 : parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedOffsetItem)?.unit_price) || 0))
          return result;

        } else if (this.selectedBItem !== '---' && this.selectedOffsetItem !== '---') {
          let result;
          if (this.selectedOffsetItem === '4O' || this.selectedOffsetItem === '4OK') {
            result = 1.1 * (lskQtyInt - 5) * this.unitPriceNum 
            + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedAItem)?.unit_price) || 0)
            + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedBItem)?.unit_price) || 0)
            + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedOffsetItem)?.unit_price) || 0);
          } else {
            result = 1.1 * (lskQtyInt - 3) * this.unitPriceNum 
            + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedAItem)?.unit_price) || 0)
            + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedBItem)?.unit_price) || 0)
            + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedOffsetItem)?.unit_price) || 0);
          }
          //console.log('case 3')
          //console.log((lskQtyInt - 3) * this.unitPriceNum, (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedAItem)?.unit_price) || 0), (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedOffsetItem)?.unit_price) || 0))
          return result;
        }
      }
    } else if (this.calCase?.trim().toUpperCase() === "TOPCHAIN") {
      if (this.selectedOffsetItem !== '---') {
        const result = 1.1 * (lskQtyInt - 1) * this.unitPriceNum + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedOffsetItem)?.unit_price) || 0);
        //console.log('case 6')
        return result;
      }
    } else if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
      const result = lskQtyInt * this.unitPriceNum
        + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedAItem)?.unit_price) || 0)
        + (parseFloat(this.connPriceData.find(item => item.conn_show === this.selectedBItem)?.unit_price) || 0);
      //console.log('case 7')
      return result;
    }
    
    else {
      const result = 1.1 * lskQtyInt * this.unitPriceNum;
      //console.log('case other')
      return result;
    }

    return 1.1 * lskQtyInt * this.unitPriceNum;
  },

  chainFormation() {
    if (this.newCode.startsWith('AL') || this.newCode.startsWith('BL')) {
      return '';
    }

    var lskQtyInt = parseInt(this.lskQty);

    if (this.stat === 1) {
      this.lskQtyAfterLeave = this.lskQty;
      if (this.maxLinks === null) {
        this.isEnabledLongLength = false;
        this.selectedOption = 'option2';

        if (this.standardLinks === null) {
          if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
            this.isEnabledLongLength = false;
            this.isEnabledNoOption = true;
            this.selectedOption = 'option2';
          } else {
            this.isEnabledLongLength = false;
            this.isEnabledNoOption = false;
            this.selectedOption = '';
          }
          //return `${lskQtyInt} (LKS)/PC x 1 PC`;
          return '';
        } else {
          const res = lskQtyInt % parseInt(this.standardLinks) !== 0 ? (Math.floor(lskQtyInt / parseInt(this.standardLinks)) !== 0 ? `${this.standardLinks} (LKS)/PC x ${Math.floor(lskQtyInt / parseInt(this.standardLinks)) * this.orderQty} PC,
          ${lskQtyInt % parseInt(this.standardLinks)} (LKS)/PC x ${this.orderQty} PC` : `${lskQtyInt % parseInt(this.standardLinks)} (LKS)/PC x ${this.orderQty} PC`) : `${this.standardLinks} (LKS)/PC x ${Math.floor(lskQtyInt / parseInt(this.standardLinks)) * this.orderQty} PC`;
          return res;
        }

      } else if (this.standardLinks === null) {
        if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
          this.isEnabledLongLength = false;
          this.isEnabledNoOption = true;
          this.selectedOption = 'option2';
        } else {
          this.isEnabledLongLength = false;
          this.isEnabledNoOption = false;
          this.selectedOption = '';
        }
        //return `${lskQtyInt} (LKS)/PC x 1 PC`;
        return '';
      } else {
        if (parseInt(this.standardLinks) > parseInt(this.maxLinks)) {
          this.standardLinks = this.maxLinks;
        }

        if (lskQtyInt > parseInt(this.maxLinks) || lskQtyInt <= parseInt(this.standardLinks)) {
          this.isEnabledLongLength = false;
          this.isEnabledNoOption = true;
          this.selectedOption = 'option2';
          const res = lskQtyInt % parseInt(this.standardLinks) !== 0 ? (Math.floor(lskQtyInt / parseInt(this.standardLinks)) !==0 ? `${this.standardLinks} (LKS)/PC x ${Math.floor(lskQtyInt / parseInt(this.standardLinks)) * this.orderQty} PC,
          ${lskQtyInt % parseInt(this.standardLinks)} (LKS)/PC x ${this.orderQty} PC` : `${lskQtyInt % parseInt(this.standardLinks)} (LKS)/PC x ${this.orderQty} PC`) : `${this.standardLinks} (LKS)/PC x ${Math.floor(lskQtyInt / parseInt(this.standardLinks)) * this.orderQty} PC`;
          return res;

        } else {
          this.isEnabledLongLength = true;
          this.isEnabledNoOption = true;

          if (this.selectedOption === 'option2') {
            const res = lskQtyInt % parseInt(this.standardLinks) !== 0 ? (Math.floor(lskQtyInt / parseInt(this.standardLinks)) !==0 ? `${this.standardLinks} (LKS)/PC x ${Math.floor(lskQtyInt / parseInt(this.standardLinks)) * this.orderQty} PC,
            ${lskQtyInt % parseInt(this.standardLinks)} (LKS)/PC x ${this.orderQty} PC` : `${lskQtyInt % parseInt(this.standardLinks)} (LKS)/PC x ${this.orderQty} PC`) : `${this.standardLinks} (LKS)/PC x ${Math.floor(lskQtyInt / parseInt(this.standardLinks)) * this.orderQty} PC`;
            return res;
          } else if (this.selectedOption === 'option1') {
            return `${this.lskQty} (LKS)/PC x ${this.orderQty} PC`;
          }
        }
        
      }
      
    } else {
      const nearestMultiple = Math.round(parseInt(this.lskQty) / this.stat) * this.stat;
      this.lskQtyAfterLeave = nearestMultiple.toString();

      let volumn;
      if (this.standardLinks !== null) {
        volumn = this.stat * Math.floor(parseInt(this.standardLinks) / this.stat);
        if (volumn % 2 !== 0) {
          volumn = volumn - this.stat;
        }
      } else {
        volumn = -1;
      }

      if (this.maxLinks === null) {
        this.isEnabledLongLength = false;
        this.selectedOption = 'option2';

        if (this.standardLinks === null) {
          if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
            this.isEnabledLongLength = false;
            this.isEnabledNoOption = true;
            this.selectedOption = 'option2';
          } else {
            this.isEnabledLongLength = false;
            this.isEnabledNoOption = false;
            this.selectedOption = '';
          }
          //return `${lskQtyInt} (LKS)/PC x 1 PC`;
          return '';
        } else {
          const res = lskQtyInt % volumn !== 0 ? (Math.floor(lskQtyInt / volumn) !==0 ? `${volumn} (LKS)/PC x ${Math.floor(lskQtyInt / volumn) * this.orderQty} PC,
          ${lskQtyInt % volumn} (LKS)/PC x ${this.orderQty} PC` : `${lskQtyInt % volumn} (LKS)/PC x ${this.orderQty} PC`) : `${volumn} (LKS)/PC x ${Math.floor(lskQtyInt / volumn) * this.orderQty} PC`;
          return res;
        }

      } else if (this.standardLinks === null) {
        if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
          this.isEnabledLongLength = false;
          this.isEnabledNoOption = true;
          this.selectedOption = 'option2';
        } else {
          this.isEnabledLongLength = false;
          this.isEnabledNoOption = false;
          this.selectedOption = '';
        }
        //return `${lskQtyInt} (LKS)/PC x 1 PC`;
        return '';
      } else {
        if (parseInt(this.standardLinks) > parseInt(this.maxLinks)) {
          this.standardLinks = this.maxLinks;
        }

        if (lskQtyInt > parseInt(this.maxLinks) || lskQtyInt <= volumn) {
          this.isEnabledLongLength = false;
          this.isEnabledNoOption = true;
          this.selectedOption = 'option2';
          const res = lskQtyInt % volumn !== 0 ? (Math.floor(lskQtyInt / volumn) !==0 ? `${volumn} (LKS)/PC x ${Math.floor(lskQtyInt / volumn) * this.orderQty} PC,
          ${lskQtyInt % volumn} (LKS)/PC x ${this.orderQty} PC` : `${lskQtyInt % volumn} (LKS)/PC x ${this.orderQty} PC`) : `${volumn} (LKS)/PC x ${Math.floor(lskQtyInt / volumn) * this.orderQty} PC`;
          return res;

        } else {
          this.isEnabledLongLength = true;
          this.isEnabledNoOption = true;

          if (this.selectedOption === 'option2') {
            const res = lskQtyInt % volumn !== 0 ? (Math.floor(lskQtyInt / volumn) !==0 ? `${volumn} (LKS)/PC x ${Math.floor(lskQtyInt / volumn) * this.orderQty} PC,
            ${lskQtyInt % volumn} (LKS)/PC x ${this.orderQty} PC` : `${lskQtyInt % volumn} (LKS)/PC x ${this.orderQty} PC`) : `${volumn} (LKS)/PC x ${Math.floor(lskQtyInt / volumn) * this.orderQty} PC`;
            return res;
          } else if (this.selectedOption === 'option1') {
            return `${this.lskQty} (LKS)/PC x ${this.orderQty} PC`;
          }
        }
        
      }
    }

    
  },
},

components: {
  LogoBanner2,
  FooterBtn2,
},

watch: {
  // companyName(){
  //   this.isEnableProceedBtn();
  // },
  // personName(){
  //   this.isEnableProceedBtn();
  // },

  selectedItem1(){
    this.checkInputs();
  },
  selectedItem2(){
    this.checkInputs();
  },
  searchText(){
    this.checkInputs();
  },


  selectedCategoryItem(){
      this.updateDropdowns();
      // this.selectedAItem = '---';
      // this.selectedBItem = '---'
  },

  selectedAItem() {
      this.buildBItems();
      this.buildOffsetItems();
      // this.selectedBItem = '---';
      // this.selectedOffsetItem = '---';
      this.createNewChainNo();
  },

  selectedBItem() {
      this.buildOffsetItems();
      // this.selectedOffsetItem = '---';
      this.createNewChainNo();
  },

  selectedOffsetItem() {
      //this.updateDropdowns();
      this.createNewChainNo();
  },

  isEven() {
      this.updateDropdowns();
      // this.selectedAItem = '---';
      // this.selectedBItem = '---'
  },

  lskQty(){
    if (!/^\d+$/.test(this.lskQty)) {
      this.lskQty = 0;
    }

    if (this.lskQty.length > 8) {
      this.lskQty = this.lskQty.slice(0, 8);
    }

    this.isEnableProceedBtn();

    this.updateDropdowns();
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

  selectedOption() {
    this.buildBItems();
    this.createNewChainNo();
  },

  inputBoxLinkQty(newVal) {
    this.lskQty = newVal;
  }
},

async mounted() {
  window.addEventListener('resize', this.handleResize);

  if (this.loginMode === "Tsubakimoto") {
    this.ifShowDistributors = true;
  } else {
    this.ifShowDistributors = false;
    //this.selectedItem1 = "KTE";
  }

  if (this.loginMode === "Tsubakimoto" || this.loginMode === "KTE"){
    this.ifShowChecks = false;  //暂时改过来
  } else {
    this.ifShowChecks = false;
  }

  this.MODE = this.$store.state.MODE;
  if (this.MODE == 0) {
    this.addedDataList = this.$store.state.partList;
    this.cartCount = this.$store.state.partList.length;
    this.previousPage = '/selection';
  } else {
    this.addedDataList = this.$store.state.itemsTargetQuotNo;
    this.refDataLine = this.$store.state.refDataLine;
    this.cartCount = this.$store.state.itemsTargetQuotNo.length;
    this.previousPage = '/editproducts-result';
  }
  
  this.isEnableProceedBtn();
  if (this.ifShowDistributors) {
    await this.fetchFilterOptinons();
    this.fetchMasterData();
  } else {
    this.selectedId1 = this.$store.state.companyId;
    await this.fetchPricelistOptions();
  }
},

beforeUnmount() {
  window.removeEventListener('resize', this.handleResize);
},

methods: {
  formatNumberWithCommas(value, i) {
      const num = Number(value);
      if (isNaN(num)) return value;
      return num.toLocaleString(undefined, { minimumFractionDigits: i, maximumFractionDigits: i });
  },

  moveOutLinksInput() {
    this.lskQty = this.lskQtyAfterLeave;
  },

  async fetchPricelistOptions() {
    const response = await axios.post(`${this.apiUrl}/master_data/get_pricelist_filter`, {
      company_id: this.selectedId1,
    });
    const data = response.data;
    if (data.pricelists && Array.isArray(data.pricelists)) {
      this.items2 = ['--', ...data.pricelists];
    }
    this.selectedItem2 = '';
    this.fetchMasterData();
  },

  async fetchFilterOptinons() {
    const response = await axios.post(`${this.apiUrl}/master_data/get_filters`);

    const data = response.data;
    if (data.distributors && Array.isArray(data.distributors)) {
      this.items1 = [[null, '--'], ...data.distributors];
    }
    //console.log(this.items1)
    if (data.pricelists && Array.isArray(data.pricelists)) {
      this.items2 = ['--', ...data.pricelists];
    }
  },

  async onSliderChange() {
    await this.fetchMasterData(this.sliderPage);
  },

  goToPage(page) {
    const target = Math.min(this.totalPages, Math.max(1, page));
    this.sliderPage = target;
    this.onSliderChange();
  },

  async fetchMasterData(page) {
    this.prevCheckedId = null;
    try {
      const response = await axios.post(`${this.apiUrl}/master_data/list_cutting`, {
        page: page,
        pageSize: this.pageSize,
        priceListNames: this.selectedItem2 != '' ? [this.selectedItem2] : this.items2,
        keyword: this.searchText,
      });

      this.totalItems = response.data.total;
      this.totalPage = Math.ceil(this.totalItems / this.pageSize);
      const rawData = response.data.data;

      this.items_tsubaki = rawData.map(row => {
        const currency = row[11] || '';
        let poPriceRaw = row[10];
        let poPriceFormatted;

        const price = parseFloat(poPriceRaw);

        if (!isNaN(price)) {
          if (currency.toUpperCase().includes('EUR')) {
            poPriceFormatted = `€ ${this.formatNumberWithCommas(price.toFixed(3), 3)}`;
          } else if (currency.toUpperCase().includes('USD')) {
            poPriceFormatted = `$ ${this.formatNumberWithCommas(price.toFixed(2), 2)}`;
          } else if (currency.toUpperCase().includes('JPY')) {
            poPriceFormatted = `¥ ${this.formatNumberWithCommas(Math.round(price), 0)}`;
          } else {
            poPriceFormatted = `${this.formatNumberWithCommas(price.toFixed(3), 3)}`;
          }
        } else {
          poPriceFormatted = poPriceRaw;
        }

        let thbCostRaw = row[13];
        let cost_thb = parseFloat(thbCostRaw);
        let thbCostFormatted = !isNaN(cost_thb)
          ? `฿ ${this.formatNumberWithCommas(Math.round(cost_thb), 0)}`
          : thbCostRaw;

        let gpRaw = row[14];
        let gpNumber = parseFloat(gpRaw);
        let gpFormatted = !isNaN(gpNumber)
          ? `${Math.round(gpNumber * 100)}%`
          : gpRaw;

        let unitPriceRaw = row[23];
        let unitPriceNum = parseFloat(unitPriceRaw);
        let unitPriceFormatted = !isNaN(unitPriceNum)
          ? `${unitPriceNum.toFixed(2)}`
          : unitPriceRaw;

        return {
          category: row[0],
          partNo: row[1],
          oldModelNo: row[2],
          newModelNo: row[3],
          unit: row[4],
          poPrice: poPriceFormatted,
          thbCost: thbCostFormatted,
          gp: gpFormatted,
          unitPrice: unitPriceFormatted,
          unitPriceNum: unitPriceNum,
          detail: row[30],
          priceListName: row[15],
          stockReference: row[28],
          qty: 0,
          checked: false,
          id: row[31],
        };
      });

      this.items = rawData.map(row => {
        let unitPriceRaw = row[23];
        let unitPriceNum = parseFloat(unitPriceRaw);
        let unitPriceFormatted = !isNaN(unitPriceNum)
          ? `${unitPriceNum.toFixed(2)}`
          : unitPriceRaw;

        return {
          category: row[0],
          partNo: row[1],
          oldModelNo: row[2],
          newModelNo: row[3],
          unit: row[4],
          unitPrice: unitPriceFormatted,
          unitPriceNum: unitPriceNum,
          detail: row[30],
          priceListName: row[15],
          stockReference: row[28],
          qty: 0,
          checked: false,
          id: row[31],
        };          
      });

    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  },

  addProductNormal() {
    if (this.MODE == 0) {
      this.selectedDataLine.qty = this.orderQty;
      const newItem = { ...this.selectedDataLine };
      console.log('55555555555', this.addedDataList);
      console.log('11111111111', newItem);
      this.addedDataList.push(newItem);
      this.$store.commit('setPartList', this.addedDataList);
      this.cartCount += 1;
      this.showModal = false;
      this.showModal2 = false;

    } else {
      this.selectedDataLine.qty = this.orderQty;
      const newItem = { ...this.selectedDataLine };
      console.log('55555555555', this.addedDataList);
      console.log('11111111111', newItem);

      const transformedLine = {
        attention: this.refDataLine.attention,
        chain_formation: this.refDataLine.chain_formation,
        create_time: this.refDataLine.create_time,
        customer_ref: this.refDataLine.customer_ref,
        distributor_name: this.refDataLine.distributor_name,
        new_model_no: newItem.newModelNo,
        payment_terms: this.refDataLine.payment_terms,
        pre_model_no: newItem.oldModelNo,
        quantity: Number(newItem.qty),
        quot_no: this.refDataLine.quot_no,
        quot_stat: this.refDataLine.quot_stat,
        quotation_amount: this.refDataLine.quotation_amount,
        remark: this.refDataLine.remark,
        total: this.refDataLine.total,
        unit_price: newItem.unitPrice,
        uom: newItem.unit,
        updated_time: this.refDataLine.updated_time,
        user_id: this.refDataLine.user_id,
      };

      this.addedDataList.push(transformedLine);
      this.$store.commit('setItemsTargetQuotNo', this.addedDataList);
      this.cartCount += 1;
      this.showModal = false;
      this.showModal2 = false;
    }    
  },

  addProductChain() {
    if (this.MODE == 0) {
      this.selectedDataLine.qty = this.orderQty;   

      this.selectedDataLine.newChainNo = this.newChainNo;

      this.selectedDataLine.chainUnitPriceNum = this.formationPrice;
      this.selectedDataLine.chainFormation = this.chainFormation;

      //console.log(this.selectedDataLine,'-------------');
      const newItem = { ...this.selectedDataLine };
      console.log('55555555555', this.addedDataList);
      console.log('11111111111', newItem);
      newItem.unit = 'PC';
      this.addedDataList.push(newItem);
      this.$store.commit('setPartList', this.addedDataList);
      //console.log(this.addedDataList);
      this.cartCount += 1
      this.showModal = false;
      this.showModal2 = false;

    } else {
      this.selectedDataLine.qty = this.orderQty;   

      this.selectedDataLine.newChainNo = this.newChainNo;

      this.selectedDataLine.chainUnitPriceNum = this.formationPrice;
      this.selectedDataLine.chainFormation = this.chainFormation;

      //console.log(this.selectedDataLine,'-------------');
      const newItem = { ...this.selectedDataLine };
      console.log('55555555555', this.addedDataList);
      console.log('11111111111', newItem);
      newItem.unit = 'PC';
      console.log('22222222', this.refDataLine);

      const transformedLine = {
        attention: this.refDataLine.attention,
        chain_formation: newItem.chainFormation,
        create_time: this.refDataLine.create_time,
        customer_ref: this.refDataLine.customer_ref,
        distributor_name: this.refDataLine.distributor_name,
        new_model_no: newItem.newChainNo,
        payment_terms: this.refDataLine.payment_terms,
        pre_model_no: newItem.oldModelNo,
        quantity: Number(newItem.qty),
        quot_no: this.refDataLine.quot_no,
        quot_stat: this.refDataLine.quot_stat,
        quotation_amount: this.refDataLine.quotation_amount,
        remark: this.refDataLine.remark,
        total: this.refDataLine.total,
        unit_price: newItem.unitPrice,
        uom: newItem.unit,
        updated_time: this.refDataLine.updated_time,
        user_id: this.refDataLine.user_id,
      };

      this.addedDataList.push(transformedLine);
      this.$store.commit('setItemsTargetQuotNo', this.addedDataList);
      //console.log(this.addedDataList);
      this.cartCount += 1
      this.showModal = false;
      this.showModal2 = false;
    }     
  },

  //去重工具
  uniqueValues(arr) {
    let mapped = arr.map(v => (v && v !== 'none' ? v : '---'));
    let unique = [...new Set(mapped)];

    let nonIndex = unique.indexOf('---');
    if (nonIndex > -1) {
      unique.splice(nonIndex, 1);  //删除NONE的原位置
      unique.unshift('---'); //插入到最前面
    }

    return unique;
  },

  // 过滤出当前奇偶规则
  getFilteredRules() {
    const eo = this.isEven ? 0 : 1;
    return this.ruleRows.filter(r => Number(r[4]) === eo);  //r.even_odd
  },

  // 生成A列表
  buildAItems() {
    const rows = this.getFilteredRules();
    this.aItems = this.uniqueValues(rows.map(r => r[1]));  //r.connA

    this.selectedAItem = this.aItems[0] ? this.aItems[0] : '---';
  },

  // 生成B列表
  buildBItems() {
    const rows = this.getFilteredRules().filter(r => r[1] === (this.selectedAItem === '---' ? null : this.selectedAItem));
    this.bItems = this.uniqueValues(rows.map(r => r[2]));

    this.selectedBItem = this.bItems[0] ? this.bItems[0] : '---';

    if (this.priceListName?.trim().toUpperCase() === 'DRIVE CHAIN') {
      if (this.standardLinks != null && parseInt(this.inputBoxLinkQty) < this.standardLinks && this.selectedOption === 'option2') {
        if (this.selectedAItem === 'R') {
          this.bItems = ['R'];
          this.selectedBItem = 'R';
        }
      } else if (this.standardLinks != null && this.maxLinks != null && this.standardLinks <= parseInt(this.inputBoxLinkQty) <= this.maxLinks) {
        if (this.selectedOption === 'option2') {
          if (this.selectedAItem === 'R') {
            this.bItems = this.uniqueValues(
              rows.map(r => r[2]).filter(item => item !== 'R')
            );
            this.selectedBItem = this.bItems[0] ? this.bItems[0] : '---';
          } else {
            this.buildOffsetItems();
            this.createNewChainNo();
          }
        } else if (this.selectedOption === 'option1') {
          if (this.selectedAItem === 'R') {
            this.bItems = ['R'];
            this.selectedBItem = 'R';
          }
        }
      } else if (this.maxLinks != null && parseInt(this.inputBoxLinkQty) > this.maxLinks && this.selectedOption === 'option2') {
        if (this.selectedAItem === 'R') {
          this.bItems = this.uniqueValues(
              rows.map(r => r[2]).filter(item => item !== 'R')
            );
            this.selectedBItem = this.bItems[0] ? this.bItems[0] : '---';
        } else {
          this.buildOffsetItems();
          this.createNewChainNo();
        }
      }
    }
  },

  // 生成Offset列表
  buildOffsetItems() {
    const rows = this.getFilteredRules().filter(r => 
      r[1] === (this.selectedAItem === '---' ? null : this.selectedAItem) && r[2] === (this.selectedBItem === '---' ? null : this.selectedBItem)
    );
    this.offsetItems = this.uniqueValues(rows.map(r => r[3]));

    this.selectedOffsetItem = this.offsetItems[0] ? this.offsetItems[0] : '---';
  },

  //主入口
  updateDropdowns() {
    this.buildAItems();
    this.buildBItems();
    this.buildOffsetItems();
  },

  async fetchLinkPrice() {
    if (this.connListForRef.length === 0) {
      this.connPriceData = [];
      return;
    }
    const response = await axios.post(`${this.apiUrl}/endlink_data/get_link_price`,
        {
          base: this.selectedDataLine.newModelNo,
          connList: this.connListForRef,
          pl_name: this.selectedDataLine.priceListName,
          unit: this.selectedDataLine.unit,
        }
    );

    this.connPriceData = response.data.data;

    if (!Array.isArray(this.connPriceData)) {
      this.connPriceData = [];
    }
    //console.log(this.connPriceData);
  },

  async setPullDownLists() {
      try {
        const response = await axios.post(`${this.apiUrl}/endlink_data/by_code`, 
          qs.stringify(
            {
              base: this.selectedDataLine.newModelNo,
              pl_name: this.selectedDataLine.priceListName,
              unit: this.selectedDataLine.unit,
            }
          ),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        const rawData = response.data;
        this.ruleRows = rawData;
        console.log(this.ruleRows)
        
        this.connListForRef = [
          ...new Set(
            rawData
              .flatMap(row => [row[1], row[2], row[3]])
              .filter(v => v !== null && v !== '')
          )
        ];
        //console.log(this.connListForRef)

        this.standardLinks = rawData[0][7];
        this.maxLinks = rawData[0][8];
        //this.inputBoxLinkQty = Number(this.standardLinks) || 0;
        this.inputBoxLinkQty = 0;
        
        this.calCase = rawData[0][9] || '';
        //console.log(this.calCase);

        this.stat = rawData[0][6] || 1;

        if (this.lskQty % 2 === 0){
          this.isEven = true;
        }else{
          this.isEven = false;
        }

        //console.log('jkjkkjkjkjkjkjk', this.standardLinks);
        if (this.standardLinks != null && !isNaN(this.standardLinks)) {
           const boxPriceStr = await this.fetchBaselinkPrice();
           if (boxPriceStr) {
            const beforeRounded = Number(boxPriceStr);
            const boxPrice = beforeRounded.toFixed(2);
            const boxPriceNum = parseFloat(boxPrice);
            this.unitPriceNum = Number((boxPriceNum / Number(this.standardLinks)).toFixed(2));

            //console.log(this.unitPriceNum, '!!!!!!!!', boxPriceNum, typeof(this.unitPriceNum))
           }
           //console.log('++++++++++');
           this.unitPriceNum = Number(this.unitPriceNum.toFixed(2));
        } else {
          this.unitPriceNum = Number(this.unitPriceNum.toFixed(2));
        }

        await this.fetchLinkPrice();

        this.updateDropdowns();

        this.moveOutLinksInput();
        this.createNewChainNo();

      } catch (error) {
        console.error("Error fetching endlink data:", error);
      }
  },

  async fetchBaselinkPrice() {
    try {
      const response = await axios.post(`${this.apiUrl}/cutting-assembly/get-baselink-price`, {
        base: this.selectedDataLine.newModelNo,
        pl_name: this.priceListName,
      });
      if (response.data.data) {
        return response.data.data.unit_price;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching baselink price:", error);
      return null;
    }
  },

  createNewChainNo() {
    if (this.selectedOption === 'option2') {
      if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
        this.newChainNo = this.newCode + '+' + this.lskQty.toString() + 'L';
      } else {
        this.newChainNo = this.newCode + '+' + this.lskQty.toString() + 'L' + (this.selectedAItem !== '---' || this.selectedBItem !== '---' || this.selectedOffsetItem !== '---' ? '-' : '') + (this.selectedAItem === '---' ? '' : this.selectedAItem) + (this.selectedBItem === '---' ? '' : this.selectedBItem) + (this.selectedOffsetItem === '---' ? '' : this.selectedOffsetItem);
      }
    } else {
      if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR") {
        this.newChainNo = this.newCode + '+' + this.lskQty.toString() + 'L' + '-T';
      } else {
        this.newChainNo = this.newCode + '+' + this.lskQty.toString() + 'L' + (this.selectedAItem !== '---' || this.selectedBItem !== '---' || this.selectedOffsetItem !== '---' ? '-' : '') + (this.selectedAItem === '---' ? '' : this.selectedAItem) + (this.selectedBItem === '---' ? '' : this.selectedBItem) + (this.selectedOffsetItem === '---' ? '' : this.selectedOffsetItem) + '-T';
      }
    }
    
  },

  toEditProductsPage() {
    if (this.MODE == 0) {
      this.$store.commit('setPartList', this.addedDataList);
      this.$store.commit('setPreviousPage', '/chaincutting');
      this.$router.push('/editproducts');
    } else {
      this.$store.commit('setItemsTargetQuotNo', this.addedDataList);
      this.$store.commit('setPreviousPage', '/editquotationpage');
      this.$router.push('/editproducts-result');
    }
  },

  handleResize() {
    this.windowHeight = window.innerHeight;
    //console.log(this.windowHeight);
  },

  isEnableProceedBtn(){
    if(this.orderQty==0){
      this.modalButtonDisabled = true;
    }
    else{
      this.modalButtonDisabled = false;
    }
    //console.log(this.modalButtonDisabled);

    if(this.orderQty==0 || this.lskQty==0){
      this.modalButtonDisabled2 =true;
    } else {
      this.modalButtonDisabled2 = false;
    }
  },

  checkInputs(){
    if((this.selectedItem1 && this.selectedItem2) || this.searchText){
      this.showWarning = false;
    }
  },


  searchPrice() {
    this.fetchMasterData();
    this.sliderPage = 1;
  },

  toggleDropdown1() {
    this.dropdownOpen1 = !this.dropdownOpen1;
    //console.log(this.dropdownOpen1);
  },
  toggleDropdown2() {
    this.dropdownOpen2 = !this.dropdownOpen2;
  },

  // toggleCategoryDropdown() {
  //     this.categoryDropdownOpen = !this.categoryDropdownOpen;
  // },

  toggleADropdown() {
      this.aDropdownOpen = !this.aDropdownOpen;
  },

  toggleBDropdown() {
      this.bDropdownOpen = !this.bDropdownOpen;
  },

  toggleOffsetDropdown() {
      this.offsetDropdownOpen = !this.offsetDropdownOpen;
  },

  hideDropdown1(){
    this.dropdownOpen1 = false;
  },

  hideDropdown2(){
    this.dropdownOpen2 = false;
  },

  // hideCategoryDropdown() {
  //     this.categoryDropdownOpen = false;
  // },

  hideADropdown() {
      this.aDropdownOpen = false;
  },

  hideBDropdown() {
      this.bDropdownOpen = false;
  },

  hideOffsetDropdown() {
      this.offsetDropdownOpen = false;
  },

  selectItem1(item) {
    if(item[1] == '--'){
      this.selectedItem1 = '';
      this.selectedId1 = null
    }else{
      this.selectedItem1 = item[1];
      this.selectedId1 = item[0]
    }
    
    this.dropdownOpen1 = false;

    this.fetchPricelistOptions();
    this.sliderPage = 1;
  },

  selectItem2(item) {
    if(item == '--'){
      this.selectedItem2 = '';
    }else{
      this.selectedItem2 = item;
    }
    
    this.dropdownOpen2 = false;

    this.fetchMasterData();
    this.sliderPage = 1;
  },

  // selectCategoryItem(item) {
  //     this.selectedCategoryItem = item;
  //     this.categoryDropdownOpen = false;
  // },

  selectAItem(item) {
      this.selectedAItem = item;
      this.aDropdownOpen = false;
  },

  selectBItem(item) {
      this.selectedBItem = item;
      this.bDropdownOpen = false;
  },

  selectOffsetItem(item) {
      this.selectedOffsetItem = item;
      this.offsetDropdownOpen = false;
  },

  rppButtonClick(item_){
  //   this.prevChecked = false;
  //   this.handleSelect(item_);
  //   if (!this.selectedDataLine){
  //     this.selectedDataLine = item_
  //   }
  //   this.handleClick();
  },

  handleClick(){
    if(this.selectedDataLine.unit.toLowerCase() === 'link'){
      this.showModal2=true;
      this.qtyUnit = this.selectedDataLine.unit;
      this.unitPriceNum = this.selectedDataLine.unitPriceNum;
      this.setPullDownLists();
    }else{
      this.showModal = true;
      this.isReadOnly = false;
      this.qtyUnit = this.selectedDataLine.unit;
      this.newChainNo = '';
      this.showRadios = false;
    }
  },

  handleSelect(item_){
    if(this.prevCheckedId){
      if(item_.checked){
        // this.items.forEach((item) => {
        //   item.checked = false;
        // });
        // this.items_tsubaki.forEach((_) => {
        //   _.checked = false;
        // });
        if (this.loginMode === 'Tsubakimoto') {
          var prevousItem = this.items_tsubaki.find(_ => _.id === this.prevCheckedId);
        } else {
          var prevousItem = this.items.find(_ => _.id === this.prevCheckedId);
        }
        
        prevousItem.checked = false;


        item_.checked = true;
        this.prevCheckedId = item_.id;
      }else{
        item_.checked = false;
        this.prevCheckedId = null;
      }  
      
    }else{
      // this.items.forEach((item) => {
      //   item.checked = false;
      // });
      // this.items_tsubaki.forEach((_) => {
      //   _.checked = false;
      // });

      item_.checked = true;
      this.prevCheckedId = item_.id;
    }
    //console.log(this.prevChecked);

    if(this.prevCheckedId){
      this.isButtonDisabled = false;
      this.oldCode = item_.oldModelNo;
      this.newCode = item_.newModelNo;
      this.priceListName = item_.priceListName;
      this.selectedDataLine = item_;
    }else{
      this.isButtonDisabled = true;
      this.oldCode = '';
      this.newCode = '';
      this.priceListName = '';
      this.selectedDataLine = null;
    }

    if (this.selectedDataLine && (this.selectedDataLine.unitPrice == 'Quotation' || this.selectedDataLine.unitPrice == null || this.selectedDataLine.unitPrice == '')) {
        this.isButtonDisabled = true;
    }
    // console.log(this.selectedDataLine);
  },

  openQuotationPage(){
    store.dispatch('passOrderQty', this.orderQty);
    store.dispatch('passCompanyName', this.companyName);
    store.dispatch('passPersonName', this.personName);
    store.dispatch('passNewCodeShow', this.newCodeShow);
    store.dispatch('passUnit', this.selectedDataLine.unit === 'L' ? 'LSK' : this.selectedDataLine.unit);
    store.dispatch('passPrice', this.selectedDataLine.price);

    //console.log(this.companyName, this.personName, this.newCodeShow, this.unit);
    const newWindow = window.open('/#quotationpage', '_blank');
    newWindow.onload = () => {
      newWindow.store.replaceState(store.state);
    };
    //this.$router.push({ path: '/quotationpage' });
  },

  inputLinkQty(){
    this.inputBoxLinkQty = this.inputBoxLinkQty.toString().replace(/[^\d]/g, '');

    if (this.calCase?.trim().toUpperCase() === "CABLEVEYOR" && this.standardLinks === null){
      let val = parseInt(this.inputBoxLinkQty, 10);
      if (isNaN(val)) {
        val = 1;
      }
      if (val < 1) {
        val = 1;
      }
      if (val > 999) {
        val = 999;
      }

      this.inputBoxLinkQty = val;
    }

    var numTemp = parseInt(this.lskQty);
    if (numTemp % 2 === 0){
      this.isEven = true;
    }else{
      this.isEven = false;
    }

    if (this.priceListName?.trim().toUpperCase() === "DRIVE CHAIN") {
      if (this.standardLinks != null && numTemp < this.standardLinks) {
        if (this.isEven == false) {
          this.isEnabledNoOption = true;
          this.isEnabledLongLength = false;
          this.selectedOption = 'option2';
        }
      }
      else if (this.maxLinks != null && numTemp > this.maxLinks) {
        if (this.isEven == false) {
          this.isEnabledNoOption = true;
          this.isEnabledLongLength = false;
          this.selectedOption = 'option2';
        }
      }
    }

    this.createNewChainNo();
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