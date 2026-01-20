<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Pricelist Code Addition</h3>

        <div class="filter-wrapper">
            <!-- <div class="label">Detail View</div> -->
            <!-- <div class="custom-dropdown" ref="dropdown">
              <div class="dropdown-selected" @click="toggleDropdown">
                {{ selectedOption }}
              </div>
              <div class="dropdown-options" v-if="isOpen">
                <div class="dropdown-option" v-for="(option, index) in options" :key="index" @click="selectOption(option, index)">
                  {{ option }}
                </div>
              </div>
            </div> -->
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

                            <template v-if="[4, 9, 11, 16, 17, 18].includes(cellIndex)">
                                <select v-model="row[cellIndex]" 
                                        :class="getInputClass(cell, cellIndex)">
                                <option :value="['17', '18'].includes(String(cellIndex)) ? '' : ''">
                                    {{ ['17', '18'].includes(String(cellIndex)) ? '--' : '-Select' }}
                                </option>
                                <option v-for="option in getSelectOptions(cellIndex)" 
                                        :key="option" 
                                        :value="option">
                                    {{ option }}
                                </option>
                                </select>
                            </template>

                            <template v-else>
                                <textarea 
                                    v-model="row[cellIndex]" 
                                    rows="1"
                                    :class="getInputClass(row[cellIndex], cellIndex)"
                                    @input="handleInput(rowIndex, cellIndex, $event)"
                                ></textarea>
                            </template>
                            <!-- <input type="text" v-model="row[cellIndex]"> -->
                        </td>
                        <td>
                            <button class="circle-rm-btn" @click="handleRemove(rowIndex)">
                                -
                            </button>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>

        <div class="add-btn-wrapper">
            <button class="circle-add-btn" @click="handleAddLine">
                +
            </button>
            <button class="btn-add" @click="handleAdd">Add</button>
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

import '@fortawesome/fontawesome-free/css/all.css';

