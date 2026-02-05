<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Pricelist Code Updating / Deleting</h3>

        <div class="filter-wrapper">
            <div class="label">Model No.</div>
            <input v-model="searchText" type="text" placeholder="Pevious/New Model No." @keyup.enter="searchPrice">
            <button @click="searchPrice"><span>Search</span></button>
        </div>

        <div class="table-container">
            <table>
                <colgroup>
                    <col style="width: 3%;" />
                    <col style="width: 5%;" />
                    <col style="width: 9%;" />
                    <col style="width: 12%;" />
                    <col style="width: 10%;" />
                    <col style="width: 4%;" />
                    <col style="width: 4%;" />
                    <col style="width: 10%;" />
                    <col style="width: 10%;" />
                    <col style="width: 6%;" />
                    <col style="width: 7%;" />
                </colgroup>
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
                            <template v-if="cellIndex === 4 || cellIndex === 5 || cellIndex === 6">
                                <select 
                                    v-model="row[cellIndex]" 
                                    class="custom-select"
                                    @change="markRowChanged(rowIndex)"
                                >
                                    <option v-for="(option, idx) in dropdownOptions[cellIndex]" :key="idx" :value="option">
                                        {{ option }}
                                    </option>
                                </select>
                            </template>

                            <template v-else>
                                <input 
                                    type="text" 
                                    v-model="row[cellIndex]"
                                    :class="{
                                        'uppercase-input': cellIndex === 0 || cellIndex === 2 || cellIndex === 3,
                                        'warning-bg': cellIndex === 3 & !row[3],
                                    }"
                                    @input="handleInput(rowIndex, cellIndex, $event)"
                                >
                            </template>
                        </td>
                        <td class="btn-save">
                            <button
                                :disabled="!rowChanged[rowIndex] || !row[3]"
                                :class="{ disabled: !rowChanged[rowIndex] || !row[3]}"
                                @click="saveRow(rowIndex)"
                            >
                                <span>Save</span>
                            </button>
                        </td>
                        <td class="btn-delete">
                            <button @click="deleteRow(rowIndex)">
                                <span>Delete</span>
                            </button>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>

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

          <div class="page-text">Page: {{ this.sliderPage }} / {{ this.totalPage }}</div>
          <div class="part-text">{{ rangeText }}</div>
          <div class="total-text">Total Part Amount: {{ this.totalItems }}</div>
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
                'Previous Model No.',
                'New Model No.',
                'Pricelist Name',
                'Stock Reference (RPP)',
                'Cutting Assembly',
                'Detail',
                'Remark',
                'Save',
                'Delete',
            ],

            tableData: [],
            originalData: [],

            dropdownOptions: {
                4: ['--'],
                5: ['--', 'YES', 'TBD'],
                6: ['--', 'YES'],
            },

            rowChanged: [],

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

    mounted(){
        this.fetchPricelistOptions();

        this.fetchData();
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
        async fetchPricelistOptions() {
            try {
                const response = await axios.get(`${this.apiUrl}/master_data/get-pricelist-names`);
                if (response.data.status === "success") {
                    this.dropdownOptions[4] = response.data.data; // 将后端返回的数组直接赋值给下拉菜单

                } else {
                    alert(`⚠️ Failed to load pricelist names: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching pricelist names:", error);
                alert(`❌ Failed to load pricelist names: ${error.message}`);
            }
        },

        checkRowChanged(rowIndex) {
            const current = this.tableData[rowIndex];
            const original = this.originalData[rowIndex];

            const normalize = (v) => {
                if (v === null || v === undefined || v === '' || v === '--') return '';
                return String(v).trim();
            }

            const isChanged = current.length !== original.length || current.some((val, i) => normalize(val) !== normalize(original[i]));

            this.rowChanged[rowIndex] = isChanged;
        },

        handleInput(rowIndex, cellIndex, event) {
            let value = event.target.value
            
            // 第1列仅允许数字
            if (cellIndex === 1) {
                value = value.replace(/[^0-9]/g, '');
            }

            // 第0，2，3列强制大写
            if(cellIndex === 0 || cellIndex === 2 || cellIndex === 3) {
                value = value.toUpperCase()
            }

            // 更新数据
            this.tableData[rowIndex][cellIndex] = value;

            this.checkRowChanged(rowIndex);
        },

        markRowChanged(rowIndex) {
            this.checkRowChanged(rowIndex)
        },

        async saveRow(rowIndex) {
            if (!this.tableData[rowIndex][3]) return; // 第3列为空则无效

            this.rowChanged[rowIndex] = false;
            
            const rowData = this.tableData[rowIndex];

            try {
                const response = await axios.post(
                    `${this.apiUrl}/admin/updating-page-save-line`,
                    { row: rowData }
                );
                
                if (response.data.status === 'success') {
                    //保存成功-同步原始数据
                    this.originalData[rowIndex] = JSON.parse(JSON.stringify(rowData));
                    this.rowChanged[rowIndex] = false;
                } else {
                    alert('Save failed: ' + response.data.message);
                    this.rowChanged[rowIndex] = true;
                }

            } catch (error) {
                console.error('Save failed:', error);
                this.rowChanged[rowIndex] = true;
                alert('Save failed!');
            }
        },

        async deleteRow(rowIndex) {
            const rowData = this.tableData[rowIndex];
            const newModelNo = rowData[3];

            const confirmDelete = window.confirm(`Are you sure to delete "${newModelNo}"?`);
            if (!confirmDelete) return;

            try {
                const response = await axios.post(
                    `${this.apiUrl}/admin/updating-page-delete-line`,
                    { id: rowData[9] }
                );

                if (response.data.status === 'success') {
                    alert(`"${newModelNo}" deleted successfully!`);

                    this.tableData.splice(rowIndex, 1);
                    this.rowChanged.splice(rowIndex, 1);
                    this.originalData.splice(rowIndex, 1);
                } else {
                    alert(`Delete failed: ${response.data.message} || 'Unkown error'`);
                }
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Delete failed!');
            }
        },


        goBack() {
            this.$router.push(`/admin/price-list`);
        },
        searchPrice() {
            this.fetchData();
            this.sliderPage = 1;
        },

        goToPage(page) {
            const target = Math.min(this.totalPages, Math.max(1, page));
            this.sliderPage = target;
            this.onSliderChange();
        },

        async onSliderChange() {
            await this.fetchData(this.sliderPage);
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

        async fetchData(page) {
            this.prevCheckedId = null;
            try {
                const response = await axios.post(`${this.apiUrl}/admin/updating-page-show`, {
                    page: page,
                    pageSize: this.pageSize,
                    priceListNames: [],
                    keyword: this.searchText,
                });

                this.totalItems = response.data.total;
                this.totalPage = Math.ceil(this.totalItems / this.pageSize);
                const rawData = response.data.data;
                rawData.forEach(row => {
                    if (!row[5]) row[5] = '--';
                    if (!row[6]) row[6] = '--';
                });
                this.tableData = rawData;
                // 存一份原始副本（深拷贝）
                this.originalData = JSON.parse(JSON.stringify(rawData));

                this.rowChanged = this.tableData.map(() => false);

            } catch (error) {
                console.error("Error fetching master data:", error);
            }
        },
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
        input {
            width: 23vw;
            height: 30px;
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

        button {
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

    .table-container {
        margin-top: 20px;
        margin-left: 2%;
        margin-right: 2%;
        width: 96%;
        height: 75vh; /* 固定表格高度 */
        overflow-y: auto; /* 启用垂直滚动条 */
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
                            font-weight: normal;
                            padding: 0 10px;
                        }
                    }
                }

                tbody {
                    tr {
                        height: 35px;
                        border: 2px solid #F2F2F2 ;
                        
                        td{
                            // font-size: 15px;
                            // padding: 3px 10px;
                            input {
                                font-size: 12px;
                                width: 100%;
                                height: 35px;
                                box-sizing: border-box;
                                border: 1px solid #ccc;
                                border-radius: 2px;
                                padding: 0 10px;
                                color: #333;
                                transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                                &:hover {
                                    background-color: #f0f4f8; /* 鼠标悬停时改变背景色 */
                                }

                                &:focus {
                                    outline: none; /* 去除默认的聚焦边框 */
                                    box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.5); /* 聚焦时的轮廓阴影 */
                                }
                            }

                            .uppercase-input {
                                text-transform: uppercase;
                            }

                            .warning-bg {
                                background-color: #fff6a0;
                                outline: none; /* 去除默认的聚焦边框 */
                                box-shadow: 0px 0px 0px 3px red; /* 聚焦时的轮廓阴影 */
                            }

                            select {
                                width: 100%;
                                height: 35px;
                                font-size: 12px;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                box-sizing: border-box;
                                padding: 0 10px;
                                color: #333;
                                transition: all 0.2s ease;
                                //text-align: center;
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

                            .custom-select {
                                appearance: none;          // ✅ 去掉浏览器默认样式
                                background: white url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path fill='%23333' d='M1 1l5 5 5-5'/></svg>") no-repeat right 10px center;
                                background-size: 9px;
                                padding-right: 0px;       // 留出下拉箭头空间
                            }
                        }

                        .btn-save{
                            width: 90px;
                            padding-right: 15px;
                            button {
                                margin-left: 20px;
                                background-color:  #4472c4;
                                width: 100px;
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
                                    background-color: #284782;
                                    transform: translate(2px, 2px);
                                }

                                &:hover span {
                                    top: 2px; 
                                    left: 2px; 
                                }

                                &:disabled {
                                    background-color: #a0a0a0 !important;
                                    cursor: not-allowed;
                                    transform: none !important;
                                    box-shadow: none !important;

                                    span {
                                        color: #f8f8f8;
                                    }
                                }
                            }
                        }
                        .btn-delete{
                            width: 90px;
                            padding-right: 15px;
                            button {
                                margin-left: 20px;
                                background-color:  #FF0000;
                                width: 100px;
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
                                    background-color: #AC0000;
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

    .slider-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin: 10px 40px;

      .slider-btn {
        background-color: #4472c4;;
        border: none;
        border-radius: 6px;
        padding: 3px 15px;
        font-size: 15px;
        font-weight: bold;
        color: white;
        cursor: pointer;
        transition: transform 0.1s, background-color 0.3s;
        margin: 0 5px;

        i {
          font-size: 15px;
        }

        &:hover {
          background-color: #284782;
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
        background: linear-gradient(to right, #4472c4; #4472c4;);
        box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.35);
        outline: none;
        transition: background 0.3s;
        cursor: pointer;

        &:hover {
          background: linear-gradient(to right, #4472c4; #4472c4;);
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
        flex: 0.7;
        text-align: right;
        font-size: 15px;
        white-space: nowrap;
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

