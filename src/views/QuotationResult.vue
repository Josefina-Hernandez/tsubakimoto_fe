<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <div class="nav">
            <div class="nav-left">
                <div class="text-left">
                    Sort by Date
                </div>
                <input type="date" id="date-picker1" v-model="selectedDate1">
                <div class="bar">-</div>
                <input type="date" id="date-picker2" v-model="selectedDate2">
                <button class="view-mode" :disabled="!selectedDate2">
                    <span>View Mode</span>
                </button>
            </div>
            <div class="nav-right">
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
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            {{ formatDateTime(cell) }}
                        </td>
                        <td class="btn-td">
                            <button @click="downloadFile(row)">
                                <span>Download</span>
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

    import BannerContainer from '@/components/BannerContainer.vue'
    import ResultFooterBtn from "@/components/ResultFooterBtn.vue";
    export default {
        name: 'QuotationResult',
        data() {
            return {
                backUrl: '/index',

                firstLabel: 'Information',
                selectedDate1: null,
                selectedDate2: null,

                tableHeaders: ["No.", "Quotation No.", "Product Code", "Price", "User Type", "Status", "Date", "Download"],
                tableData: [
                    ["1", "Tsubasa20240901", "RF2050R", 62000, "KTE", "Complete", new Date("2024-09-01T14:30:00"), ],
                    ["2", "Tsubasa20240902", "RF2050R-BLA2", 72000, "NICHIDEN", "In-complete", new Date("2024-09-02T14:30:00"), ],
                    ["3", "Tsubasa20240903", "RF2050G", 52000, "TKT", "Complete", new Date("2024-09-03T14:30:00"), ],
                    ["4", "Tsubasa20240904", "RF2050G-BLA2", 42000, "HRD", "Complete", new Date("2024-09-04T14:30:00"), ],
                    ["5", "Tsubasa20240905", "RF2050S", 92000, "PLANET", "In-complete", new Date("2024-09-05T14:30:00"), ],
                    ["6", "Tsubasa20240906", "RF2050S-BLA2", 80000, "NICHIDEN", "In-complete", new Date("2024-09-06T14:30:00"), ],
                    ["7", "Tsubasa20240907", "RF2050B", 54000, "KTE", "Complete", new Date("2024-09-07T14:30:00"), ],
                    ["8", "Tsubasa20240908", "RF2050B-BLA2", 75000, "HRD", "Complete", new Date("2024-09-08T14:30:00"), ],
                    ["9", "Tsubasa20240909", "RF2050R", 61000, "KTE", "Complete", new Date("2024-09-09T14:30:00"), ],
                    ["10", "Tsubasa20240901", "RF2050R", 62000, "KTE", "Complete", new Date("2024-09-01T14:30:00"), ],
                    ["11", "Tsubasa20240902", "RF2050R-BLA2", 72000, "NICHIDEN", "In-complete", new Date("2024-09-02T14:30:00"), ],
                    ["12", "Tsubasa20240903", "RF2050G", 52000, "TKT", "Complete", new Date("2024-09-03T14:30:00"), ],
                    ["13", "Tsubasa20240904", "RF2050G-BLA2", 42000, "HRD", "Complete", new Date("2024-09-04T14:30:00"), ],
                    ["14", "Tsubasa20240905", "RF2050S", 92000, "PLANET", "In-complete", new Date("2024-09-05T14:30:00"), ],
                    ["15", "Tsubasa20240906", "RF2050S-BLA2", 80000, "NICHIDEN", "In-complete", new Date("2024-09-06T14:30:00"), ],
                    ["16", "Tsubasa20240907", "RF2050B", 54000, "KTE", "Complete", new Date("2024-09-07T14:30:00"), ],
                    ["17", "Tsubasa20240908", "RF2050B-BLA2", 75000, "HRD", "Complete", new Date("2024-09-08T14:30:00"), ],
                    ["18", "Tsubasa20240909", "RF2050R", 61000, "KTE", "Complete", new Date("2024-09-09T14:30:00"), ],
                    ["19", "Tsubasa20240901", "RF2050R", 62000, "KTE", "Complete", new Date("2024-09-01T14:30:00"), ],
                    ["20", "Tsubasa20240902", "RF2050R-BLA2", 72000, "NICHIDEN", "In-complete", new Date("2024-09-02T14:30:00"), ],
                    ["21", "Tsubasa20240903", "RF2050G", 52000, "TKT", "Complete", new Date("2024-09-03T14:30:00"), ],
                    ["22", "Tsubasa20240904", "RF2050G-BLA2", 42000, "HRD", "Complete", new Date("2024-09-04T14:30:00"), ],
                    ["23", "Tsubasa20240905", "RF2050S", 92000, "PLANET", "In-complete", new Date("2024-09-05T14:30:00"), ],
                    ["24", "Tsubasa20240906", "RF2050S-BLA2", 80000, "NICHIDEN", "In-complete", new Date("2024-09-06T14:30:00"), ],
                    ["25", "Tsubasa20240907", "RF2050B", 54000, "KTE", "Complete", new Date("2024-09-07T14:30:00"), ],
                    ["26", "Tsubasa20240908", "RF2050B-BLA2", 75000, "HRD", "Complete", new Date("2024-09-08T14:30:00"), ],
                    ["27", "Tsubasa20240909", "RF2050R", 61000, "KTE", "Complete", new Date("2024-09-09T14:30:00"), ],
                ]
            };
        },

        components: {
            BannerContainer,
            ResultFooterBtn,
        },

        mounted () {
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

        methods: {
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
                }
                #number-input {
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
            height: 500px; /* 固定表格高度 */
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
                    //z-index: 1; /* 使表头在滚动时保持在顶部 */
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
            }
        }
        }
    }
</style>