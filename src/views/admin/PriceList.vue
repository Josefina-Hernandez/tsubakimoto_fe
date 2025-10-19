<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Price List File Upload</h3>

        <div class="jpy-banner">JPY Cost</div>

        <div class="jpy-wrapper">
            <div class="label">Upload JPY Cost</div>
            <button @click="triggerFileInput(1)"><span>Select File</span></button>
            <input type="text" v-model="filePath1" readonly @click="triggerFileInput(1)">
            <button><span>Upload</span></button>
            <!-- 隐藏的文件输入 -->
            <input type="file" ref="fileInput1" @change="handleFileChange(1)" style="display: none;" accept=".xlsx">
        </div>

        <div class="master-banner-wrapper">
            <div class="master-banner">Master File</div>

            <div class="custom-dropdown" ref="dropdown">
              <div class="dropdown-selected" @click="toggleDropdown">
                {{ selectedOption }}
              </div>
              <div class="dropdown-options" v-if="isOpen">
                <div class="dropdown-option" v-for="(option, index) in options" :key="index" @click="selectOption(option, index)">
                  {{ option }}
                </div>
              </div>
            </div>
        </div>
        
        <div class="master-dl-wrapper">
            <div class="label">Download Excel File</div>
            <button><span>Download</span></button>
        </div>

        <div class="master-up-wrapper">
            <div class="label">Upload Excel File</div>
            <button @click="triggerFileInput(2)"><span>Select File</span></button>
            <input type="text" v-model="filePath2" readonly @click="triggerFileInput(2)">
            <button><span>Upload</span></button>
            <input type="file" ref="fileInput2" @change="handleFileChange(2)" style="display: none;" accept=".xlsx">
        </div>

        <div class="last-wrapper">
            <div class="left">
                <div class="label">Show Upload History</div>
                <button @click="toHistory"><span>History</span></button>
            </div>
            <div class="right">
                <div class="label">Price List Code Updating</div>
                <button @click="toCodeUpdating"><span>Upldate/Delete</span></button>
                <button @click="toCodeAdding"><span>Add</span></button>
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
            isOpen: false,
            selectedOption: '',

            options: [
                'Drive Chain',
                'Sprocket',
                'Small Size',
                'JPY Chain(KTE/Tsubaco)',
                'JPY Chain(Planet)',
                'Warehouse',
                'KTE Stock',
                'JPY PTUC(KTE)',
                'JPY PTUC(Other dist)',
                'SCG Group(CHAIN)',
                'SCG Group(Cam Clutch)',
                'Kableschlepp',
                'Sugar Stock',
            ],

            rows: 8,
            columns: 4,
            apiUrl: config.apiUrl,
            user_list: [],
            // selectedMode: 'all',

            tableHeaders: [
                'Category',
                'Part No.',
                'Old Model No.',
                'New Chain/Model No.',
                'Unit',
                'Manufacturer\'s Suggested Retail Price',
                'New Cost',
                '% Diff for Cost',
                'PO Multiplier',
                'PO Price JPY/USD',
                'Cost THB',
                'GP',
                'SP THB(Show in PLS)',
                'SP THB After Cost Update',
                '% Diff for SP',
                'Pricelist Name',
            ],

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
            
            filePath1: '',
            filePath2: '',
            file1: null,
            file2: null,
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted() {
        document.addEventListener('click', this.handleClickOutside);

        this.selectedOption = this.options && this.options[0] ? this.options[0] : '';
        this.fetchData();
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },

    methods: {
        toCodeAdding() {
            this.$router.push('/admin/code-adding');
        },
        toCodeUpdating() {
            this.$router.push('/admin/code-updating');
        },

        toHistory() {
            this.$router.push('/admin/history');
        },

        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },

        selectOption(option, index) {
            this.selectedOption = option;
            this.isOpen = false;
        },

        handleClickOutside(event) {
            const dropdown = this.$refs.dropdown;
            if (dropdown && !dropdown.contains(event.target)) {
                this.isOpen = false;
            }
        },

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

        triggerFileInput(index) {
            if (index === 1) {
                this.file1 = null;
                this.filePath1 = '';
                this.$refs.fileInput1.click();
            } else if (index === 2) {
                this.file2 = null;
                this.filePath2 = '';
                this.$refs.fileInput2.click();
            }
        },

        handleFileChange(index) {
            const file = this.$refs[`fileInput${index}`].files[0];

            if (file) {
                if (index === 1) {
                    this.file1 = file;
                    this.filePath1 = file.name;
                } else if (index === 2) {
                    this.file2 = file;
                    this.filePath2 = file.name;
                }
            } else {
                if (index === 1) {
                    this.file1 = null;
                    this.filePath1 = '';
                } else if (index === 2) {
                    this.file2 = null;
                    this.filePath2 = '';
                }
            }
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
        font-size: 19px;
    }
    .jpy-banner {
        margin-left: 6%;
        text-align: center;
        font-size: 15px;
        margin-top: 10px;

        width: 337px;

        background: linear-gradient(to bottom, #6699ff 0%, #3366cc 100%);
        //border: 1px solid #204a87;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        padding: 6px 20px;
        box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.5),
                    inset 0 -2px 3px rgba(0, 0, 0, 0.4),
                    0 2px 4px rgba(0, 0, 0, 0.3);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        //cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
    .jpy-wrapper {
        margin-left: 6%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .label {
            font-size: 17px;
            text-align: left;
            width: 170px;
        }
        button {
            margin-left: 1vw;
            height: 24px;
            width: 150px;
            border-radius: 5px;
            background-color: #4472c4;
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

            &:hover {
                background-color: #284782;
                transform: translate(2px, 2px);
            }

            span {
                font-size: 15px;
                position: relative;
                top: 0;
                left: 0;
                transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
            }

            &:hover span{
                top: 2px;
                left: 2px;
            }
        }
        input {
            margin-left: 1vw;
            height: 24px;
            width: 350px;
            border-radius: 4px;
            border: 1px solid grey;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 0 10px;
            vertical-align: middle;
            font-size: 13px;
            transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
            cursor: pointer;
        }
    }

    .master-banner-wrapper {
        margin-left: 6%;
        margin-top: 24px;
        display: flex;
        align-items: center;
        .master-banner {
            text-align: center;
            font-size: 15px;
            width: 337px;
            min-width: 337px;
            background: linear-gradient(to bottom, #6699ff 0%, #3366cc 100%);
            //border: 1px solid #204a87;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            padding: 6px 20px;
            box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.5),
                        inset 0 -2px 3px rgba(0, 0, 0, 0.4),
                        0 2px 4px rgba(0, 0, 0, 0.3);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            //cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        .custom-dropdown{
            position: relative;
            margin-left: 1vw;
            
            .dropdown-selected{
                font-size: 15px;
                width: 350px;
                height: 30px;
                padding: 0 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f0f0f0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */

                &::after {
                    content: '';
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 6px solid #333;
                    margin-left: 10px;
                    display: inline-block;
                }

                &:hover {
                    background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
                    outline: none; /* 去除默认的聚焦边框 */
                    box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
                }
            }

            .dropdown-options{
                font-size: 15px;
                display: block;
                position: absolute;
                top: 100%;
                left: 0;
                width: 350px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #fff;
                z-index: 1000;

                max-height: 400px;
                overflow-y: auto;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加轮廓阴影 */
                

                .dropdown-option{
                    padding: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    &:hover{
                    background-color: #f0f0f0;
                    }
                }
            }
        }
    }
    

    .master-dl-wrapper {
        margin-left: 6%;
        margin-top: 15px;
        display: flex;
        align-items: center;
        .label {
            font-size: 17px;
            text-align: left;
            width: 170px;
        }
        button {
            margin-left: 1vw;
            height: 24px;
            width: 150px;
            border-radius: 5px;
            background-color: #4472c4;
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

            &:hover {
                background-color: #284782;
                transform: translate(2px, 2px);
            }

            span {
                font-size: 15px;
                position: relative;
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

    .master-up-wrapper {
        margin-left: 6%;
        margin-top: 15px;
        display: flex;
        align-items: center;
        .label {
            font-size: 17px;
            text-align: left;
            width: 170px;
        }
        button {
            margin-left: 1vw;
            height: 24px;
            width: 150px;
            border-radius: 5px;
            background-color: #4472c4;
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

            &:hover {
                background-color: #284782;
                transform: translate(2px, 2px);
            }

            span {
                font-size: 15px;
                position: relative;
                top: 0;
                left: 0;
                transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
            }

            &:hover span{
                top: 2px;
                left: 2px;
            }
        }
        input {
            margin-left: 1vw;
            height: 24px;
            width: 350px;
            border-radius: 4px;
            border: 1px solid grey;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 0 10px;
            font-size: 13px;
            transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
            cursor: pointer;
        }
    }

    .last-wrapper {
        margin-left: 6%;
        margin-top: 20px;
        display: flex;
        align-items: center;

        .left {
            display: flex;
            align-items: center;
            .label {
                font-size: 17px;
                text-align: left;
                width: 170px;
            }
            button {
                margin-left: 1vw;
                height: 24px;
                width: 150px;
                border-radius: 5px;
                background-color: #4472c4;
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                &:hover {
                    background-color: #284782;
                    transform: translate(2px, 2px);
                }

                span {
                    font-size: 15px;
                    position: relative;
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
        .right {
            margin-left: 25vw;
            display: flex;
            align-items: center;
            .label {
                font-size: 17px;
                text-align: left;
                width: 200px;
                white-space: nowrap;
            }
            button {
                margin-left: 1vw;
                height: 24px;
                width: 150px;
                border-radius: 5px;
                background-color: #4472c4;
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                &:hover {
                    background-color: #284782;
                    transform: translate(2px, 2px);
                }

                span {
                    font-size: 15px;
                    position: relative;
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
    }

    .table-container {
            margin-top: 20px;
            margin-left: 2%;
            margin-right: 2%;
            width: 96%;
            height: 50vh; /* 固定表格高度 */
            overflow-y: auto; /* 启用垂直滚动条 */
            border: 1px solid #ddd;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);


            //will-change: scroll-position; /* 提示浏览器优化滚动性能 */
            //backface-visibility: hidden; /* 避免元素闪烁或位移 */

            table{
                    width: 100%;
                    border-collapse: collapse;

                    thead {
                        background-color: #4472C4;
                        //background-color: #03e995;
                        color: white;
                        opacity: 1;
                        position: sticky;
                        top: 0px;
                        z-index: 1; /* 使表头在滚动时保持在顶部 */
                        height: 35px;
                        

                        tr {                        
                            th {
                                font-size: 13px;
                                font-weight: normal;
                                padding: 0 10px;
                            }
                        
                        }
                    }

                    tbody {
                        tr {
                            //height: 50px;
                            border: 2px solid #F2F2F2 ;
                            td {
                                font-size: 13px;
                                padding: 3px 5px;
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

