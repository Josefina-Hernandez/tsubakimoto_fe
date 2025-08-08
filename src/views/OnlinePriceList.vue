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
                    <div class="dropdown-item" v-for="(item, index) in items2" :key="index" @click="selectItem2(item)">
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
                <td>{{ item.partNo }}</td>
                <td>{{ item.oldModelNo }}</td>
                <td>{{ item.newModelNo }}</td>
                <td>{{ item.unit }}</td>
                <td v-if="loginMode === 'Tsubakimoto'">{{ item.poPrice }}</td>
                <td v-if="loginMode === 'Tsubakimoto'">{{ item.thbCost }}</td>
                <td v-if="loginMode === 'Tsubakimoto'">{{ item.gp }}</td>
                <td>{{ item.unitPrice }}</td>
                <td>{{ item.detail }}</td>
                <td>{{ item.priceListName }}</td>
                <td :class="{blue: item.unit}" @click="rppButtonClick(item)">{{ item.stockReference }}</td>
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

          <div class="page-text">Page: {{ this.sliderPage }}</div>
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
                <div @click.prevent="!modalButtonDisabled && addProduct()">
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
                <div class="title">Links/FT Information</div>
                <div class="name-qty">
                  <div class="name">{{newCode}}</div>
                  
                </div>
                <div class="details">
                  <div class="detail-left">
                    <div><strong>NEW Model No.:</strong> {{newCode}}</div>
                    <div><strong>Previous Model No.:</strong> {{oldCode}}</div>
                    <div class="category-dropdown" @mouseleave="hideCategoryDropdown">
                        <div class="category-title">Category (For frontend test only)</div>
                        <div class="category-select">
                            <div class="selected" @click="toggleCategoryDropdown">{{ selectedCategoryItem }}</div>
                            <div class="dropdown-list" v-show="categoryDropdownOpen">
                                <div class="dropdown-item" v-for="(item, index) in categoryItems" :key="index" @click="selectCategoryItem(item)">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="linknum-area">
                        <div class="linknum-label">No. of Link</div>
                        <input type="text" class="linknum-input" name="lsk" v-model.number="lskQty" @input="inputLinkQty">
                        <div class="linknum-unit">{{ qtyUnit }}</div>
                        <div class="red-label">Maximum length = ...LKS/PC</div>
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
                        <input type="radio" value="option2" v-model="selectedOption">
                        <span>&nbsp;No Opthion</span>
                      </label>
                      <label>
                        <input type="radio" value="option1" v-model="selectedOption">
                        <span>&nbsp;Long Length (T)</span>                      
                      </label>                     
                    </div>
                    <div class="remark-text">Other options, please contact TTCL</div>
                  </div>
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

                <button class="modal2-default-button2" @click.prevent="!modalButtonDisabled2 && addProduct()" :disabled="modalButtonDisabled2">Add to Quotation</button>

           
                <!--<button class="modal2-default-button3" @click="showModal2 = false">Done</button>-->
                              
              </div>
            </div>
          </div>
        </div>

      
        <FooterBtn2 class="footer" :ifShow1="ifShow1" :ifShow2="ifShow2" :toWhere="previousPage" :switchTo="switchTo" :switchLabelText="switchLabelText" :clickFunction="handleClick" :isButtonDisabled="isButtonDisabled" />
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
                  max-height: 300px;
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
      
      overflow-y: auto;
      margin-top: 15px;
      //display: flex;
      //justify-content: center; 
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
        flex: 0.9;
        text-align: right;
        font-size: 15px;
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
              margin-top: 20px;
            
              .name{
                font-size: 23px;
                font-weight: bold;
              }
            }

            .details{
              display: flex;
              align-items:normal;
              justify-content: space-between;
              margin-top: 10px;
              position: relative;
              .detail-left{
                text-align: left;
                padding-top: 16px;
                
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

                    span{
                      vertical-align: middle;
                      display: inline-block;
                      height: 10px;
                      margin-left: 10px;
                      color: red;
                      font-weight: bold;

                    }
                    input[type="radio"]{
                      appearance: none;
                      position: relative;
                      width: 15px;
                      height: 15px;
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
  
                    }

                  }
                }
                .remark-text{
                    font-size: 12px;
                    font-weight: bold;
                    color: red;
                    margin-top: 10px;
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
            margin-top: 40px;

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

export default {
  name: 'OnelinePriceList',

  data(){
    return{
        windowHeight: window.innerHeight,

        title: "Online Price List",
        ifShow1: true,
        ifShow2: true,
        previousPage: '/selection',
        switchTo: '/chaincutting',
        switchLabelText: 'Cutting & Assembly at TTCL Warehouse',
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

        // items1: ['--', 'KTE', 'TKT', 'HRD', 'PLANET', 'NICHIDEN'],
        // items2: ['--', 'THB DRICE CHAIN', 'PRICE LIST NAME 2', 'PRICE LIST NAME 3', 'PRICE LIST NAME 4'],
        items1: [null, '--'],
        items2: ['--'],
        categoryItems: ['Drive chain', 'Small size conveyor chain', 'Large size conveyor chain', 'Cableveyors', 'Top chains(ST/RT)', 'Top chains(RS)', 'Top chains(TS/TSA)'],
        aItems: ['MWJ', 'MWJK', 'MCJ', 'MCJK', 'MSJ', 'MSJK', 'FWJ', 'FCJ', 'FSJ'],
        bItems: ['R'],
        offsetItems: ['---', '2O', '2OK', '4O', '4OK', 'O', 'OK', 'R'],

        showWarning: false,
        dropdownOpen1: false,
        dropdownOpen2: false,
        categoryDropdownOpen: false,
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

        items: [
          // {
          //   category: 'A11',
          //   partNo: '0001',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0002',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'FT',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0003',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0004',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0005',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0006',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0007',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0008',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0009',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0010',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0011',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0012',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
        ],

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

        items_tsubaki: [
          // {
          //   category: 'A11',
          //   partNo: '0001',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0002',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'FT',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0003',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0004',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0005',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   poPrice: '¥300',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0006',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '¥300',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0007',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0008',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0009',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0010',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '$5',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0011',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Link',
          //   poPrice: '¥300',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: '1Box=10FT=96Links',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
          // {
          //   category: 'A11',
          //   partNo: '0012',
          //   oldModelNo: 'RS100-LMD-1',
          //   newModelNo: 'RS100-LMD-1-CP',
          //   unit: 'Box',
          //   poPrice: '¥300',
          //   thbCost: '฿300',
          //   gp: '44%',
          //   unitPrice: '2.06',
          //   detail: 'Other note',
          //   priceListName: 'THB DRICE CHAIN',
          //   stockReference: 'RPP',
          //   qty: 0,
          // },
        ],

        // newCode: '',
        // oldCode: '',
        newCode: '',
        oldCode: '',

        newChainNo: '',

        // addMiddle: '____',

        showModal: false,
        showModal2: false,

        apiUrl: config.apiUrl,

        prevCheckedId: null,

        selectedOption: 'option1',

        lskQty: 0,

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
    }
  },

  computed: {
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
        this.setPullDownLists();
        this.selectedAItem = '---';
        this.selectedBItem = '---'
    },

    selectedAItem() {
        this.setPullDownLists();
        this.selectedBItem = '---';
    },

    selectedBItem() {
        this.setPullDownLists();
    },

    selectedOffsetItem() {
        this.setPullDownLists();
    },

    isEven() {
        this.setPullDownLists();
        this.selectedAItem = '---';
        this.selectedBItem = '---'
    },

    lskQty(){
      if (!/^\d+$/.test(this.lskQty)) {
        this.lskQty = 0;
      }

      if (this.lskQty.length > 8) {
        this.lskQty = this.lskQty.slice(0, 8);
      }

      this.isEnableProceedBtn();

    //   if(this.lskQty!=0){
    //     this.showBtnBackQuotation = true;
    //     // this.addMiddle = this.lskQty;
    //   }else{
    //     this.showBtnBackQuotation = false;
    //     // this.addMiddle = '____';
    //   }
      this.setPullDownLists();
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

    this.addedDataList = this.$store.state.partList;
    this.cartCount = this.addedDataList.length;
    
    this.isEnableProceedBtn();
    await this.fetchFilterOptinons();
    this.fetchMasterData();
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
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
        const response = await axios.post(`${this.apiUrl}/master_data/list`, {
          page: page,
          pageSize: this.pageSize,
          priceListNames: this.selectedItem2 != '' ? [this.selectedItem2] : this.items2,
          keyword: this.searchText,
        });

        this.totalItems = response.data.total;
        const rawData = response.data.data;

        this.items_tsubaki = rawData.map(row => {
          const currency = row[11] || '';
          let poPriceRaw = row[10];
          let poPriceFormatted;

          const price = parseFloat(poPriceRaw);

          if (!isNaN(price)) {
            if (currency.toUpperCase().includes('EUR')) {
              poPriceFormatted = `€ ${price.toFixed(3)}`;
            } else if (currency.toUpperCase().includes('USD')) {
              poPriceFormatted = `$ ${price.toFixed(2)}`;
            } else if (currency.toUpperCase().includes('JPY')) {
              poPriceFormatted = `¥ ${Math.round(price)}`;
            } else {
              poPriceFormatted = `${price.toFixed(3)}`;
            }
          } else {
            poPriceFormatted = poPriceRaw;
          }

          let thbCostRaw = row[13];
          let cost_thb = parseFloat(thbCostRaw);
          let thbCostFormatted = !isNaN(cost_thb)
            ? `฿ ${Math.round(cost_thb)}`
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

    addProduct() {
        this.selectedDataLine.qty = this.orderQty;   
        if (this.newChainNo) {
            this.selectedDataLine.newModelNo = this.newChainNo;
        }
        
        const newItem = { ...this.selectedDataLine };

        this.addedDataList.push(newItem);
        this.$store.commit('setPartList', this.addedDataList);
        //console.log(this.addedDataList);
        this.cartCount += 1
        this.showModal = false;
        this.showModal2 = false;
    },

    setPullDownLists() {
        if (this.selectedCategoryItem === 'Drive chain') {
            if (this.isEven) {
                this.aItems = ['MWJ', 'MWJK', 'MCJ', 'MCJK', 'MSJ', 'MSJK', 'FWJ', 'FCJ', 'FSJ'];
                this.bItems = ['R'];
            } else {
                this.aItems = ['MWJ', 'MWJK', 'MCJ', 'MCJK', 'MSJ', 'MSJK', 'FWJ', 'FCJ', 'FSJ', 'R'];
                if (this.selectedAItem === 'MWJ') {
                    this.bItems = ['O', 'OK', 'MWJ', 'MWJ2O', 'MWJ2OK'];
                } else if (this.selectedAItem === 'MCJ') {
                    this.bItems = ['O', 'OK', 'MCJ', 'MCJ2O', 'MCJ2OK'];
                } else if (this.selectedAItem === 'MSJ') {
                    this.bItems = ['O', 'OK', 'MSJ', 'MSJ2O', 'MSJ2OK'];
                } else if (this.selectedAItem === 'MWJK') {
                    this.bItems = ['MWJK', 'MWJK2OK'];
                } else if (this.selectedAItem === 'MCJK') {
                    this.bItems = ['MCJK', 'MCJK2OK'];
                } else if (this.selectedAItem === 'MSJK') {
                    this.bItems = ['MSJK', 'MSJK2OK'];
                } else if (this.selectedAItem === 'FWJ') {
                    this.bItems = ['FWJ'];
                } else if (this.selectedAItem === 'FCJ') {
                    this.bItems = ['FCJ'];
                } else if (this.selectedAItem === 'FSJ') {
                    this.bItems = ['FSJ'];
                } else if (this.selectedAItem === 'R') {
                    this.bItems = ['R', 'MWJR', 'MCJR', 'MSJR'];
                } else {
                    this.bItems = ['---'];
                }
            }          

        } else if (this.selectedCategoryItem == 'Small size conveyor chain') {
            if (this.isEven) {
                this.aItems = ['J', 'JK'];
                this.bItems = ['R'];
            } else {
                this.aItems = ['J', 'JK', 'R'];
                if (this.selectedAItem === 'J') {
                    this.bItems = ['L', 'O', 'OK', 'J'];
                } else if (this.selectedAItem === 'JK') {
                    this.bItems = ['JK', 'OK'];
                } else if (this.selectedAItem === 'R') {
                    this.bItems = ['R'];
                } else {
                    this.bItems = ['---'];
                }
            }
        } else if (this.selectedCategoryItem == 'Large size conveyor chain') {
            this.aItems = ['P', 'R'];
            if (this.selectedAItem === 'P') {
                this.bItems = ['R', 'OK', 'P'];
            } else if (this.selectedAItem === 'R') {
                this.bItems = ['R'];
            } else {
                this.bItems = ['---'];
            }
        } else if (this.selectedCategoryItem === 'Cableveyors') {
            this.aItems = ['1A'];
            this.bItems = ['-2A'];
        } else if (this.selectedCategoryItem === 'Top chains(ST/RT)') {
            this.aItems = ['JK', 'R'];
            this.bItems = ['R'];
        } else if (this.selectedCategoryItem ==='Top chains(RS)') {
            this.aItems = ['J', 'R'];
            this.bItems = ['R'];
        } else if (this.selectedCategoryItem === 'Top chains(TS/TSA)') {
            this.aItems = ['PK', 'R'];
            if (this.selectedAItem === 'PK') {
                this.bItems = ['R', 'PK', 'OK'];
            } else if (this.selectedAItem === 'R') {
                this.bItems = ['R'];
            } else {
                this.bItems = ['---'];
            }
        }
        
        this.newChainNo = this.newCode + '+' + this.lskQty.toString() + 'L' + this.selectedAItem + this.selectedBItem + (this.selectedOffsetItem === '---' ? '' : this.selectedOffsetItem) ;
     
    
    },

    toEditProductsPage() {
        this.$store.commit('setPartList', this.addedDataList);
        this.$router.push('/editproducts');
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

    toggleCategoryDropdown() {
        this.categoryDropdownOpen = !this.categoryDropdownOpen;
    },

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

    hideCategoryDropdown() {
        this.categoryDropdownOpen = false;
    },

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

    selectCategoryItem(item) {
        this.selectedCategoryItem = item;
        this.categoryDropdownOpen = false;
    },

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
      //console.log(this.selectedDataLine.unit);
      if(this.selectedDataLine.unit.toLowerCase() === 'link' || this.selectedDataLine.unit.toLowerCase() === 'ft'){
        this.showModal2=true;
        this.qtyUnit = this.selectedDataLine.unit;
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

      //console.log(this.companyName, this.personName, this.newCodeShow, this.unit);
      const newWindow = window.open('/#quotationpage', '_blank');
      newWindow.onload = () => {
        newWindow.store.replaceState(store.state);
      };
      //this.$router.push({ path: '/quotationpage' });
    },

    inputLinkQty(){
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