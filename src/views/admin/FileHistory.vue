<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>File Upload History</h3>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th class="first">No.</th>
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

        <div class="lower-btn">
            <button @click="goBack"><span>Back</span></button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import config from '@/config'
import BannerAdmin from '@/components/admin/BannerAdmin.vue'
export default {
    data(){
        return{
            rows: 8,
            columns: 4,
            apiUrl: config.apiUrl,
            user_list: [],

            tableHeaders: ["Date", "File Name", "Update by", "All/Part", "Status", "Download"],

            tableData: [
                    ["1",  new Date("2024-08-18T14:30:00"), "Pricelist_20240818_new", "Admin", "All", "Complete",],
                    ["2",  new Date("2024-08-17T11:30:00"), "Pricelist_model_0003", "Admin", "Part", "Complete",],
                    ["3",  new Date("2024-07-16T22:30:00"), "Pricelist_model_0005", "Admin", "Part", "Complete",],
                    ["4",  new Date("2024-06-10T22:30:00"), "Pricelist_20240610_new", "Admin", "All", "Complete",],
                    ["5",  new Date("2024-05-16T14:30:00"), "Pricelist_model_0022", "Admin", "Part", "Complete",],
                    ["6",  new Date("2024-04-19T14:30:00"), "Pricelist_20240419_new", "Admin", "All", "Complete",],
                    ["7",  new Date("2024-03-10T14:30:00"), "Pricelist_20240310_new", "Admin", "All", "Complete",],
                    ["8",  new Date("2024-08-18T14:30:00"), "Pricelist_20240818_new", "Admin", "All", "Complete",],
                    ["9",  new Date("2024-08-17T11:30:00"), "Pricelist_model_0003", "Admin", "Part", "Complete",],
                    ["10",  new Date("2024-07-16T22:30:00"), "Pricelist_model_0005", "Admin", "Part", "Complete",],
                    ["11",  new Date("2024-06-10T22:30:00"), "Pricelist_20240610_new", "Admin", "All", "Complete",],
                    ["12",  new Date("2024-05-16T14:30:00"), "Pricelist_model_0022", "Admin", "Part", "Complete",],
                    ["13",  new Date("2024-04-19T14:30:00"), "Pricelist_20240419_new", "Admin", "All", "Complete",],
                    ["14",  new Date("2024-03-10T14:30:00"), "Pricelist_20240310_new", "Admin", "All", "Complete",],
                ],
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted(){
        this.fetchData();
    },

    methods: {
        downloadFile(index){
            alert("Download file " + index[2] + " !");
        },

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

        fetchData() {
            axios.get(`${this.apiUrl}/users`)
            .then(response => {
                //console.log(response.data);
                this.user_list = response.data;
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        },

        goBack(){
            this.$router.push('/admin/price-list')
        },
    }
};
</script>

<style scoped lang="less">
    h3{
        margin-left: 6%;
        text-align: left;
        font-size: 19px;
    }

    .table-container {
            margin-top: 20px;
            margin-left: 2%;
            margin-right: 2%;
            width: 96%;
            height: 80vh; /* 固定表格高度 */
            overflow-y: auto; /* 启用垂直滚动条 */
            border: 1px solid #ddd;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

            //will-change: scroll-position; /* 提示浏览器优化滚动性能 */
            //backface-visibility: hidden; /* 避免元素闪烁或位移 */

            table{
                    width: 100%;
                    border-collapse: collapse;

                    thead {
                        background-color: #F2F2F2;
                        //background-color: #03e995;
                        opacity: 1;
                        position: sticky;
                        top: 0px;
                        z-index: 1; /* 使表头在滚动时保持在顶部 */
                        height: 35px;

                        tr {                        
                            th {
                                font-size: 15px;
                                font-weight: bold;
                                padding: 0 10px;
                            }
                            
                            .first {
                                width: 50px; /* 调整宽度，根据需要设置具体的值 */
                                text-align: center; /* 可选：将内容居中 */
                                padding: 0 20px;
                            }
                        }
                    }

                    tbody {
                        tr {
                            height: 50px;
                            border: 2px solid #F2F2F2 ;
                            
                            td{
                                font-size: 15px;
                                padding: 3px 10px;
                            }

                            .btn-td{
                                width: 90px;
                                padding-right: 15px;
                                button {
                                    margin-left: 20px;
                                    background-color:  #00AAEE;
                                    width: 130px;
                                    height: 25px;
                                    border: none;
                                    border-radius: 3px;
                                    color: white;
                                    font-size: 14px;
                                    cursor: pointer;
                                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                    span {
                                        position: relative; 
                                        top: 0;
                                        left: 0;
                                        transition: top 0.2s ease, left 0.2s ease;
                                    }

                                    &:hover{
                                        background-color: #0082B3;
                                        transform: translate(2px, 2px);
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
    .lower-btn{
            position: relative;
            margin-top: 10px;
            display: flex;
            button{
                margin-left: 2%;
                width: 150px;
                height: 28px;
                border-radius: 5px;
                background-color: #4472C4;
                border: none;
                color: white;
                font-size: 17px;
                cursor: pointer;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                &:hover{
                    background-color: #284782;
                    transform: translate(2px, 2px);
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
        }

</style>

