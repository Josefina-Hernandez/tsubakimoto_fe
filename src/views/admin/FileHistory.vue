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
                        <td>{{ rowIndex + 1 }}</td>
                        <td v-for="([key, value]) in getVisibleEntries(row)" :key="key">
                            {{ key === 'date' ? formatDate(value) : value }}
                        </td>
                        <td>Complete</td>
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

            tableHeaders: ["Date", "File Name", "Type", "Status", "Download"],

            tableData: [],
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted(){
        this.fetchData();
    },

    methods: {
        getVisibleEntries(row) {
            return Object.entries(row).filter(([k]) => k !== 'file_path');
        },

        downloadFile(row) {
            if (!row.file_path) {
                alert("File path not found!");
                return;
            }

            const fileUrl = `${this.apiUrl}/admin/download-excel?path=${encodeURIComponent(row.file_path)}`;

            // 触发下载
            window.open(fileUrl, "_blank");
        },

        formatDate(dateStr) {
            if (!dateStr) return '';

            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr; // 防止解析失败

            date.setHours(date.getHours() - 7);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        },

        async fetchData() {
            await axios.get(`${this.apiUrl}/admin/history-combined`)
            .then(response => {
                //console.log(response.data);
                this.tableData = response.data.data;
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

    /* 移动端适配 */
    @media (max-width: 768px) {
        h3 {
            margin-left: 3%;
            font-size: 17px;
            margin-top: 60px;
        }

        .table-container {
            margin: 15px 2%;
            height: auto;
            max-height: 70vh;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;

            table {
                min-width: 600px;

                thead tr th {
                    font-size: 13px;
                    padding: 0 8px;
                }

                tbody tr {
                    height: 45px;

                    td {
                        font-size: 13px;
                        padding: 3px 8px;
                    }

                    .btn-td {
                        width: auto;
                        padding-right: 10px;

                        button {
                            margin-left: 10px;
                            width: 100px;
                            height: 24px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        .lower-btn {
            justify-content: center;
            padding: 15px;

            button {
                margin-left: 0;
                width: 100%;
                max-width: 300px;
                height: 38px;
                font-size: 15px;
            }
        }
    }

    @media (max-width: 480px) {
        h3 {
            font-size: 16px;
        }

        .table-container {
            table {
                min-width: 500px;

                thead tr th {
                    font-size: 12px;
                }

                tbody tr {
                    height: 40px;

                    td {
                        font-size: 12px;
                    }

                    .btn-td button {
                        width: 80px;
                        height: 22px;
                        font-size: 11px;
                    }
                }
            }
        }

        .lower-btn button {
            height: 36px;
            font-size: 14px;
        }
    }

</style>

