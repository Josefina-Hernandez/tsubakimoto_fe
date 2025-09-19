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
            <div class="nav-middle">
                <label>
                    <input type="radio" value="product" v-model="selectedType" />
                    <div>Product view mode</div>
                </label>
                <label>
                    <input type="radio" value="quotation" v-model="selectedType" />
                    <div>Quotation view mode</div>
                </label>
            </div>
            <div class="nav-right">
                <div class="text-right">Previous/New<br>Model No.</div>
                <input type="text" id="cust-input" v-model="fuzzyModelNo">
                <div class="text-right">Cust. Ref.</div>
                <input type="text" id="cust-input" v-model="fuzzyCustRef">
                <div class="text-right">Quotation No.</div>
                <input type="text" id="number-input" v-model="fuzzyQuotNo">
                <button class="search" @click="fetchFuzzyRecord">
                    <span>Search</span>
                </button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <!-- <tr>
                        <th v-for="(header, index) in (selectedType === 'product' ? (loginMode !== 'Tsubakimoto' ? tableHeaders : tableHeaders.slice(0, -1)) : (loginMode !== 'Tsubakimoto' ? tableHeadersQuotMode : tableHeadersQuotMode.slice(0, -2)))" :key="index">
                            {{ header }}
                        </th>
                    </tr> -->
                    <tr>
                        <th
                            v-for="(header, index) in displayHeaders"
                            :key="index"
                            @click="onHeaderClick(header)"
                            :class="{
                                'sortable': isSortable(header),
                                'sorted-asc': sortHeader === header && sortOrder === 'asc',
                                'sorted-desc': sortHeader === header && sortOrder === 'desc',
                                'unsortable': !isSortable(header),
                            }"
                        >
                            <span>{{ header }}</span>
                            <span v-if="isSortable(header)" class="sort-indicator">
                                <template v-if="sortHeader === header && sortOrder === 'asc'">▲</template>
                                <template v-else-if="sortHeader === header && sortOrder === 'desc'">▼</template>
                                <template v-else>⇅</template>
                            </span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in (selectedType === 'product' ? sortedTableData : sortedTableDataQuot)" :key="rowIndex">
                        <!-- <td v-for="(cell, cellIndex) in row.slice(0, -1)" :key="cellIndex">
                            {{ formatDateTime(cell) }}
                        </td> -->
                        <td>{{ rowIndex + 1 }}</td>
                        <td v-if="loginMode === 'Tsubakimoto'">{{ row.distributor_name }}</td>
                        <td>{{ row.create_time }}</td>
                        <td>{{ row.quot_no }}</td>
                        <td>{{ row.attention }}</td>
                        <td>{{ row.customer_ref }}</td>
                        <td v-if="!ifQuotMode">{{ row.pre_model_no }}</td>
                        <td v-if="!ifQuotMode">{{ row.new_model_no }}</td>
                        <td v-if="!ifQuotMode" class="num">{{ this.formatNumberWithCommas(row.unit_price) }}</td>
                        <td v-if="!ifQuotMode">{{ this.formatNumberWithCommas(row.quantity, 0) }}</td>
                        <td v-if="!ifQuotMode">{{ row.uom }}</td>
                        <td v-if="!ifQuotMode" class="num">{{ this.formatNumberWithCommas(row.total) }}</td>
                        <td class="num">{{ this.formatNumberWithCommas(row.quotation_amout) }}</td>
                        <td
                        :style='{color: getColor(row.quot_stat), fontWeight: getFontweight(row.quot_stat)}'
                        >{{ row.quot_stat }}</td>
                        <td class="select-col" v-if="ifQuotMode">
                            <div class="custom-select">
                                <div class="selected" @click="row.quot_stat !== 'Revised' && toggleDropdown(rowIndex)" :class="{'is-disabled': row.quot_stat === 'Revised'}">{{ row.quot_stat }}</div>
                                <div class="dropdown-list" v-show="dropdownOpen[rowIndex]">
                                    <div class="dropdown-item" v-for="(rate, index) in rates" :key="index" @click="selectRate(rowIndex, rate)">
                                        {{ rate }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="btn-td">
                            <button @click="downloadPdfFile(row)">
                                <span>View/DL</span>
                            </button>
                        </td>
                        
                        <td class="revision-col" v-if="loginMode !== 'Tsubakimoto'">
                            <button @click="toEditQuotationPage(row)" :disabled="row.quot_stat === 'Revised' ? true : false">
                                <span>Edit</span>
                            </button>
                        </td>

                        <td class="delete-col" v-if="ifQuotMode && loginMode !== 'Tsubakimoto'">
                            <button @click="deleteQuotation(row)">
                                <span>Delete</span>
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

    import config from '@/config';
    import axios from 'axios';

    import * as XLSX from 'xlsx';
import DistributorsPageVue from './admin/DistributorsPage.vue';

    export default {
        name: 'QuotationResult',
        data() {
            return {
                fuzzyModelNo: '',
                fuzzyCustRef: '',
                fuzzyQuotNo: '',

                selectedType: 'product',

                apiUrl: config.apiUrl,

                ifQuotMode: false,

                title: 'Quotation Record',

                backUrl: '/index',

                dropdownOpen: [],
                rates: ['Quotation Stage', 'Order Received', 'Order Lost'],

                firstLabel: 'Information',
                selectedDate1: null,
                selectedDate2: null,

                tableHeadersQuotMode : ["Row", "Distributor", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Quotation Price", "Status", "Order Setting", "PDF View/DL", "Edit", "Delete"],

                tableHeaders: ["Row", "Distributor", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Previous Model No.", "New Model No.", "Price per Unit", "Quantity", "UOM","Total amount", "Quotation Price", "Status", "PDF View/DL", "Edit"],
                tableData: [],
                tableDataQuotMode: [],

                sortHeader: null,
                sortOrder: null,

                watchDtEnabled: true,
            };
        },

        components: {
            LogoBanner,
            ResultFooterBtn,
        },

        computed: {
            loginMode() {
                return this.$store.getters.getLoginMode;
            },

            //当前显示的表头，用于v-for渲染<th>
            displayHeaders() {
                if (this.selectedType === 'product') {
                    return this.loginMode !== 'Tsubakimoto'
                        ? this.tableHeaders
                        : this.tableHeaders.slice(0, -1);
                } else {
                    return this.loginMode !== 'Tsubakimoto'
                        ? this.tableHeadersQuotMode
                        : this.tableHeadersQuotMode.slice(0, -2);
                }
            },

            // 排序后的数据源（根据当前模式返回对应数组）
            sortedTableData() {
                // product 模式：tableData
                const rows = [...this.tableData];
                return this.applySort(rows, this.mapHeaderToFieldProduct);
            },

            sortedTableDataQuot() {
                // quotation 模式：tableDataQuotMode
                const rows = [...this.tableDataQuotMode];
                return this.applySort(rows, this.mapHeaderToFieldQuot);
            },

            // 表头 -> 字段 的映射（product视图）
            mapHeaderToFieldProduct() {
                return {
                   'Distributor': 'distributor_name',
                    'Created on': 'create_time',
                    'Quotation No.': 'quot_no',
                    'Attention': 'attention',
                    'Customer Ref.': 'customer_ref',
                    'Previous Model No.': 'pre_model_no',
                    'New Model No.': 'new_model_no',
                    'Price per Unit': 'unit_price',
                    'Quantity': 'quantity',
                    'UOM': 'uom',
                    'Total amount': 'total',              // 这里拼写按现有表头
                    'Quotation Price': 'quotation_amout',
                    'Status': 'quot_stat', 
                };
            },

            // 表头 -> 字段 的映射（quotation视图）
            mapHeaderToFieldQuot() {
                return {
                    'Distributor': 'distributor_name',
                    'Created on': 'create_time',
                    'Quotation No.': 'quot_no',
                    'Attention': 'attention',
                    'Customer Ref.': 'customer_ref',
                    'Quotation Price': 'quotation_amout',
                    'Status': 'quot_stat',
                };
            },
        },

        watch: {
            selectedType(newVal, oldVal) {
                if (newVal === 'product') {
                    this.ifQuotMode = false;
                } else {
                    this.ifQuotMode = true;
                }

                this.$store.commit('setSelectedViewType', newVal);
            },

            selectedDate1(newVal, oldVal) {
                if (this.watchDtEnabled) {
                    this.fetchFuzzyRecord();
                }
            },

            selectedDate2(newVal, oldVal) {
                if (this.watchDtEnabled) {
                    this.fetchFuzzyRecord();
                }            
            }
        },

        mounted () {
            if (this.loginMode === 'Tsubakimoto') {
                this.tableHeadersQuotMode = ["Row", "Distributor", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Quotation Price", "Status", "Order Setting", "PDF View/DL", "Edit", "Delete"];
                this.tableHeaders = ["Row", "Distributor", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Previous Model No.", "New Model No.", "Price per Unit", "Quantity", "UOM","Total amount", "Quotation Price", "Status", "PDF View/DL", "Edit"];
            } else {
                this.tableHeadersQuotMode = ["Row", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Quotation Price", "Status", "Order Setting", "PDF View/DL", "Edit", "Delete"];
                this.tableHeaders = ["Row", "Created on", "Quotation No.", "Attention", "Customer Ref.", "Previous Model No.", "New Model No.", "Price per Unit", "Quantity", "UOM","Total amount", "Quotation Price", "Status", "PDF View/DL", "Edit"];
            }

            this.watchDtEnabled = false;
            this.selectedType = this.$store.state.selectedViewType;
            document.addEventListener('click', this.handleClickOutside);

            const today = new Date();
            // 计算90天前的日期
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 30);

            this.selectedDate1 = flatpickr.formatDate(sevenDaysAgo, "d-m-Y");
            this.selectedDate2 = flatpickr.formatDate(today, "d-m-Y");

            flatpickr("#date-picker1", {
                dateFormat: "d-m-Y", // 日期格式
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
                dateFormat: "d-m-Y", // 日期格式
                defaultDate: today,
                minDate: sevenDaysAgo,
                locale: {
                    firstDayOfWeek: 1 // 一周的第一天，0 是周日，1 是周一
                },
                onChange: (selectedDates, dateStr) => {
                    this.selectedDate2 = dateStr;
                }
            });

            //this.fetchQuotationRecord(); 
            this.$nextTick(() => {
                this.watchDtEnabled = true;
                this.fetchFuzzyRecord();
            });        
        },

        beforeUnmount(){
            document.removeEventListener('click', this.handleClickOutside);
        },

        methods: {
            // 解析 "dd-mm-YYYY HH:mm[:ss]" 或 "dd-mm-YYYY" -> 毫秒时间戳
            parseDMY(str) {
                if (!str || typeof str !== 'string') return NaN;
                const m = str.match(/^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
                if (!m) return NaN;
                const [, dd, mm, yyyy, HH='00', MM='00', SS='00'] = m;
                // 用本地时区生成时间（避免 Date.parse 把 d-m-Y 识别失败）
                return new Date(
                    Number(yyyy),
                    Number(mm) - 1,
                    Number(dd),
                    Number(HH),
                    Number(MM),
                    Number(SS)
                ).getTime();
            },

            // 判断字段名是否是 d-m-Y 格式的日期字段（目前只处理 create_time）
            isDMYDateField(field) {
                return field === 'create_time';
            },

            //哪些表头不可排序
            isSortable(header) {
                const notSortable = new Set(['Row', 'PDF View/DL', 'Edit', 'Delete', 'Order Setting']);
                return !notSortable.has(header);
            },

            //点击表头：三态切换（asc->desc->null)
            onHeaderClick(header) {
                if (!this.isSortable(header)) return;

                if (this.sortHeader !== header) {
                    this.sortHeader = header;
                    this.sortOrder = 'asc';
                } else if (this.sortOrder === 'asc') {
                    this.sortOrder = 'desc';
                } else {
                    this.sortHeader = null;
                    this.sortOrder = null;
                }
            },

            //对rows应用排序（根据当前sortHeader/sortOrder）
            applySort(rows, headerMap) {
                if (!this.sortHeader || !this.sortOrder) return rows;

                const field = headerMap[this.sortHeader];
                if (!field) return rows;

                const order = this.sortOrder === 'asc' ? 1 : -1

                return rows.sort((a, b) => this.compare(a[field], b[field], field) * order);
            },

            //智能比较： 数字 > 日期 > 字符串
            compare(a, b, field) {
                // 统一空值，按空值排后原则
                const isEmpty = (v) => v === undefined || v === null || v === '';
                const va = isEmpty(a) ? null : a;
                const vb = isEmpty(b) ? null : b;
                if (va === null && vb === null) return 0;
                if (va === null) return 1;  //空值靠后
                if (vb === null) return -1;

                //d-m-Y 比较，专门用于create_time
                if (this.isDMYDateField(field)) {
                    const ta = this.parseDMY(String(va));
                    const tb = this.parseDMY(String(vb));
                    const aOK = !isNaN(ta), bOK = !isNaN(tb);
                    if (aOK && bOK) {
                        if (ta < tb) return -1;
                        if (ta > tb) return 1;
                        return 0;
                    }
                }

                //数字比较
                const na = Number(va), nb = Number(vb);
                const isNumA = !isNaN(na), isNumB = !isNaN(nb);
                if (isNumA && isNumB) {
                    if (na < nb) return -1;
                    if (na > nb) return 1;
                    return 0;
                }

                //日期比较，支持YYYY-MM-DD / YYYY-MM-DD HH:mm / d-m-Y 等
                const da = Date.parse(va), db = Date.parse(vb);
                if (!isNaN(da) && !isNaN(db)) {
                    if (da < db) return -1;
                    if (da > db) return 1;
                    return 0;
                }

                //字符串比较，忽略大小写
                const sa = String(va).toLowerCase();
                const sb = String(vb).toLowerCase();
                if (sa < sb) return -1;
                if (sa > sb) return 1;
                return 0;
            },

            formatNumberWithCommas(value, i=2) {
                const num = Number(value);
                if (isNaN(num)) return value;
                return num.toLocaleString(undefined, { minimumFractionDigits: i, maximumFractionDigits: i });
            },
            createTableDataQuotMode() {
                const seen = new Set();
                this.tableDataQuotMode = this.tableData.filter(
                    item => {
                        if (seen.has(item.quot_no)) return false;
                        seen.add(item.quot_no);
                        return true;
                    }
                ).map(
                    ({
                        pre_model_no,
                        new_model_no,
                        unit_price,
                        quantity,
                        uom,
                        total,
                        chain_formation,
                        ...rest
                    }) => rest
                );
                //console.log(this.tableDataQuotMode);
                this.dropdownOpen = Array(this.tableDataQuotMode.length).fill(false);
            },

            async fetchQuotationRecord() {
                try {
                    const response = await axios.post(`${this.apiUrl}/quotation_list/listall`, {
                        start_date: this.selectedDate1,
                        end_date: this.selectedDate2,
                    });
                    this.tableData = response.data;
                    console.log(this.tableData);
                    this.createTableDataQuotMode();

                } catch (error) {
                    console.error("Error fetching quotation record:", error);
                }
            },
            
            async fetchFuzzyRecord() {
                let distributor;
                if (this.loginMode === 'Tsubakimoto') {
                    distributor = null;
                } else {
                    distributor = this.$store.state.companyName;
                }

                try {
                    const response = await axios.post(`${this.apiUrl}/quotation_list/fuzzy-search`, {
                        start_date: this.selectedDate1,
                        end_date: this.selectedDate2,
                        model_no: this.fuzzyModelNo,
                        cust_ref: this.fuzzyCustRef,
                        quot_no: this.fuzzyQuotNo,
                        distributor: distributor,
                    });
                    this.tableData = response.data;
                    console.log(this.tableData);
                    this.createTableDataQuotMode();

                } catch (error) {
                    console.error("Error fetching quotation record:", error);
                }
            },

            async deleteQuotation(row) {
                const targetQuotNo = row.quot_no;
                // 弹出确认框
                const isConfirmed = window.confirm(`Are you sure to delete the quotation of ${targetQuotNo}?`);

                if (!isConfirmed) {
                    return;
                }

                try {
                    const response = await axios.post(`${this.apiUrl}/quotation_list/delete`, {
                        quot_no: targetQuotNo,
                    });

                    this.fetchQuotationRecord();
                } catch (error) {
                    console.error("Error deleting quotation record:", error);
                }
            },

            toEditQuotationPage(row) {
                this.$store.commit('setBottomEditBtnText', 'Edit');
                const targetQuotNo = row.quot_no;
                const itemsTargetQuotNo = this.tableData.filter(
                    item => item.quot_no === targetQuotNo
                );
                console.log(itemsTargetQuotNo);
                this.$store.commit('setItemsTargetQuotNo', itemsTargetQuotNo);
                this.$router.push({ path: '/editquotationpage' });
            },

            getFontweight(value) {
                if (value === "Order Received" || value === "Order Lost") {
                    return "bold";
                } else {
                    return "normal";
                }
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
                this.tableDataQuotMode[rowIndex].quot_stat = rate;
                const targetQuotNo = this.tableDataQuotMode[rowIndex].quot_no;
                
                this.tableData.forEach(item => {
                    if (item.quot_no === targetQuotNo) {
                        item.quot_stat = rate;
                    }
                });

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

            async downloadPdfFile(row){
                const quotationNo = row.quot_no;
                try {
                    const response = await axios.post(`${this.apiUrl}/quotation/fetch-pdf`, {
                        quotationNo: quotationNo,  
                    }, {
                        responseType: 'blob'
                    });

                    const fileURL = window.URL.createObjectURL(
                        new Blob([response.data], {type: 'application/pdf'})
                    );

                    window.open(fileURL, '_blank');
                } catch (error) {
                    console.error("Error fetching PDF:", error);
                    if (error.response && error.response.status === 408) {
                        alert('PDF file not found on server...');
                    } else {
                        alert('An error occurred while fetching the PDF file.');
                    }
                }
            },

            downloadAll() {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
                const filename = `quotation_record_${timestamp}.xlsx`;

                console.log(this.tableData);
                
                const allheaders = [
                    'Row',
                    'Distributor',
                    'Created on',
                    'Quotation No.',
                    'Attention',
                    'Customer Ref.',
                    'Payment Terms',
                    'Remark',
                    'Previous Model No.',
                    'New Model No.',
                    'Chain Formation',
                    'Price per Unit',
                    'Quantity',
                    'UOM',
                    'Total Amount',
                    'Quotation Price',
                    'Status',
                    'User ID',
                ];

                const allWorkSheetData = [
                    allheaders,
                    ...this.sortedTableData.map((row, index) => [
                        index + 1,
                        row.distributor_name, 
                        row.create_time,
                        row.quot_no,
                        row.attention,
                        row.customer_ref,
                        row.payment_terms,
                        row.remark,
                        row.pre_model_no,
                        row.new_model_no,
                        row.chain_formation,
                        row.unit_price,
                        row.quantity,
                        row.uom,
                        row.total,
                        row.quotation_amout,
                        row.quot_stat,
                        row.user_id,
                    ])
                ];

                const worksheet = XLSX.utils.aoa_to_sheet(allWorkSheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');

                XLSX.writeFile(workbook, filename);
            },
        },

    }
</script>

<style lang="less">
    .flatpickr-calendar {
        background-color: white !important; /* 背景色 */
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
            margin-left: 3%;
            margin-right: 3%;

            .nav-left {
                flex: 0 0 auto;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .text-left {
                    font-size: 15px;
                    white-space: nowrap;
                }
                #date-picker1 {
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    font-size: 15px;
                    padding: 0 10px;
                    margin-left: 15px;
                    height: 40px;
                    width: 10vw;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover {
                        background-color: #e5f3f5;
                    }
                }
                .bar {
                    font-size: 20px;
                    margin-left: 5px;
                }
                #date-picker2 {
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    font-size: 15px;
                    padding: 0 10px;
                    margin-left: 5px;
                    height: 40px;
                    width: 10vw;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover {
                        background-color: #e5f3f5;
                    }
                }
                // .view-mode {
                //     margin-left: 20px;
                //     background-color:  #00AAEE;
                //     width: 130px;
                //     height: 35px;
                //     border: none;
                //     border-radius: 5px;
                //     color: white;
                //     font-size: 17px;
                //     cursor: pointer;

                //     span {
                //         position: relative; 
                //         top: 0;
                //         left: 0;
                //         transition: top 0.2s ease, left 0.2s ease;
                //     }

                //     &:hover{
                //         background-color: #0082B3;
                //     }

                //     &:hover span {
                //         top: 2px; 
                //         left: 2px; 
                //     }

                //     &:disabled{
                //         pointer-events: none;
                //         background-color: #BFBFBF;
                //         user-select: none;
                        
                //         &:hover{
                //             pointer-events: none;
                //             background-color: #BFBFBF;
                //             opacity: 0.5
                //         }
                //     }
                // }
            }

            .nav-middle {
                flex: 0 0 auto;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: space-between;
                margin-left: 20px;
                //margin-right: 30px;
                
                label {
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: text-shadow 0.2s; /* 添加 transform 过渡效果 */
                    user-select: none;

                    &:hover {
                        text-shadow: 0px 3px 2px #00acf0;  // 添加文字阴影
                    }
                    
                    input {
                        vertical-align: middle;
                        height: auto;
                        width: 20px;
                        margin: 0 10px;
                        cursor: pointer;
                    }
                    div {
                        vertical-align: middle;
                        white-space: nowrap;
                        height: auto;
                    }
                    &:last-child {
                        margin-top: 5px;
                    }
                }
            }

            .nav-right {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1 1 0;
                min-width: 0;
                margin-left: 1vw;
                gap: 12px;

                .text-right {
                    font-size: 15px;
                    margin-left: 0px;
                    flex: 0 0 auto;
                    //white-space: normal;
                }
                #cust-input, #number-input {
                    flex: 1 1 0;   /* 自动平分父容器的剩余空间 */
                    min-width: 0; /* 防止内容撑爆 */
                    font-size: 13px;
                    padding: 0 10px;
                    //margin-left: 15px;
                    height: 40px;
                    border: 1px solid #d2d1d1;
                    border-radius: 5px;
                    color: #615e5e;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影 */
                    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
                    &:hover{
                        cursor: pointer;
                        background-color: #e5f3f5;
                    }
                    &:focus {
                        outline: none; /* 去除默认的聚焦边框 */
                        box-shadow: 0px 0px 0px 3px rgba(66, 153, 225, 0.4); /* 聚焦时的轮廓阴影 */
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
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                    span {
                        position: relative; 
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease;
                    }

                    &:hover{
                        background-color: #0082B3;
                        transform: translate(3px, 3px);
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
            margin-left: 3%;
            margin-right: 3%;
            width: 94%;
            //height: 440px; /* 固定表格高度 */
            height: calc(68vh - 20px);
            overflow-y: auto; /* 启用垂直滚动条 */
            border: 1px solid #ddd;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

            table{
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;;

                thead {
                    height: 50px;
                    background-color: #F2F2F2;
                    //background-color: #03e995;
                    opacity: 1;
                    position: sticky;
                    top: 0;
                    z-index: 1; /* 使表头在滚动时保持在顶部 */

                    th {
                        white-space: normal;
                        word-wrap: break-word;
                        padding: 0 5px;

                        &.sortable {
                            cursor: pointer;
                        }
                        &.unsortable {
                            cursor: default;
                        }
                        .sort-indicator {
                            margin-left: 1px;
                            font-size: 15px;
                            opacity: 0.7;
                        }

                        &.sorted-asc {
                            color: #028802;
                        }
                        &.sorted-desc {
                            color: #920404
                        }
                    }
                }

                tbody {
                    tr {
                        height: 50px;
                        //border: 2px solid #F2F2F2 ;
                        
                        td {
                            border: 2px solid #F2F2F2;
                            padding: 0 5px;

                            &:nth-child(4) {
                                white-space: nowrap;
                            }
                        }

                        .num {
                            text-align: right;
                        }

                        .btn-td{
                            width: 100px;
                            padding: 0 15px;
                            button {
                                //margin-left: 20px;
                                background-color:  #00AAEE;
                                width: 100px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                span {
                                    position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:hover{
                                    background-color: #0082B3;
                                    transform: translate(3px, 3px);
                                }

                                &:hover span {
                                    top: 2px; 
                                    left: 2px; 
                                }
                            }
                        }
                            
                        .select-col{
                            width: 180px;
                            .custom-select {
                                position: relative;
                                display: inline-block;
                                width: 150px;
                                height: 30px;
                                border-radius: 3px;
                                background-color: #E7E6E6;
                                cursor: pointer;
                                margin-top: 1px;
                                border: none;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                white-space: nowrap;
                                .selected {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    height: 100%;
                                    padding: 0 15px 0 15px;
                                    font-size: 15px;
                                    color: white;
                                    background-color:#00AAEE;
                                    border-radius: 3px;
                                    user-select: none;
                                    &:hover{
                                        background-color: #0082B3;
                                    }
                                }

                                .is-disabled {
                                    background-color: #999;
                                    cursor: not-allowed;
                                    user-select: none;
                                    &:hover{
                                        background-color: #999;
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
                                    background-color: white;
                                    border-radius: 3px;
                                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                                    z-index: 9999;

                                    .dropdown-item {
                                        height: 35px;
                                        padding: 0 20px;
                                        display: flex;
                                        align-items: center;
                                        font-size: 15px;
                                        color: black;
                                        cursor: pointer;
                                        justify-content: center;
                                        border: none;
                                        user-select: none;
                                    }

                                    .dropdown-item:hover {
                                        background-color: #00AAEE;
                                        color: white;
                                        font-weight: bold;
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
                                background-color:  #02B302;
                                width: 70px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                span {
                                    position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:not(:disabled):hover{
                                    background-color: #028802;
                                    transform: translate(3px, 3px);
                                }

                                &:not(:disabled):hover span {
                                    top: 2px; 
                                    left: 2px; 
                                }

                                &:disabled {
                                    background-color: #999;
                                    cursor: not-allowed;
                                }
                            }
                        }

                        .delete-col{
                            width: 90px;
                            padding-right: 15px;
                            button {
                                margin-left: 10px;
                                margin-right: 5px;
                                background-color:  #BE0505;
                                width: 70px;
                                height: 30px;
                                border: none;
                                border-radius: 3px;
                                color: white;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */

                                span {
                                    position: relative;   //解决button在表头背景下显示问题
                                    top: 0;
                                    left: 0;
                                    transition: top 0.2s ease, left 0.2s ease;
                                }

                                &:hover{
                                    background-color: #920404;
                                    transform: translate(3px, 3px);
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