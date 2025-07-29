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
                        <th v-for="(header, index) in tableHeaders" :key="index">
                            {{ header }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row.slice(0, -1)" :key="cellIndex">
                            {{ formatDateTime(cell) }}
                        </td>
                        <td class="btn-td">
                            <button @click="downloadFile(row)">
                                <span>Download</span>
                            </button>
                        </td>
                        <td :key="row.length - 1" 
                        :style='{color: getColor(row[row.length - 1]), fontWeight: "bold"}'>
                            {{ formatDateTime(row[row.length - 1]) }}
                        </td>
                        <td class="select-col">
                            <div class="custom-select">
                                <div class="selected" @click="toggleDropdown(rowIndex)">{{ row[7] }}</div>
                                <div class="dropdown-list" v-show="dropdownOpen[rowIndex]">
                                    <div class="dropdown-item" v-for="(rate, index) in rates" :key="index" @click="selectRate(rowIndex, rate)">
                                        {{ rate }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="revision-col">
                            <button @click="toEditQuotationPage(row)">
                                <span>Edit</span>
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

    export default {
        name: 'QuotationResult',
        data() {
            return {
                title: 'Quotation',

                backUrl: '/index',

                dropdownOpen: [],
                rates: ['Undetermined', 'Order Received', 'Order Lost'],
                filteredTableData: [],

                firstLabel: 'Information',
                selectedDate1: null,
                selectedDate2: null,

                tableHeaders: ["No.", "Quotation No.", "Product Code", "Price", "User Type", "Status", "Date", "Download", "Order Status", "Order Setting", "Revision"],
                tableData: [
                    ["1", "Tsubasa20240901", "RF2050R", 62000, "KTE", "Complete", new Date("2024-09-01T14:30:00"), 'Undetermined'],
                    ["2", "Tsubasa20240902", "RF2050R-BLA2", 72000, "NICHIDEN", "In-complete", new Date("2024-09-02T14:30:00"), 'Undetermined'],
                    ["3", "Tsubasa20240903", "RF2050G", 52000, "TKT", "Complete", new Date("2024-09-03T14:30:00"), 'Undetermined'],
                    ["4", "Tsubasa20240904", "RF2050G-BLA2", 42000, "HRD", "Complete", new Date("2024-09-04T14:30:00"), 'Undetermined'],
                    ["5", "Tsubasa20240905", "RF2050S", 92000, "PLANET", "In-complete", new Date("2024-09-05T14:30:00"), 'Undetermined'],
                    ["6", "Tsubasa20240906", "RF2050S-BLA2", 80000, "NICHIDEN", "In-complete", new Date("2024-09-06T14:30:00"), 'Undetermined'],
                    ["7", "Tsubasa20240907", "RF2050B", 54000, "KTE", "Complete", new Date("2024-09-07T14:30:00"), 'Undetermined'],
                    ["8", "Tsubasa20240908", "RF2050B-BLA2", 75000, "HRD", "Complete", new Date("2024-09-08T14:30:00"), 'Undetermined'],
                    ["9", "Tsubasa20240909", "RF2050R", 61000, "KTE", "Complete", new Date("2024-09-09T14:30:00"), 'Undetermined'],
                    ["10", "Tsubasa20240901", "RF2050R", 62000, "KTE", "Complete", new Date("2024-09-01T14:30:00"), 'Undetermined'],
                    ["11", "Tsubasa20240902", "RF2050R-BLA2", 72000, "NICHIDEN", "In-complete", new Date("2024-09-02T14:30:00"),'Undetermined' ],
                    ["12", "Tsubasa20240903", "RF2050G", 52000, "TKT", "Complete", new Date("2024-09-03T14:30:00"), 'Undetermined'],
                    ["13", "Tsubasa20240904", "RF2050G-BLA2", 42000, "HRD", "Complete", new Date("2024-09-04T14:30:00"), 'Undetermined'],
                    ["14", "Tsubasa20240905", "RF2050S", 92000, "PLANET", "In-complete", new Date("2024-09-05T14:30:00"), 'Undetermined'],
                    ["15", "Tsubasa20240906", "RF2050S-BLA2", 80000, "NICHIDEN", "In-complete", new Date("2024-09-06T14:30:00"), 'Undetermined'],
                    ["16", "Tsubasa20240907", "RF2050B", 54000, "KTE", "Complete", new Date("2024-09-07T14:30:00"), 'Undetermined'],
                    ["17", "Tsubasa20240908", "RF2050B-BLA2", 75000, "HRD", "Complete", new Date("2024-09-08T14:30:00"), 'Undetermined'],
                    ["18", "Tsubasa20240909", "RF2050R", 61000, "KTE", "Complete", new Date("2024-09-09T14:30:00"), 'Undetermined'],
                    ["19", "Tsubasa20240901", "RF2050R", 62000, "KTE", "Complete", new Date("2024-09-01T14:30:00"), 'Undetermined'],
                    ["20", "Tsubasa20240902", "RF2050R-BLA2", 72000, "NICHIDEN", "In-complete", new Date("2024-09-02T14:30:00"), 'Undetermined'],
                    ["21", "Tsubasa20240903", "RF2050G", 52000, "TKT", "Complete", new Date("2024-09-03T14:30:00"), 'Undetermined'],
                    ["22", "Tsubasa20240904", "RF2050G-BLA2", 42000, "HRD", "Complete", new Date("2024-09-04T14:30:00"), 'Undetermined'],
                    ["23", "Tsubasa20240905", "RF2050S", 92000, "PLANET", "In-complete", new Date("2024-09-05T14:30:00"), 'Undetermined'],
                    ["24", "Tsubasa20240906", "RF2050S-BLA2", 80000, "NICHIDEN", "In-complete", new Date("2024-09-06T14:30:00"), 'Undetermined'],
                    ["25", "Tsubasa20240907", "RF2050B", 54000, "KTE", "Complete", new Date("2024-09-07T14:30:00"), 'Undetermined'],
                    ["26", "Tsubasa20240908", "RF2050B-BLA2", 75000, "HRD", "Complete", new Date("2024-09-08T14:30:00"), 'Undetermined'],
                    ["27", "Tsubasa20240909", "RF2050R", 61000, "KTE", "Complete", new Date("2024-09-09T14:30:00"), 'Undetermined'],
                ]
            };
        },

        components: {
            LogoBanner,
            ResultFooterBtn,
        },

        mounted () {
            this.dropdownOpen = Array(this.tableData.length).fill(false);
            this.filteredTableData = this.tableData;
            document.addEventListener('click', this.handleClickOutside);

            const today = new Date();
            // 计算三天前的日期
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);

            this.selectedDate1 = flatpickr.formatDate(sevenDaysAgo, "Y-m-d");
            this.selectedDate2 = flatpickr.formatDate(today, "Y-m-d");

            flatpickr("#date-picker1", {
                dateFormat: "Y-m-d", // 日期格式
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
                dateFormat: "Y-m-d", // 日期格式
                defaultDate: today,
                minDate: sevenDaysAgo,
                locale: {
                    firstDayOfWeek: 1 // 一周的第一天，0 是周日，1 是周一
                },
                onChange: (selectedDates, dateStr) => {
                    this.selectedDate2 = dateStr;
                }
            });
            
        },

        beforeUnmount(){
            document.removeEventListener('click', this.handleClickOutside);
        },

        methods: {
            toEditQuotationPage(row) {
                this.$router.push({ path: '/editquotationpage' });
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
                this.tableData[rowIndex][7] = rate;       
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
            downloadFile(index){
                alert("Download file " + index[1] + " !");
            }
        },

    }
</script>

<style lang="less">
  /* 自定义 Flatpickr 样式 */
    .flatpickr-calendar {
        background-color: #edf8f9 !important; /* 背景色 */
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
            margin-left: 5%;
            margin-right: 5%;

            .nav-left {
                display: flex;
                justify-content: space-around;
                align-items: center;
                .text-left {
                    font-size: 19px;
                }
                #date-picker1 {
                    font-size: 19px;
                    padding: 0 10px;
                    margin-left: 15px;
                    height: 40px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    &:hover {
                        background-color: #e5f3f5;
                    }
                }
                .bar {
                    font-size: 19px;
                    margin-left: 5px;
                }
                #date-picker2 {
                    font-size: 19px;
                    padding: 0 10px;
                    margin-left: 5px;
                    height: 40px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    &:hover {
                        background-color: #e5f3f5;
                    }
                }
                .view-mode {
                    margin-left: 20px;
                    background-color:  #00AAEE;
                    width: 130px;
                    height: 35px;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    font-size: 17px;
                    cursor: pointer;

                    span {
                        position: relative; 
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease;
                    }

                    &:hover{
                        background-color: #0082B3;
                    }

                    &:hover span {
                        top: 2px; 
                        left: 2px; 
                    }

                    &:disabled{
                        pointer-events: none;
                        background-color: #BFBFBF;
                        user-select: none;
                        
                        &:hover{
                            pointer-events: none;
                            background-color: #BFBFBF;
                            opacity: 0.5
                        }
                    }
                }
            }

            .nav-right {
                display: flex;
                justify-content: space-around;
                align-items: center;
                .text-right {
                    font-size: 19px;
                    margin-left: 15px;
                }
                #cust-input, #number-input {
                    font-size: 19px;
                    padding: 0 10px;
                    margin-left: 15px;
                    height: 40px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
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

                    span {
                        position: relative; 
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease;
                    }

                    &:hover{
                        background-color: #0082B3;
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
            margin-left: 5%;
            margin-right: 5%;
            width: 90%;
            height: 440px; /* 固定表格高度 */
            overflow-y: auto; /* 启用垂直滚动条 */
            border: 1px solid #ddd;

            table{
                width: 100%;
                border-collapse: collapse;

                thead {
                    height: 50px;
                    background-color: #F2F2F2;
                    //background-color: #03e995;
                    opacity: 1;
                    position: sticky;
                    top: 0;
                    z-index: 1; /* 使表头在滚动时保持在顶部 */
                }

                tbody {
                    tr {
                        height: 50px;
                        border: 2px solid #F2F2F2 ;
                        

                        .btn-td{
                                width: 90px;
                                padding-right: 15px;
                                button {
                                    margin-left: 20px;
                                    background-color:  #00AAEE;
                                    width: 100px;
                                    height: 30px;
                                    border: none;
                                    border-radius: 3px;
                                    color: white;
                                    font-size: 14px;
                                    cursor: pointer;

                                    span {
                                        //position: relative;   //解决button在表头背景下显示问题
                                        top: 0;
                                        left: 0;
                                        transition: top 0.2s ease, left 0.2s ease;
                                    }

                                    &:hover{
                                        background-color: #0082B3;
                                    }

                                    &:hover span {
                                        top: 2px; 
                                        left: 2px; 
                                    }
                                }
                        }
                            
                        .select-col{
                            .custom-select {
                                    position: relative;
                                    display: inline-block;
                                    width: 170px;
                                    height: 30px;
                                    border-radius: 3px;
                                    background-color: #E7E6E6;
                                    cursor: pointer;
                                    margin-top: 1px;
                                    border: none;
                                    .selected {
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        height: 100%;
                                        padding: 0 20px 0 20px;
                                        font-size: 16px;
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
                                        background-color: #00AAEE;
                                        border-radius: 3px;
                                        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                                        z-index: 9999;

                                        .dropdown-item {
                                            height: 40px;
                                            padding: 0 20px;
                                            display: flex;
                                            align-items: center;
                                            font-size: 16px;
                                            color: white;
                                            cursor: pointer;
                                            justify-content: center;
                                            border: none;
                                        }

                                        .dropdown-item:hover {
                                            background-color: #0082B3;
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
                                background-color:  #00AAEE;
                                width: 70px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;

                                span {
                                    //position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:hover{
                                    background-color: #0082B3;
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