<template>
    <div class="index">
      
      <LogoBanner :title="title" />
      
      <div class="main-contents">
        <div class="nav">
            <div class="nav-left">
                <div class="text-left">
                    Sort by Date
                </div>
                <input type="date" id="date-picker1" v-model="selectedDate1">
                <div class="bar">-</div>
                <input type="date" id="date-picker2" v-model="selectedDate2">
                <!--<button class="view-mode" :disabled="!selectedDate2">
                    <span>View Mode</span>
                </button>-->
            </div>
            <div class="nav-middle">
                <label>
                    <input type="radio" value="product" v-model="selectedType" />
                    <div>Product view mode</div>
                </label>
                <label>
                    <input type="radio" value="quotation" v-model="selectedType" />
                    <div>Quotation view mode</div>
                </label>
            </div>
            <div class="nav-right">
                <div class="text-right">Cust. Ref.</div>
                <input type="text" id="cust-input">
                <div class="text-right">Quotation No.</div>
                <input type="text" id="number-input">
                <button class="search">
                    <span>Search</span>
                </button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th v-for="(header, index) in (selectedType === 'product' ? tableHeaders : tableHeadersQuotMode)" :key="index">
                            {{ header }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in (selectedType === 'product' ? tableData : tableDataQuotMode)" :key="rowIndex">
                        <!-- <td v-for="(cell, cellIndex) in row.slice(0, -1)" :key="cellIndex">
                            {{ formatDateTime(cell) }}
                        </td> -->
                        <td>{{ rowIndex + 1 }}</td>
                        <td>{{ row.distributor_name }}</td>
                        <td>{{ row.create_time }}</td>
                        <td>{{ row.quot_no }}</td>
                        <td>{{ row.attention }}</td>
                        <td>{{ row.customer_ref }}</td>
                        <td v-if="!ifQuotMode">{{ row.pre_model_no }}</td>
                        <td v-if="!ifQuotMode">{{ row.new_model_no }}</td>
                        <td v-if="!ifQuotMode" class="num">{{ row.unit_price }}</td>
                        <td v-if="!ifQuotMode">{{ row.quantity }}</td>
                        <td v-if="!ifQuotMode">{{ row.uom }}</td>
                        <td v-if="!ifQuotMode" class="num">{{ row.total }}</td>
                        <td class="num">{{ row.quotation_amout }}</td>
                        <td
                        :style='{color: getColor(row.quot_stat), fontWeight: getFontweight(row.quot_stat)}'
                        >{{ row.quot_stat }}</td>
                        <td class="select-col" v-if="ifQuotMode">
                            <div class="custom-select">
                                <div class="selected" @click="toggleDropdown(rowIndex)">{{ row.quot_stat }}</div>
                                <div class="dropdown-list" v-show="dropdownOpen[rowIndex]">
                                    <div class="dropdown-item" v-for="(rate, index) in rates" :key="index" @click="selectRate(rowIndex, rate)">
                                        {{ rate }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="btn-td">
                            <button @click="downloadPdfFile(row)">
                                <span>View/DL</span>
                            </button>
                        </td>
                        
                        <td class="revision-col">
                            <button @click="toEditQuotationPage(row)">
                                <span>Edit</span>
                            </button>
                        </td>

                        <td class="delete-col" v-if="ifQuotMode">
                            <button @click="deleteQuotation(row)">
                                <span>Delete</span>
                            </button>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>



      </div>

      <ResultFooterBtn :clickFunction="downloadAll" :toWhere="backUrl" />
    </div>
  </template>

<script>
    import flatpickr from "flatpickr";
    import "flatpickr/dist/flatpickr.min.css";

    import BannerContainer from '@/components/LogoBanner.vue';
    import ResultFooterBtn from "@/components/ResultFooterBtn.vue";
    import LogoBanner from "@/components/LogoBanner.vue";

    import config from '@/config';
    import axios from 'axios';

    export default {
        name: 'QuotationResult',
        data() {
            return {
                selectedType: 'product',

                apiUrl: config.apiUrl,

                ifQuotMode: false,

                title: 'Quotation Record',

                backUrl: '/index',

                dropdownOpen: [],
                rates: ['Quotation Stage', 'Order Received', 'Order Lost'],

                firstLabel: 'Information',
                selectedDate1: null,
                selectedDate2: null,

                tableHeadersQuotMode : ["No", "Distributor", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Quotation Price", "Status", "Order Setting", "PDF View/DL", "Edit", "Delete"],

                tableHeaders: ["No", "Distributor", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Previous Model No.", "New Model No.", "Price per Unit", "Quantity", "UOM","Total aomout", "Quotation Price", "Status", "PDF View/DL", "Edit"],
                tableData: [],
                tableDataQuotMode: [],
            };
        },

        components: {
            LogoBanner,
            ResultFooterBtn,
        },

        watch: {
            selectedType(newVal, oldVal) {
                if (newVal === 'product') {
                    this.ifQuotMode = false;
                } else {
                    this.ifQuotMode = true;
                }
            },
        },

        mounted () {
            document.addEventListener('click', this.handleClickOutside);

            const today = new Date();
            // 计算90天前的日期
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 90);

            this.selectedDate1 = flatpickr.formatDate(sevenDaysAgo, "d-m-Y");
            this.selectedDate2 = flatpickr.formatDate(today, "d-m-Y");

            flatpickr("#date-picker1", {
                dateFormat: "d-m-Y", // 日期格式
                defaultDate: sevenDaysAgo,
                locale: {
                    firstDayOfWeek: 1 // 一周的第一天，0 是周日，1 是周一
                },
                onChange: (selectedDates, dateStr) => {
                    this.selectedDate1 = dateStr;
                    datePicker2.set('minDate', dateStr);
                    // 检查 datePicker1 是否大于 datePicker2
                                // 转换为 Date 对象来比较日期
                    const date1 = new Date(dateStr);
                    const date2 = new Date(this.selectedDate2);
                    if (date1 > date2) {
                        datePicker2.clear();  // 清空 datePicker2 的值
                        this.selectedDate2 = null;  // 设置 selectedDate2 为 null
                        //console.log(true);
                    }
                }
            });

            const datePicker2 = flatpickr("#date-picker2", {
                dateFormat: "d-m-Y", // 日期格式
                defaultDate: today,
                minDate: sevenDaysAgo,
                locale: {
                    firstDayOfWeek: 1 // 一周的第一天，0 是周日，1 是周一
                },
                onChange: (selectedDates, dateStr) => {
                    this.selectedDate2 = dateStr;
                }
            });

            this.fetchQuotationRecord();         
        },

        beforeUnmount(){
            document.removeEventListener('click', this.handleClickOutside);
        },

        methods: {
            createTableDataQuotMode() {
                const seen = new Set();
                this.tableDataQuotMode = this.tableData.filter(
                    item => {
                        if (seen.has(item.quot_no)) return false;
                        seen.add(item.quot_no);
                        return true;
                    }
                ).map(
                    ({
                        pre_model_no,
                        new_model_no,
                        unit_price,
                        quantity,
                        uom,
                        total,
                        chain_formation,
                        ...rest
                    }) => rest
                );
                //console.log(this.tableDataQuotMode);
                this.dropdownOpen = Array(this.tableDataQuotMode.length).fill(false);
            },

            async fetchQuotationRecord() {
                try {
                    const response = await axios.post(`${this.apiUrl}/quotation_list/listall`, {
                        start_date: this.selectedDate1,
                        end_date: this.selectedDate2,
                    });
                    this.tableData = response.data;
                    console.log(this.tableData);
                    this.createTableDataQuotMode();

                } catch (error) {
                    console.error("Error fetching quotation record:", error);
                }
            },

            deleteQuotation(row) {

            },

            toEditQuotationPage(row) {
                this.$store.commit('setBottomEditBtnText', 'Edit');
                const targetQuotNo = row.quot_no;
                const itemsTargetQuotNo = this.tableData.filter(
                    item => item.quot_no === targetQuotNo
                );
                console.log(itemsTargetQuotNo);
                this.$store.commit('setItemsTargetQuotNo', itemsTargetQuotNo);
                this.$router.push({ path: '/editquotationpage' });
            },

            getFontweight(value) {
                if (value === "Order Received" || value === "Order Lost") {
                    return "bold";
                } else {
                    return "normal";
                }
            },

            getColor(value) {
                if (value === "Order Received") {
                    return '#05A545';
                } else if (value === "Order Lost") {
                    return 'red';
                }
                return '#2c3e50'; // 默认颜色
            },
            handleClickOutside(event){
                const customSelects = document.querySelectorAll('.custom-select');
                customSelects.forEach((customSelect, index) => {
                    // 如果点击的位置不在 customSelect 元素内，则关闭对应的下拉菜单
                    if (!customSelect.contains(event.target)) {
                        this.dropdownOpen[index] = false;
                    }
                });
            },
            selectRate(rowIndex, rate) {
                this.tableDataQuotMode[rowIndex].quot_stat = rate;
                const targetQuotNo = this.tableDataQuotMode[rowIndex].quot_no;
                
                this.tableData.forEach(item => {
                    if (item.quot_no === targetQuotNo) {
                        item.quot_stat = rate;
                    }
                });

                this.dropdownOpen[rowIndex] = false;
            },
            toggleDropdown(rowIndex) {
                this.dropdownOpen = this.dropdownOpen.map((open, index) => index === rowIndex ? !open : false);
            },
            // 日期时间格式化函数
            formatDateTime(date) {
                if (date instanceof Date && !isNaN(date)) {
                    // 格式化为 YYYY-MM-DD HH:mm
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day} ${hours}:${minutes}`;
                }
                return date; // 如果不是日期类型，直接返回原值
            },

            downloadAll(){
                alert("Download all files!");
            },

            async downloadPdfFile(row){
                const quotationNo = row.quot_no;
                try {
                    const response = await axios.post(`${this.apiUrl}/quotation/fetch-pdf`, {
                        quotationNo: quotationNo,  
                    }, {
                        responseType: 'blob'
                    });

                    const fileURL = window.URL.createObjectURL(
                        new Blob([response.data], {type: 'application/pdf'})
                    );

                    window.open(fileURL, '_blank');
                } catch (error) {
                    console.error("Error fetching PDF:", error);
                    if (error.response && error.response.status === 408) {
                        alert('PDF file not found on server...');
                    } else {
                        alert('An error occurred while fetching the PDF file.');
                    }
                }
            }
        },

    }
</script>

<style lang="less">
    .flatpickr-calendar {
        background-color: white !important; /* 背景色 */
        color: #615e5e !important; /* 文字色 */
        font-size: 17px !important;
        border: 1px solid #53C5F4;
    }
    .flatpickr-month {
        font-size: 13px !important;
        color: #615e5e !important; 
    }
    .flatpickr-day {
        color: #615e5e !important; /* 日期文字色 */
        font-size: 17px !important;
    }
    .flatpickr-day.selected{
        background-color: #53C5F4 !important; /* 日期悬停背景色 */
        color: white !important;
    }
    .flatpickr-day:hover {
        background-color: #53C5F4 !important; /* 日期悬停背景色 */
        color: white !important;
    }

    .index {
        //max-width: 100vw;
        margin: 0 auto;
        width: 100%;

        .nav {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            margin-left: 3%;
            margin-right: 3%;

            .nav-left {
                flex: 0 0 auto;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .text-left {
                    font-size: 17px;
                    white-space: nowrap;
                }
                #date-picker1 {
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    font-size: 17px;
                    padding: 0 10px;
                    margin-left: 15px;
                    height: 40px;
                    width: 10vw;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover {
                        background-color: #e5f3f5;
                    }
                }
                .bar {
                    font-size: 20px;
                    margin-left: 5px;
                }
                #date-picker2 {
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    font-size: 17px;
                    padding: 0 10px;
                    margin-left: 5px;
                    height: 40px;
                    width: 10vw;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover {
                        background-color: #e5f3f5;
                    }
                }
                // .view-mode {
                //     margin-left: 20px;
                //     background-color:  #00AAEE;
                //     width: 130px;
                //     height: 35px;
                //     border: none;
                //     border-radius: 5px;
                //     color: white;
                //     font-size: 17px;
                //     cursor: pointer;

                //     span {
                //         position: relative; 
                //         top: 0;
                //         left: 0;
                //         transition: top 0.2s ease, left 0.2s ease;
                //     }

                //     &:hover{
                //         background-color: #0082B3;
                //     }

                //     &:hover span {
                //         top: 2px; 
                //         left: 2px; 
                //     }

                //     &:disabled{
                //         pointer-events: none;
                //         background-color: #BFBFBF;
                //         user-select: none;
                        
                //         &:hover{
                //             pointer-events: none;
                //             background-color: #BFBFBF;
                //             opacity: 0.5
                //         }
                //     }
                // }
            }

            .nav-middle {
                flex: 0 0 auto;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: space-between;
                margin-left: 20px;
                //margin-right: 30px;
                
                label {
                    font-size: 17px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: text-shadow 0.2s; /* 添加 transform 过渡效果 */
                    user-select: none;

                    &:hover {
                        text-shadow: 0px 3px 2px #00acf0;  // 添加文字阴影
                    }
                    
                    input {
                        vertical-align: middle;
                        height: auto;
                        width: 20px;
                        margin: 0 10px;
                        cursor: pointer;
                    }
                    div {
                        vertical-align: middle;
                        white-space: nowrap;
                        height: auto;
                    }
                    &:last-child {
                        margin-top: 5px;
                    }
                }
            }

            .nav-right {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1 1 0;
                min-width: 0;
                margin-left: 3vw;
                gap: 12px;

                .text-right {
                    font-size: 17px;
                    margin-left: 15px;
                    flex: 0 0 auto;
                    //white-space: nowrap;
                }
                #cust-input, #number-input {
                    flex: 1 1 0;   /* 自动平分父容器的剩余空间 */
                    min-width: 0; /* 防止内容撑爆 */
                    font-size: 17px;
                    padding: 0 10px;
                    //margin-left: 15px;
                    height: 40px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                    }
                }
                .search {
                    margin-left: 20px;
                    background-color:  #00AAEE;
                    width: 130px;
                    height: 35px;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    font-size: 17px;
                    cursor: pointer;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                    span {
                        position: relative; 
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease;
                    }

                    &:hover{
                        background-color: #0082B3;
                        transform: translate(3px, 3px);
                    }

                    &:hover span {
                        top: 2px; 
                        left: 2px; 
                    }
                }
            }
        }
        .table-container {
            margin-top: 20px;
            margin-left: 3%;
            margin-right: 3%;
            width: 94%;
            //height: 440px; /* 固定表格高度 */
            height: calc(68vh - 20px);
            overflow-y: auto; /* 启用垂直滚动条 */
            border: 1px solid #ddd;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

            table{
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;;

                thead {
                    height: 50px;
                    background-color: #F2F2F2;
                    //background-color: #03e995;
                    opacity: 1;
                    position: sticky;
                    top: 0;
                    z-index: 1; /* 使表头在滚动时保持在顶部 */

                    th {
                        white-space: normal;
                        word-wrap: break-word;
                        padding: 0 5px;
                    }
                }

                tbody {
                    tr {
                        height: 50px;
                        //border: 2px solid #F2F2F2 ;
                        
                        td {
                            border: 2px solid #F2F2F2;
                            padding: 0 5px;
                        }

                        .num {
                            text-align: right;
                        }

                        .btn-td{
                            width: 100px;
                            padding: 0 15px;
                            button {
                                //margin-left: 20px;
                                background-color:  #00AAEE;
                                width: 100px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                span {
                                    position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:hover{
                                    background-color: #0082B3;
                                    transform: translate(3px, 3px);
                                }

                                &:hover span {
                                    top: 2px; 
                                    left: 2px; 
                                }
                            }
                        }
                            
                        .select-col{
                            width: 180px;
                            .custom-select {
                                position: relative;
                                display: inline-block;
                                width: 150px;
                                height: 30px;
                                border-radius: 3px;
                                background-color: #E7E6E6;
                                cursor: pointer;
                                margin-top: 1px;
                                border: none;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                white-space: nowrap;
                                .selected {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    height: 100%;
                                    padding: 0 15px 0 15px;
                                    font-size: 15px;
                                    color: white;
                                    background-color:#00AAEE;
                                    border-radius: 3px;
                                    &:hover{
                                        background-color: #0082B3;
                                    }
                                }

                                .selected::after {
                                content: '';
                                    display: inline-block;
                                    margin-top: 1px;
                                    width: 0;
                                    height: 0;
                                    border-left: 7px solid transparent;
                                    border-right: 7px solid transparent;
                                    border-top: 7px solid white;
                                    border-radius: 3px;
                                }
                                .dropdown-list {
                                    position: absolute;
                                    top: 100%;
                                    left: 0;
                                    z-index: 1;
                                    width: 100%;
                                    max-height: 200px;
                                    overflow-y: auto;
                                    background-color: white;
                                    border-radius: 3px;
                                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                                    z-index: 9999;

                                    .dropdown-item {
                                        height: 35px;
                                        padding: 0 20px;
                                        display: flex;
                                        align-items: center;
                                        font-size: 15px;
                                        color: black;
                                        cursor: pointer;
                                        justify-content: center;
                                        border: none;
                                    }

                                    .dropdown-item:hover {
                                        background-color: #00AAEE;
                                        color: white;
                                        font-weight: bold;
                                    }
                                }
                            }

                            .custom-select.show .dropdown-list {
                                display: block;
                            }
                        }

                        .revision-col{
                            width: 90px;
                            padding-right: 15px;
                            button {
                                margin-left: 10px;
                                margin-right: 5px;
                                background-color:  #02B302;
                                width: 70px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                span {
                                    position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:hover{
                                    background-color: #028802;
                                    transform: translate(3px, 3px);
                                }

                                &:hover span {
                                    top: 2px; 
                                    left: 2px; 
                                }
                            }
                        }

                        .delete-col{
                            width: 90px;
                            padding-right: 15px;
                            button {
                                margin-left: 10px;
                                margin-right: 5px;
                                background-color:  #BE0505;
                                width: 70px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                span {
                                    position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:hover{
                                    background-color: #920404;
                                    transform: translate(3px, 3px);
                                }

                                &:hover span {
                                    top: 2px; 
                                    left: 2px; 
                                }
                            }
                        }
                     }
                }
            }
        }
    }
</style>