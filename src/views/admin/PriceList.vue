<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Price List File Upload</h3>

        <div class="jpy-banner">JPY Cost</div>

        <div class="jpy-wrapper">
            <div class="label">Upload JPY Cost</div>
            <button @click="triggerFileInput(1)"><span>Select File</span></button>
            <input type="text" v-model="filePath1" readonly @click="triggerFileInput(1)">
            <button @click="handleUploadCost" :disabled="isUploading1"><span>{{ isUploading1 ? 'Uploading...' : 'Upload' }}</span></button>
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
            <button @click="downloadMasterFile(selectedOption)"><span>Download</span></button>
        </div>

        <div class="master-up-wrapper">
            <div class="label">Upload Excel File</div>
            <button @click="triggerFileInput(2)"><span>Select File</span></button>
            <input type="text" v-model="filePath2" readonly @click="triggerFileInput(2)">
            <button @click="handleUploadMaster" :disabled="isUploading2"><span>{{ isUploading2 ? 'Uploading...' : 'Upload' }}</span></button>
            <input type="file" ref="fileInput2" @change="handleFileChange(2)" style="display: none;" accept=".xlsx">
        </div>

        <div class="last-wrapper">
            <div class="left">
                <div class="label">Show Upload History</div>
                <button @click="toHistory"><span>History</span></button>
            </div>
            <div class="middle">
                <button @click="toDistributorProducts">Distributor - Products List</button>
            </div>
            <div class="right">
                <div class="label">Price List Code Updating</div>
                <button @click="toCodeUpdating"><span>Update/Delete</span></button>
                <button @click="toCodeAdding"><span>Add</span></button>
            </div>
        </div>

        <div class="filter-wrapper">
            <div class="label">Model No.</div>
            <input v-model="searchText" type="text" placeholder="Pevious/New Model No." @keyup.enter="searchPrice">
            <button @click="searchPrice"><span>Search</span></button>
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
            isOpen: false,
            selectedOption: '',

            options: [],

            rows: 8,
            columns: 4,
            apiUrl: config.apiUrl,
            user_list: [],
            // selectedMode: 'all',

            tableHeaders: [
                'Category',
                'Part No.',
                'Previous Model No.',
                'New Chain/Model No.',
                'Unit',
                'Manufacturer\'s Suggested Retail Price',
                "(New) Manufacturer'\s suggested retail price",
                '% dif for cost',
                'PO MUL',
                '(TTCL Internal Use) PO Price',
                '(TTCL Internal Use) THB Cost',
                '(TTCL Internal Use) GP',
                'Unit Price (THB)',
                '(NEW) Unit Price (THB)',
                '% dif for Unit price (SP)',
                'Pricelist Name',
            ],

            tableData: [],
            
            filePath1: '',
            filePath2: '',
            file1: null,
            file2: null,

            isUploading1: false,
            isUploading2: false,

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
        this.getOptions();

        document.addEventListener('click', this.handleClickOutside);

        //this.selectedOption = this.options && this.options[0] ? this.options[0] : '';

        //this.fetchPricelistOptions();

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

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },

    methods: {
        formatNumberWithCommas(value, i) {
            const num = Number(value);
            if (isNaN(num)) return value;
            return num.toLocaleString(undefined, {minimumFractionDigits: i, maximumFractionDigits: i});
        },

        async getOptions() {
            try {
                const response = await axios.get(`${this.apiUrl}/master_update/fetch-options`);
                const data = response.data;

                if (data.status) {
                    this.options = data.options;
                    
                    if (this.options.length > 0) {
                        this.selectedOption = this.options[0];
                    }

                } else {
                    alert(`❌ Failed to load options: ${data.message || 'Unknown error'}`);
                }

            } catch (error) {
                console.error(error);
                alert('❌ Failed to load options from backend');
            }
        },

        async downloadMasterFile(pl_name) {
            try {
                const response = await axios.post(
                    `${this.apiUrl}/master_update/download`,
                    new URLSearchParams({ pl_name }),
                    { responseType: 'blob', validateStatus: () => true } // ✅ 允许捕获非200状态码
                );

                // 检查返回状态码是否是200
                if (response.status !== 200) {
                // 尝试解析错误消息（后端可能返回JSON）
                    try {
                        const reader = new FileReader();
                        reader.onload = () => {
                        try {
                            const json = JSON.parse(reader.result);
                            alert(`❌ Download failed:\n${json.message || 'Unknown error'}`);
                        } catch {
                            alert(`❌ Download failed with status ${response.status}`);
                        }
                        };
                        reader.readAsText(response.data);
                    } catch {
                        alert(`❌ Download failed with status ${response.status}`);
                    }
                    return;
                }

                // 如果成功（200），则生成文件下载
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `master_update_${pl_name}.xlsx`);
                document.body.appendChild(link);
                link.click();

                link.remove();
            } catch (error) {
                console.error(error);
                alert('❌ Download failed: ' + error.message);
            }
        },

        // async fetchPricelistOptions() {
        //     try {
        //         const response = await axios.get(`${this.apiUrl}/master_data/get-pricelist-names`);
        //         if (response.data.status === "success") {
        //             this.options = response.data.data; // 将后端返回的数组直接赋值给下拉菜单
        //             this.selectedOption = this.options.length > 0 ? this.options[0] : '';
        //         } else {
        //             alert(`⚠️ Failed to load pricelist names: ${response.data.message}`);
        //         }
        //     } catch (error) {
        //         console.error("Error fetching pricelist names:", error);
        //         alert(`❌ Failed to load pricelist names: ${error.message}`);
        //     }
        // },

        async fetchData(page) {
            this.prevCheckedId = null;
            try {
                const response = await axios.post(`${this.apiUrl}/admin/pricelist-page-show`, {
                    page: page,
                    pageSize: this.pageSize,
                    priceListNames: [],
                    keyword: this.searchText,
                });

                this.totalItems = response.data.total;
                this.totalPage = Math.ceil(this.totalItems / this.pageSize);
                const rawData = response.data.data;

                this.tableData = rawData.map(row => {
                    const currency = row[16] || '';
                    let poPriceRaw = row[9];
                    let poPriceFormatted;

                    const price = parseFloat(poPriceRaw);

                    if (!isNaN(price)) {
                        if (currency.toUpperCase().includes('EUR')) {
                            poPriceFormatted = `€ ${this.formatNumberWithCommas(price.toFixed(3), 3)}`;
                        } else if (currency.toUpperCase().includes('USD')) {
                            poPriceFormatted = `$ ${this.formatNumberWithCommas(price.toFixed(2), 2)}`;
                        } else if (currency.toUpperCase().includes('JPY')) {
                            poPriceFormatted = `¥ ${this.formatNumberWithCommas(Math.round(price), 0)}`;
                        } else {
                            poPriceFormatted = `${this.formatNumberWithCommas(price.toFixed(3), 3)}`;
                        }
                    } else {
                        poPriceFormatted = poPriceRaw;
                    }

                    let thbCostRaw = row[10];
                    let cost_thb = parseFloat(thbCostRaw);
                    let thbCostFormatted = !isNaN(cost_thb)
                      ? `฿ ${this.formatNumberWithCommas(Math.round(cost_thb), 0)}`
                      : thbCostRaw;
                    
                    let gpRaw = row[11];
                    let gpNumber = parseFloat(gpRaw);
                    let gpFormatted = !isNaN(gpNumber)
                      ? `${Math.round(gpNumber * 100)}%`
                      : gpRaw;
                    
                    row[9] = poPriceFormatted;
                    row[10] = thbCostFormatted;
                    row[11] = gpFormatted;

                    return [
                        row[0],
                        row[1],
                        row[2],
                        row[3],
                        row[4],
                        row[5],
                        row[6],
                        row[7],
                        row[8],
                        row[9],
                        row[10],
                        row[11],
                        row[12],
                        row[13],
                        row[14],
                        row[15],
                        row[16],
                    ];
                });

            } catch (error) {
                console.error("Error fetching master data:", error);
            }
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

        async handleUploadCost() {
            if (!this.file1) {
                alert('Please select the JPY cost Excel file first!');
                return;
            }

            // 获取文件名（不含扩展名）
            const fileName = this.file1.name;
            const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');

            try {
                // 先获取有效的文件名列表
                const validResponse = await axios.get(`${this.apiUrl}/cost/get-valid-filenames`);
                const validFilenames = validResponse.data.valid_filenames || [];

                // 检查文件名是否精确匹配
                if (!validFilenames.includes(fileNameWithoutExt)) {
                    alert(`Invalid JPY Cost filename!\n\nFilename must be one of:\n${validFilenames.join('\n')}`);
                    return;
                }
            } catch (error) {
                console.error('Failed to get valid filenames:', error);
                alert('Failed to validate filename. Please try again.');
                return;
            }

            const confirmUpload = confirm(`Upload cost file: ${this.file1.name}?`);
            if (!confirmUpload) return;

            this.isUploading1 = true;
            this.filePath1 = 'Uploading...';

            try {
                // 构建 FormData
                const formData = new FormData();
                formData.append('file', this.file1);

                // 4️⃣ 发请求到后端 /cost/upload
                const response = await axios.post(
                    `${this.apiUrl}/cost/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 600000 // 10分钟超时（防止Excel大文件）
                    }
                );

                // 5️⃣ 解析返回结果
                const data = response.data;

                if (data.status) {
                    // 使用返回的 pricelist_names 更新下拉菜单
                    this.options = data.pricelist_names || [];
                    this.selectedOption = this.options.length > 0 ? this.options[0] : '';
                    await this.fetchData();
                    alert(`✅ Cost upload success!\nSaved to: ${data.upload_excel["full uploaded file path"]}`);
                } else {
                    alert(`❌ Cost upload failed!\nError: ${data.upload_excel.error_message || 'Unknown error'}`);
                }

            } catch (error) {
                console.error('Upload failed:', error);
                alert(`❌ Upload failed!\n${error.message}`);
            } finally {
                this.filePath1 = this.file1 ? this.file1.name : '';
                this.isUploading1 = false;
            }
        },

        async handleUploadMaster() {
            if (!this.file2) {
                alert('Please select the Excel file first!');
                return;
            }

            this.isUploading2 = true;

            const formData = new FormData();
            formData.append('file', this.file2);

            try {
                // 上传状态提示
                const confirmUpload = confirm(`Upload file: ${this.file2.name}?`);
                if (!confirmUpload) return;

                // 显示加载状态
                this.filePath2 = 'Uploading...';

                const response = await axios.post(
                    `${this.apiUrl}/master_upload/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 300000 // 最多等5分钟，防止Excel太大
                    }
                );

                const data = response.data;
                console.log(data)
                if (data.status) {
                    alert(`✅ Upload success!\nSaved to: ${data.master_upload["full uploaded file path"]}`);
                } else {
                    const errorInfo = data.master_upload?.error || data.upload_master_upload?.error || 'Unknown error';
                    alert(`❌ Upload failed!\nError: ${errorInfo}`);
                }

            } catch (error) {
                console.error('Upload failed:', error);
                alert(`❌ Upload failed!\n${error.message}`);
            } finally {
                // 上传完成后恢复文件名
                this.filePath2 = this.file2 ? this.file2.name : '';
                this.isUploading2 = false;
            }
        },

        toCodeAdding() {
            this.$router.push('/admin/code-adding');
        },
        toCodeUpdating() {
            this.$router.push('/admin/code-updating');
        },

        toHistory() {
            this.$router.push('/admin/history');
        },

        toDistributorProducts() {
            this.$router.push('/admin/distributor-products');
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
        font-size: 17px;
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
                font-size: 13px;
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
                white-space: nowrap;
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
                    justify-content: flex-start;
                    text-align: left;
                    width: 100%;
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
        margin-right: 6%;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
            flex: 1;
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
        .middle {
            flex: 0.7;
            display: flex;
            align-items: center;
            button {
                //margin-left: 15vw;
                height: 24px;
                width: 350px;
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
            //margin-left: 10vw;
            flex: 1;
            display: flex;
            align-items: center;
            .label {
                font-size: 17px;
                text-align: left;
                width: 200px;
                white-space: nowrap;
                margin-left: 15px;
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

    .filter-wrapper {
        margin-left: 2%;
        margin-top: 15px;
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
            font-size: 15px;
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
              font-size: 15px;
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
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
        width: 96%;
        height: 44vh; /* 固定表格高度 */
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
                            font-size: 12px;
                            padding: 3px 5px;
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
        background-color: #4472c4;
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
        white-space: nowrap;
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

    @media (max-width: 768px) {
        h3 {
            font-size: 16px;
            text-align: center;
            margin-top: 60px;
        }

        .jpy-banner, .master-banner-wrapper .master-banner {
            width: 140px;
            font-size: 14px;
            padding: 5px 15px;
            box-sizing: border-box;
        }

        .jpy-banner {
            margin-left: 3%;
        }

        .jpy-wrapper, .master-dl-wrapper, .master-up-wrapper {
            flex-direction: column;
            align-items: center;
            margin-left: 3%;
            margin-right: 3%;
            gap: 8px;

            .label {
                width: auto;
                font-size: 14px;
                align-self: flex-start;
            }

            button {
                width: 70%;
                max-width: none;
                height: 32px;
                margin-left: 0;

                span {
                    font-size: 14px;
                }
            }

            input {
                width: 100%;
                max-width: none;
                height: 32px;
                margin-left: 0;
                font-size: 14px;
                box-sizing: border-box;
            }
        }

        .master-banner-wrapper {
            flex-direction: column;
            align-items: flex-start;
            margin-left: 3%;
            margin-right: 3%;
            gap: 10px;

            .master-banner {
                min-width: auto;
                width: 140px;
            }

            .custom-dropdown {
                width: 100%;
                max-width: none;
                margin-left: 0;

                .dropdown-selected {
                    width: 100%;
                    height: 32px;
                    box-sizing: border-box;
                }

                .dropdown-options {
                    width: 100%;
                    max-height: 250px;
                }
            }
        }

        .last-wrapper {
            flex-direction: column;
            margin: 15px 3%;
            gap: 15px;

            .left, .middle, .right {
                flex: none;
                width: 100%;
                flex-direction: column;
                align-items: center;
                gap: 8px;

                .label {
                    width: auto;
                    font-size: 14px;
                    align-self: flex-start;
                }

                button {
                    width: 70%;
                    max-width: none;
                    height: 32px;
                    margin-left: 0;
                }
            }
        }

        .filter-wrapper {
            flex-direction: column;
            align-items: center;
            margin: 15px 3%;
            gap: 8px;

            .label {
                width: auto;
                font-size: 14px;
                align-self: flex-start;
            }

            input {
                width: 100%;
                max-width: none;
                height: 32px;
                margin-left: 0;
                font-size: 14px;
                box-sizing: border-box;
            }

            button {
                width: 70%;
                max-width: none;
                height: 32px;
                margin-left: 0;
            }
        }

        .table-container {
            margin: 10px 3%;
            width: 94%;
            height: 50vh;
            overflow-x: auto;

            table {
                min-width: 1000px;

                thead tr th {
                    font-size: 11px;
                    padding: 0 5px;
                }

                tbody tr td {
                    font-size: 11px;
                    padding: 5px;
                }
            }
        }

        .slider-wrapper {
            flex-wrap: wrap;
            margin: 15px 3%;
            gap: 5px;

            &::before {
                content: '';
                order: 5;
                flex-basis: 100%;
                height: 0;
            }

            .slider-btn {
                padding: 3px 8px;
                font-size: 11px;
                flex-shrink: 0;
            }

            input[type="range"] {
                flex: 1;
                min-width: 60px;
            }

            .part-text {
                order: 6;
                font-size: 12px;
            }

            .page-text {
                order: 7;
                font-size: 12px;
            }

            .total-text {
                order: 8;
                font-size: 12px;
            }
        }

        .lower-btn {
            position: relative;
            bottom: auto;
            justify-content: center;
            padding: 15px 3%;

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
            font-size: 15px;
        }

        .jpy-banner, .master-banner-wrapper .master-banner {
            font-size: 13px;
        }

        .jpy-wrapper, .master-dl-wrapper, .master-up-wrapper {
            .label {
                font-size: 13px;
            }

            button {
                height: 30px;

                span {
                    font-size: 13px;
                }
            }

            input {
                height: 30px;
                font-size: 13px;
            }
        }

        .last-wrapper {
            .left, .middle, .right {
                .label {
                    font-size: 13px;
                }

                button {
                    height: 30px;
                }
            }
        }

        .filter-wrapper {
            .label {
                font-size: 13px;
            }

            input {
                height: 30px;
                font-size: 13px;
            }

            button {
                height: 30px;

                span {
                    font-size: 13px;
                }
            }
        }

        .table-container table {
            min-width: 1000px;

            thead tr th {
                font-size: 10px;
            }

            tbody tr td {
                font-size: 10px;
            }
        }

        .slider-wrapper {
            .slider-btn {
                padding: 2px 8px;
                font-size: 11px;
            }

            .page-text, .part-text, .total-text {
                font-size: 11px;
            }
        }

        .lower-btn button {
            height: 36px;
            font-size: 14px;
        }
    }

</style>