export default {
    data(){
        return{
            rows: 8,
            columns: 4,
            apiUrl: config.apiUrl,
            user_list: [],

            tableHeaders: [
                'Category',
                'Part No.',
                'Old Model No.',
                'New Chain/Model No.',
                'Unit',
                'Manufacturer\'s Suggested Retail Price',
                'Converse on to FT',
                'PO MUL',
                '(TTCL Internal Use) PO Price',
                'PO Price Currency',
                'Remark',
                'Pricelist Name',
                'Standard Price',
                'Dist. PL MUL',
                'Dist. Ex Rate',
                'Detail',
                'Supplier Name',
                'Stock Reference (RPP)',
                'Cutting Assembly',
                'Remove',
            ],

            tableData: [
                ['',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',],
            ],

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

            searchText: '',

            totalItems: 0,
            pageSize: 100,
            sliderPage: 1,
            totalPage: 1,
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted() {
        document.addEventListener('click', this.handleClickOutside);

        this.selectedOption = this.options && this.options[0] ? this.options[0] : '';
        //this.fetchData();
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },

    computed: {
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

    methods: {
        handleRemove(index) {
                if (this.tableData.length > 1) {
                    // 如果多于1行 → 正常删除
                    this.tableData.splice(index, 1);
                } else {
                    // 如果只剩最后一行 → 清空这一行内容
                    this.tableData[0] = new Array(this.tableData[0].length).fill('');
                }
        },

        handleAddLine() {
            this.tableData.push(new Array(19).fill(''));
        },

        handleInput(rowIndex, cellIndex, event) {
            let value = event.target.value;
            
            // 自动大写逻辑
            if ([0, 1, 2, 3, 16].includes(cellIndex)) {
                value = value.toUpperCase();
            }

            // 仅数字（整数）
            // if (cellIndex === 1) {
            //     value = value.replace(/[^0-9]/g, '');
            // }

            // 整数或小数
            if ([5, 6, 7, 8, 12, 13, 14].includes(cellIndex)) {
                value = value.replace(/[^0-9.]/g, '');
                // 避免多个小数点
                const parts = value.split('.');
                if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
            }

            this.tableData[rowIndex][cellIndex] = value;
        },

        // 选择框选项定义
        getSelectOptions(cellIndex) {
            if (cellIndex === 4) return ['BOX', 'FT', 'PC', 'REEL', 'SET'];
            if (cellIndex === 9) return ['EUR', 'JPY', 'USD'];
            if (cellIndex === 11) return [
                'DRIVE CHAIN',
                'SMALL SIZE CONVEYOR CHAIN',
                'SPROCKET',
                'KABELSCHLEPP',
                'SCG GROUP (CAM CLUTCH)',
                'SCG GROUP (CHAIN)',
                'WAREHOUSE PRICELIST',
                'KTE STOCK',
                'OTHER CHAIN (TOP CH., LSCC, CABLEVEYOR)',
                'PTUC PRODUCT (KTE)',
                'PTUC PRODUCT',
                'SUGAR STOCK',
            ];
            if (cellIndex === 16) return [
                'TC - A',
                'TC - B1',
                'TC - B2',
                'TC - C1',
                'TC - D',
                'TC - E',
                'TC - K',
                'TC - G',
                'TTC',
                'MC',
                'MC - TTCL',
                'MC - PTNET',
                'TMS',
                'TINT',
                'TKG',
                'TC - TTCL',
                'TC - PTNET',
            ];
            if (cellIndex === 17) return ['YES', 'TBD'];
            if (cellIndex === 18) return ['YES'];
            return [];
        },

        // 必填项样式
        getInputClass(value, cellIndex) {
            // 定义必填列索引
            const mustFill = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16];

            // 非必填列，直接返回空
            if (!mustFill.includes(cellIndex)) return '';

            // 判断是 select 还是 textarea
            const isSelect = [4, 8, 10, 16, 17].includes(cellIndex);

            // 如果是选择框
            if (isSelect) {
                if (value === '' || value === '-Select' || value === null) {
                return 'required-field';
                }
            } 
            // 如果是输入框
            else {
                if (value === '' || value === null) {
                return 'required-field';
                }
            }

            return '';
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

        goBack() {
            this.$router.push(`/admin/price-list`);
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

        async handleAdd() {
            // 1️⃣ 检查所有行的必填项
            const mustFillCols = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16];
            const selectCols = [4, 9, 11, 17, 18];

            let missingCells = []; // 记录未填单元格
            let validRows = [];

            this.tableData.forEach((row, rowIndex) => {
                let hasMissing = false;

                mustFillCols.forEach((colIndex) => {
                    const value = row[colIndex];

                    // 判断是否为空或未选择
                    const isSelect = selectCols.includes(colIndex);
                    const invalid =
                        (isSelect && (value === '' || value === '-Select' || value === 'None')) ||
                        (!isSelect && (value === '' || value === null));

                    if (invalid) {
                        hasMissing = true;
                        // 加上标记样式
                        this.tableData[rowIndex][colIndex] = value;
                    }
                });

                if (hasMissing) {
                    missingCells.push(rowIndex + 1); // 用于提示第几行
                } else {
                    validRows.push(row);
                }
            });

            // 2️⃣ 如果有未填项 → 弹窗提示
            if (missingCells.length > 0) {
                alert(`Please fill in all required fields!`);
                return;
            }
            console.log(validRows)
            // 3️⃣ 若全部通过 → 发送后端
            try {
                const response = await axios.post(
                    `${this.apiUrl}/admin/adding-page-add-line`,
                    { rows: validRows } // 可一次发多行
                );

                if (response.data.status === 'success') {
                    alert('✅ Data added successfully!');
                    // 清空表格或重置
                    this.tableData = [
                        new Array(18).fill('')
                    ];
                } else {
                    alert(`❌ Add failed: ${response.data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Add failed:', error);
                alert('❌ Add request failed. Please check your connection.');
            }
        }

        // async fetchData(page) {
        //     this.prevCheckedId = null;
        //     try {
        //         const response = await axios.post(`${this.apiUrl}/admin/updating-page-show`, {
        //             page: page,
        //             pageSize: this.pageSize,
        //             priceListNames: [],
        //             keyword: this.searchText,
        //         });

        //         this.totalItems = response.data.total;
        //         this.totalPage = Math.ceil(this.totalItems / this.pageSize);
        //         const rawData = response.data.data;

        //         this.tableData = rawData;

        //     } catch (error) {
        //         console.error("Error fetching master data:", error);
        //     }
        // },
    }
};
</script>

<style scoped lang="less">
    h3{
        margin-left: 2%;
        text-align: left;
        font-size: 19px;
    }

    .filter-wrapper {
        margin-left: 2%;
        margin-top: 20px;
        display: flex;
        align-items: center;
        .label {
            text-align: center;
            font-size: 15px;
            width: 200px;

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
        // .custom-dropdown{
        //     position: relative;
        //     margin-left: 1vw;
            
        //     .dropdown-selected{
        //         font-size: 15px;
        //         width: 350px;
        //         height: 30px;
        //         padding: 0 10px;
        //         border: 1px solid #ccc;
        //         border-radius: 5px;
        //         background-color: #f0f0f0;
        //         cursor: pointer;
        //         display: flex;
        //         align-items: center;
        //         justify-content: space-between;
        //         box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
        //         transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */

        //         &::after {
        //             content: '';
        //             border-left: 6px solid transparent;
        //             border-right: 6px solid transparent;
        //             border-top: 6px solid #333;
        //             margin-left: 10px;
        //             display: inline-block;
        //         }

        //         &:hover {
        //             background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
        //             outline: none; /* 去除默认的聚焦边框 */
        //             box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
        //         }
        //     }
        //     .dropdown-options{
        //         font-size: 15px;
        //         display: block;
        //         position: absolute;
        //         top: 100%;
        //         left: 0;
        //         width: 350px;
        //         border: 1px solid #ccc;
        //         border-radius: 5px;
        //         background-color: #fff;
        //         z-index: 1000;

        //         max-height: 400px;
        //         overflow-y: auto;
        //         box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加轮廓阴影 */
                

        //         .dropdown-option{
        //             padding: 10px;
        //             cursor: pointer;
        //             display: flex;
        //             align-items: center;
        //             justify-content: space-between;
        //             &:hover{
        //             background-color: #f0f0f0;
        //             }
        //         }
        //     }
        // }
    }

    .table-container {
        margin-top: 20px;
        margin-left: 2%;
        margin-right: 2%;
        width: 96%;
        max-height: 75vh; /* 固定表格高度 */
        min-height: 15vh;
        overflow-y: scroll; /* 启用垂直滚动条 */
        border: 1px solid #ddd;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

        //will-change: scroll-position; /* 提示浏览器优化滚动性能 */
        //backface-visibility: hidden; /* 避免元素闪烁或位移 */

        table{
            width: 100%;
            table-layout: fixed;
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
                    //height: 50px;
                    border: 2px solid #F2F2F2 ;
                    
                    td{
                        //text-align: center;
                        vertical-align: top;
                        textarea {
                            font-size: 13px;
                            width: 100%;
                            min-height: 50px;
                            box-sizing: border-box;
                            border: 1px solid #ccc;
                            border-radius: 2px;
                            padding: 2px 3px;
                            color: #333;
                            resize: vertical;
                            white-space: pre-wrap;
                            transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                            &:hover {
                                background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
                            }

                            &:focus {
                                outline: none; /* 去除默认的聚焦边框 */
                                box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.5); /* 聚焦时的轮廓阴影 */
                            }
                        }

                        select {
                            width: 100%;
                            min-height: 50px;
                            font-size: 12px;
                            border: 1px solid #ccc;
                            border-radius: 2px;
                            box-sizing: border-box;
                            //padding: 0 10px;
                            color: #333;
                            transition: all 0.2s ease;
                            text-align: center;

                            appearance: none;          // ✅ 去掉浏览器默认样式
                            //background: white url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path fill='%23333' d='M1 1l5 5 5-5'/></svg>") no-repeat right 10px center;
                            background-size: 9px;
                            padding-right: 0px;       // 留出下拉箭头空间
                            line-height: 1.4; /* ✅ 拉高文字区域 */
                            transition: all 0.2s ease;

                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            appearance: none;          /* 隐藏系统默认箭头（可选） */

                            cursor: pointer;

                            &:hover {
                                background-color: #f0f4f8;
                            }

                            &:focus {
                                outline: none;
                                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
                            }
                        }

                        .required-field {
                            background-color: #fff8cc; /* 浅黄色 */
                            border: 2px solid red;
                        }

                        .circle-rm-btn {
                            margin-top: 8px;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;                // ✅ 圆形
                            background-color: #AC0000;        // 蓝色背景
                            color: white;                      // 加号颜色
                            font-size: 24px;                   // 加号大小
                            font-weight: bold;
                            border: none;
                            cursor: pointer;
                            display: inline-flex;                     // 居中对齐
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // 阴影
                            transition: all 0.2s ease;

                            &:hover {
                                background-color: #7e0101;      // 悬停颜色
                                transform: scale(1.1);           // 放大一点
                            }

                            &:active {
                                transform: scale(0.95);          // 点击时缩小一点
                            }
                        }
                    }
                    
                }
            }
    
        }
    }

    .add-btn-wrapper {
        position: relative;
            margin-top: 10px;
            margin-left: 2%;
            margin-right: 2%;
            display: flex;
            justify-content: space-between;

        .circle-add-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;                // ✅ 圆形
            background-color: #4472c4;         // 蓝色背景
            color: white;                      // 加号颜色
            font-size: 24px;                   // 加号大小
            font-weight: bold;
            border: none;
            cursor: pointer;
            display: flex;                     // 居中对齐
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // 阴影
            transition: all 0.2s ease;

            &:hover {
                background-color: #284782;       // 悬停颜色
                transform: scale(1.1);           // 放大一点
            }

            &:active {
                transform: scale(0.95);          // 点击时缩小一点
            }
        }

        .btn-add {
            width: 8vw;
            height: 30px;
            margin-left: 30px;
            vertical-align: bottom;
            background-color: #4472c4;
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
              font-size: 16px;
            }

            &:hover{
              background-color: #284782;
              transform: translate(3px, 3px);

              span{
                top: 2px;
                left: 2px;
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

