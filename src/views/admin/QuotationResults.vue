<template>
    <div class="quotation-results">
        <BannerAdmin />
    </div>

    <div class="container">
        <div class="filters">
            <div class="left">
                <label>Sort by Date</label>
                <DatePicker v-model="startDate" type="date" class="date-picker" />
                <span>--- </span>
                <DatePicker v-model="endDate" type="date" class="date-picker" />
            </div>
            <div class="middle">
                <button @click="switchMode">View Mode</button>
            </div>
            <div class="right">
                <label>Quotation No.</label>
                <input type="text" v-model="quotationNo" placeholder="Input quotation no.">
                <button @click="search">Search</button>
            </div>
            
        </div>

        <div class="user-table" v-show="isShow">
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Quotation No.</th>
                        <th>Product Code</th>
                        <th>Price</th>
                        <th>User Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in paginatedData" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.quotation_no }}</td>
                        <td>{{ item.product_code }}</td>
                        <td>{{ formatPrice(item.price) }}</td>
                        <td>{{ item.user_type }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ formatDate(item.date) }}</td>
                        <td><button class="btn-download">Download</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="page-btn" v-show="isShow">
            <button @click="prevPage" :disabled="currentPage === 1" class="prepage">Previous</button>
            <span>{{ currentPage }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="nextpage">Next</button>
        </div>

        <!--图开始-->
        <div class="grafics" v-show="isGrafic">
            <div class="pie">
                <canvas ref="pieChartCanvas"></canvas>
            </div>
            
            <div class="bar">
                <canvas ref="barChartCanvas"></canvas>
            </div>
            
        </div>
        <!--图结束-->

        <div class="lower-btn">
            <button @click="goBack" class="back">Back</button>
            <button @click="saveToExcel" class="save">Save</button>          
        </div>
    </div>
</template>

<script>
import BannerAdmin from '@/components/admin/BannerAdmin.vue';

import DatePicker from "vue3-datepicker";

import axios from 'axios';
import config from '@/config'

import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';


export default { 
    components: {
        BannerAdmin,
        DatePicker,
    },

    setup() {
        const pieChartCanvas = ref(null);
        const barChartCanvas = ref(null);


        onMounted(() => {
            const pieChartCtx = pieChartCanvas.value.getContext('2d');
            const barChartCtx = barChartCanvas.value.getContext('2d');

            new Chart(pieChartCtx, {
                type: 'pie',
                data: {
                    labels: ['KDR', 'KTE', 'NICHIDEN', 'PLANET', 'TKT', 'HRD'],
                    datasets: [{
                        label: 'Quotation QTY',
                        data: [23, 23, 39, 105, 12, 92],
                        backgroundColor: ['red', 'blue', 'yellow', 'green', 'pink', 'orange'],
                    }],
                },

                options: {
                    responsive: true, // 允许图表自适应大小
                    //maintainAspectRatio: false, // 不保持纵横比
                    width: 200, // 设置宽度
                    height: 200, // 设置高度
                    plugins: {
                        title: {
                        display: true,
                        text: 'Quotation query times of each Agency', // 设置标题文本
                        },
                    },
                },
            });

            new Chart(barChartCtx, {
                    type: 'bar',
                    data: {
                        labels: ['KDR', 'KTE', 'NICHIDEN', 'PLANET', 'TKT', 'HRD'],
                        datasets: [{
                            label: 'Quotation Total Amount',
                            data: [129898, 198884, 366727, 890000, 124434, 754448],
                            backgroundColor: ['red', 'blue', 'yellow', 'green', 'pink', 'orange'],
                        }],
                    },
                    options: {
                        responsive: true, // 允许图表自适应大小
                        maintainAspectRatio: false, // 不保持纵横比
                        width: 400, // 设置宽度
                        height: 300, // 设置高度
                        plugins: {
                            title: {
                            display: true,
                            text: 'Quotation Total Amount of each Agency', // 设置标题文本
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => `${value} Baht`, // 设置单位
                                },
                            },
                        },
                    },
                });
        });

        return {
            pieChartCanvas,
            barChartCanvas,
        };
    },

    data() {
        return {
            chartData: [], // 图表数据
            chartOptions: {}, // 图表选项

            data: [], // 从后端获取的数据
            filteredData: [], // 根据检索条件过滤后的数据
            currentPage: 1,
            pageSize: 100,
            startDate: null,
            endDate: null,
            quotationNo: "",
            apiUrl: config.apiUrl,
            isShow: false,
            isGrafic: true,
            orangeTest: 7,
        };
    },

    computed: {
        totalPages() {
            return Math.ceil(this.data.length / this.pageSize);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.data.slice(start, end);
        }
    },
    methods: {
        switchMode(){
            this.isShow = !this.isShow;
            this.isGrafic = !this.isShow;
        },
        formatPrice(value) {
            // 检查是否为有效数字
            if (!isNaN(value)) {
            // 使用 toLocaleString 方法添加千分号
            return Number(value).toLocaleString();
            }
            return value;
        },

        formatDate(value) {
            const date = new Date(value);
            const formattedDate = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}-${date.toLocaleString(
                "default",
                { month: "short" }
            )} ${date.getFullYear()}`;
            return formattedDate;
        },
        search() {
            // 根据检索条件过滤数据
            this.filteredData = this.data.filter(item => {
                const isQuotationMatch =
                !this.quotationNo || item.quotationNo.includes(this.quotationNo);
                const isDateMatch =
                (!this.startDate && !this.endDate) ||
                (item.date >= this.startDate && item.date <= this.endDate);
                return isQuotationMatch && isDateMatch;
            });
            // 重置当前页码为第一页
            this.currentPage = 1;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        saveToExcel() {
            // 将表格数据保存为Excel
            // 根据实际需求调用相应的库或方法来处理保存逻辑
            // 例如使用xlsx.js等库来生成Excel文件
            // 可参考相关文档和示例代码实现保存逻辑
            console.log("Save to Excel");
        },
        goBack() {
            // 返回上一页或执行其他回退操作
            this.$router.push('/admin/select')
        },
        fetchData() {
            axios.get(`${this.apiUrl}/quotation-results`)
            .then(response => {
                //console.log(response.data);
                this.data = response.data;
                this.chartData = this.data;
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        },
    },
    mounted() {
        let now = new Date();
        this.endDate = now;

        let before = new Date();
        before.setDate(before.getDate() - 30);
        this.startDate = before;

        this.fetchData();
        // 模拟从后端获取数据
        /*this.data = [
        // 数据示例，根据实际情况进行替换
        {
            id: 1,
            quotationNo: "Tsubasa20220505",
            productCode: "RF2050R",
            price: 62000,
            userType: "KTE",
            status: "Complete",
            date: "15:00 01-May-2022"
        },
        // ... 更多数据项
        ]; */
        // 初始化时将所有数据作为过滤后的数据
        this.filteredData = this.data;
    }
};
</script>

<style scoped lang="less">
    .container{
        .filters{
            display: flex;
            align-items: center;
            margin-left: 100px;
            margin-top: 30px;
            .left{
                display: flex;
                align-items: center;
                font-size: 19px;

                label {
                    margin-right: 10px;
                }
                :deep(.date-picker){
                    display: flex;
                    align-items: center;
                    margin-left: 10px;
                    margin-right: 10px;

                    width: 200px;
                    height: 30px;
                    font-size: 19px;
                    color: #284782;

                    &:hover{
                        cursor: pointer;
                        background: #C5D2ED;
                    }
                }
                span{
                    margin-left: 10px;
                    margin-right: 10px;
                }
            }
            .middle{
                button{
                    margin-left: 10px;
                    font-size: 15px;
                    width: 150px;
                    height: 30px;
                    background-color: #00AAEE;
                    color: white;
                    border: none;
                    border-radius: 3px;

                    &:hover{
                        background-color: #008FC6;
                        cursor: pointer;
                    }                   
                }
            }
            .right{
                margin-left: auto;
                margin-right: 100px;
                
                label {
                    margin-right: 10px;
                    font-size: 19px;
                }


                input[type="text"] {
                    margin-right: 10px;
                    width: 250px;
                    height: 30px;
                    font-size: 19px;
                }

                button {
                    margin-left: 10px;
                    font-size: 19px;
                    width: 150px;
                    height: 30px;
                    background-color: #00AAEE;
                    color: white;
                    border: none;
                    border-radius: 3px;

                    &:hover{
                        background-color: #008FC6;
                        cursor: pointer;
                    }
                }
            }

        }

        .user-table{
            display: flex;
            justify-content: center;
            margin-top: 20px;
            margin-left: 100px;
            margin-right: 100px;
            height: 450px;
            overflow: visible;

            table{
                position: relative;
                border-collapse: collapse;
                width: 100%;
                height: 100%;
                background-color: white;  // 设置背景颜色
                //box-shadow: 0 1px 3px rgba(0,0,0,0.2);  // 添加阴影效果
                overflow: visible;

                thead{
                position: sticky;
                top: 0;
                z-index: 1; 
                //border-top: 2px solid #00AAEE; //固定顶部边框，并更改颜色
                        
                th{
                    background-color: #f2f2f2;
                    //border: 2px solid #00AAEE;  // 更改边框颜色
                    padding: 8px;
                    text-align: center;
                    line-height: 30px;
                    font-family: Arial, sans-serif;  // 更改字体
                }
                }

                tbody{
                    display: block;
                    height: 350px;
                    overflow: auto;
                    font-size: 13px;

                    td{
                        border: 1px solid #f2f2f2;  // 更改边框颜色
                        padding: 8px;
                        text-align: center;
                        line-height: 30px;
                        font-family: Arial, sans-serif;  // 更改字体
                    }

                    .btn-download{
                        border: none;
                        background-color: #4472C4;
                        color: white;
                        border-radius: 5px;
                        width: 100px;
                        height: 25px;
                        font-size: 13px;
                        &:hover{
                            cursor: pointer;
                        }
                    }

                }

                thead, tbody tr {
                display: table; // 添加display: table;
                width: 100%;
                table-layout: fixed; // 添加table-layout: fixed;

                }
            
            }
        }

        .page-btn{
            span{
                margin-left: 20px;
                margin-right: 20px;
            }
        }

        .grafics{
            margin-left: 5vw;
            margin-right: 5vw;
            margin-top: 30px;
            display: flex;
            align-items: center;
            .pie{
                height: 500px;
                width: 500px;
                margin-left: 100px;
            }
            .bar{
                margin-left: auto;
                margin-right: 100px;
                height: 500px;
                width: 500px;
            }
        }
        .lower-btn{
            position: relative;
            margin-top: 10px;
            display: flex;
            button{
                margin-left: 100px;
                width: 150px;
                height: 40px;
                border-radius: 5px;
                background-color: #00AAEE;
                border: none;
                color: white;
                font-size: 17px;
                cursor: pointer;

                &:hover{
                    background-color: #284782;
                }

                span{
                    position: relative; /* 添加相对定位 */
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
                }

                &:hover span{
                    top: 2px;
                    left: 2px;
                }
            }
            .save{
                margin-left: auto;
                margin-right: 100px
            }
        }
    }

</style>