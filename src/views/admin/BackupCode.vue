<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Price List File Upload</h3>
        <div class="radios">
            <label class="custom-radio">
                <input type="radio" value="all" v-model="selectedMode" />
                <span class="radio-circle"></span>
                <div class="text">Upload All Data</div>
            </label>
            <label class="custom-radio">
                <input type="radio" value="part" v-model="selectedMode" />
                <span class="radio-circle"></span>
                <div class="text">Upload Part Data</div>
            </label>
        </div>

        <div class="nav-price">
            <button @click="triggerFileInput"><span>Select File</span></button>
            <input type="text" v-model="filePath" readonly @click="triggerFileInput">
            <button @click="uploadExcelFile"><span>Upload</span></button>
            <!-- 隐藏的文件输入 -->
            <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" accept=".xlsx">
        </div>

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
            selectedMode: 'all',

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
            
            filePath: '',
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted(){
        this.fetchData();
    },

    methods: {
        uploadExcelFile(){
            if (!this.filePath) {
                alert('Please select the excel file first!');
                return;
            }
            var type = ''
            if (this.selectedMode === "all"){
                type = 'all-type';
            } else {
                type = 'part-type';
            }
            alert("Uploaded " + type + ' file ' + this.filePath + "!"  );
        },

        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.filePath = file.name; // 设置文件名到输入框
            }
        },

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

        goToRegisterPage(){
            this.$router.push('/admin/register-user')
        },

        goToManagePage(){
            this.$router.push('/admin/user-management')
        },

        goBack(){
            this.$router.push('/admin/select')
        },
    }
};
</script>

<style scoped lang="less">
    h3{
        margin-left: 6%;
        text-align: left;
        font-size: 21px;
    }
    .radios {
        margin-left: 6%;
        display: flex; /* 使用 flex 布局 */
        flex-direction: column; /* 垂直排列 */
        align-items: flex-start; /* 对齐到最左边 */
        gap: 10px; /* 为每个 radio 按钮添加间距 */
        margin-top: 25px;

        .custom-radio {
                display: flex; /* 在 div 内部使用 flex 布局 */
                align-items: center; /* 垂直居中对齐 radio 按钮和文本 */
                position: relative;
                padding-left: 40px;
                cursor: pointer;

                input[type="radio"] {
                    left: 0;
                    top: 0;
                    position: absolute;
                    opacity: 0; /* 隐藏原有的 radio 按钮 */
                }

                .radio-circle {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px; /* 圆圈的直径 */
                    height: 20px; /* 圆圈的直径 */
                    border-radius: 50%; /* 使其变成圆形 */
                    border: 1px solid #4472C4; /* 圆圈的边框 */
                    background-color: #eff3f8; /* 圆圈的背景颜色 */
                }

                input[type="radio"]:checked + .radio-circle {
                    background-color: #4472C4; /* 选中时的背景颜色 */
                    border-color: #4472C4; /* 选中时的边框颜色 */
                }

                input[type="radio"]:checked + .radio-circle::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px; /* 内部小圆点的直径 */
                    height: 10px; /* 内部小圆点的直径 */
                    border-radius: 50%; /* 内部小圆点的圆形 */
                    background-color: #eff3f8; /* 内部小圆点的颜色 */
                }
                .text{
                    font-size: 18px; /* 调整文本的字体大小 */
                    line-height: 1.5; /* 调整文本行高以确保垂直居中 */
                    margin-left: 10px;
                }
        }
    }

    .nav-price{
        display: flex;
        margin-left: 6%;
        margin-top: 30px;
        button{
                width: 150px;
                height: 40px;
                border-radius: 5px;
                background-color: #4472C4;
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
        input{
            width: 450px;
            margin-left: 30px;
            margin-right: 30px;
            border: 1px solid #e0dede;
            border-radius: 5px;
            font-size: 17px;
            color: #656363;
            padding: 0 10px;
            cursor: pointer;
        }
    }

    .table-container {
            margin-top: 20px;
            margin-left: 5%;
            margin-right: 5%;
            width: 90%;
            height: 420px; /* 固定表格高度 */
            overflow-y: auto; /* 启用垂直滚动条 */
            border: 1px solid #ddd;

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
                        height: 50px;

                        tr {                        
                            th {
                                //border: 1px solid white;
                            }
                            
                            .first {
                                width: 50px; /* 调整宽度，根据需要设置具体的值 */
                                text-align: center; /* 可选：将内容居中 */
                                padding: 0 15px;
                            }
                        }
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
    .lower-btn{
            position: relative;
            margin-top: 30px;
            display: flex;
            button{
                margin-left: 6%;
                width: 150px;
                height: 40px;
                border-radius: 5px;
                background-color: #4472C4;
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
        }

    /* 移动端适配 */
    @media (max-width: 768px) {
        h3 {
            margin-left: 3%;
            font-size: 18px;
            margin-top: 60px;
        }

        .radios {
            margin-left: 3%;
            margin-top: 15px;
            gap: 8px;

            .custom-radio {
                padding-left: 35px;

                .radio-circle {
                    width: 18px;
                    height: 18px;
                }

                input[type="radio"]:checked + .radio-circle::after {
                    width: 8px;
                    height: 8px;
                }

                .text {
                    font-size: 15px;
                }
            }
        }

        .nav-price {
            flex-direction: column;
            margin-left: 3%;
            margin-right: 3%;
            margin-top: 20px;
            gap: 10px;

            button {
                width: 100%;
                max-width: 300px;
                height: 38px;
                font-size: 15px;
            }

            input {
                width: 100%;
                margin: 0;
                height: 38px;
                font-size: 15px;
            }
        }

        .table-container {
            margin: 15px 2%;
            width: 96%;
            height: auto;
            max-height: 350px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;

            table {
                min-width: 600px;

                thead {
                    height: 40px;

                    tr th {
                        font-size: 13px;
                    }
                }

                tbody tr {
                    height: 45px;

                    .btn-td {
                        width: auto;
                        padding-right: 10px;

                        button {
                            margin-left: 10px;
                            width: 80px;
                            height: 26px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        .lower-btn {
            justify-content: center;
            padding: 15px 3%;

            button {
                margin-left: 0;
                width: 100%;
                max-width: 300px;
                height: 40px;
                font-size: 15px;
            }
        }
    }

    @media (max-width: 480px) {
        h3 {
            font-size: 16px;
        }

        .radios .custom-radio .text {
            font-size: 14px;
        }

        .nav-price {
            button, input {
                height: 36px;
                font-size: 14px;
            }
        }

        .table-container {
            max-height: 300px;

            table {
                min-width: 500px;

                thead tr th {
                    font-size: 12px;
                }

                tbody tr {
                    height: 40px;

                    .btn-td button {
                        width: 70px;
                        height: 24px;
                        font-size: 11px;
                    }
                }
            }
        }

        .lower-btn button {
            height: 38px;
            font-size: 14px;
        }
    }

</style>

