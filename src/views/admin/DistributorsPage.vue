<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Distributors</h3>

        <div class="regbtn-container">
            <button class="btn-reg" @click="registerDistributorFunction"><span>Register Distributor</span></button>
        </div>

        <div class="main-area">
            <div class="left-list">
                <ul>
                    <li v-for="(item, index) in leftListItems"
                        :key="index"
                        :class="{ 'selected': selectedItem === index }"
                        @click="selectItem(index)"
                    >
                        <span>{{ item }}</span>
                    </li>
                </ul>
            </div>
            <div class="right-area">
                <div class="checks-container">
                    <div class="check1">
                      <label>
                        <input
                            type="checkbox"
                            id="drive-chain"
                            v-model="chainTypes.driveChain"
                            @change="filterTableData"
                        />
                        <div>Drive Chain</div>
                      </label>
                    </div>
                    <div class="check2">
                      <label>
                        <input
                            type="checkbox"
                            id="small-chain"
                            v-model="chainTypes.smallChain"
                            @change="filterTableData"
                        />
                        <div>Small Size Convenyor Chain</div>
                      </label>
                    </div>
                    <div class="check3">
                      <label>
                        <input
                            type="checkbox"
                            id="large-chain"
                            v-model="chainTypes.largeChain"
                            @change="filterTableData"
                        />
                        <div>Large Size Convenyor Chain</div>
                      </label>
                    </div>
                </div>
                <!--<div class="search-container">
                    <button class="btn-search" @click="filterTableData"><span>Search</span></button>
                </div>-->
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, rowIndex) in filteredTableData" :key="rowIndex" :class="{'odd-row': rowIndex % 2 !== 0, 'even-row': rowIndex % 2 === 0}">
                                <td v-for="(col, colIndex) in item" :key="colIndex">{{ col }}</td>
                                <td>
                                    <div class="custom-select">
                                        <div class="selected" @click="toggleDropdown(rowIndex)">{{ item[3] }}</div>
                                        <div class="dropdown-list" v-show="dropdownOpen[rowIndex]">
                                            <div class="dropdown-item" v-for="(rate, index) in rates" :key="index" @click="selectRate(rowIndex, rate)">
                                                {{ rate }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>

        <div class="lower-btn">
            <button @click="goBack"><span>Back</span></button>
            <button @click="saveEdit"><span>Save</span></button>
        </div>
    </div>
</template>

<script>
import BannerAdmin from '@/components/admin/BannerAdmin.vue'
export default {
    data(){
        return{
            chainTypes: {
                driveChain: false,
                smallChain: false,
                largeChain: false,
            },
            filteredTableData: [],
            dropdownOpen: [],
            rates: ['A', 'B', 'C'],
            selectedItem: 0, // 当前选中的列表项索引
            leftListItems: ['KTE', 'TKT', 'HRD', 'PLANET', 'NICHIDEN'],
            tableHeaders: ['No.', 'Category Name', 'Model Name', 'Rate', 'ChangeRate'],
            tableData: [
                ['1', 'Drive Chain', 'RF2050R-5HB2', 'A'],
                ['2', 'Drive Chain', 'RF2050R-8YB5', 'A'],
                ['3', 'Drive Chain', 'RF2050R-5HB2', 'C'],
                ['4', 'Drive Chain', 'RF2050R-5HB2', 'C'],
                ['5', 'Drive Chain', 'RF2050R-5HB2', 'C'],
                ['6', 'Drive Chain', 'RF2050R-5HB2', 'C'],
                ['7', 'Small Size Conveyor Chain', 'RF2050R-5HB2', 'A'],
                ['8', 'Small Size Conveyor Chain', 'RF2050R-8YB5', 'A'],
                ['9', 'Small Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['10', 'Small Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['11', 'Small Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['12', 'Small Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['13', 'Large Size Conveyor Chain', 'RF2050R-5HB2', 'A'],
                ['14', 'Large Size Conveyor Chain', 'RF2050R-8YB5', 'A'],
                ['15', 'Large Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['16', 'Large Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['17', 'Large Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
                ['18', 'Large Size Conveyor Chain', 'RF2050R-5HB2', 'C'],
            ],
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted(){
        this.dropdownOpen = Array(this.tableData.length).fill(false);
        this.filteredTableData = this.tableData;
        document.addEventListener('click', this.handleClickOutside);
    },

    beforeUnmount(){
        document.removeEventListener('click', this.handleClickOutside);
    },

    methods: {
        handleClickOutside(event){
            const customSelects = document.querySelectorAll('.custom-select');
            customSelects.forEach((customSelect, index) => {
                // 如果点击的位置不在 customSelect 元素内，则关闭对应的下拉菜单
                if (!customSelect.contains(event.target)) {
                    this.dropdownOpen[index] = false;
                }
            });
        },

        filterTableData(){
            const {driveChain, smallChain, largeChain} = this.chainTypes;
            this.filteredTableData = this.tableData.filter(row => {
                if(driveChain && row[1] === "Drive Chain") return true;
                if(smallChain && row[1] === "Small Size Conveyor Chain") return true;
                if(largeChain && row[1] === "Large Size Conveyor Chain") return true;
                if(!driveChain && !smallChain && !largeChain) return true;
                return false;
            });
        },
        selectRate(rowIndex, rate) {
            this.tableData[rowIndex][3] = rate;       
            this.dropdownOpen[rowIndex] = false;
        },

        toggleDropdown(rowIndex) {
            this.dropdownOpen = this.dropdownOpen.map((open, index) => index === rowIndex ? !open : false);
        },

        selectItem(index) {
            this.selectedItem = index; // 设置选中项的索引
        },

        goBack(){
            this.$router.push('/admin/select')
        },

        registerDistributorFunction(){
            alert('Start register distributor operations...');
        },

        saveEdit(){
            alert('All changes has been save successfully!');
        },
    }
};
</script>

<style scoped lang="less">
    h3{
        margin-left: 6%;
        text-align: left;
        font-size: 25px;
        font-weight: bold;
        padding-left: 1%;
    }

    .regbtn-container{
        //border: 1px solid red;
        display: flex;
        justify-content: flex-end;
        margin-right: 6%;

        .btn-reg{
            background-color: #4472C4;
            color: white;
            font-size: 17px;
            padding: 10px 50px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover{
                background-color: #284782;
            }

            span {
                position: relative; /* 添加相对定位 */
                top: 0;
                left: 0;
                transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
            }

            &:hover span {
                    top: 2px;
                    left: 2px;
                }
        }
    }

    .main-area {
        display: flex;
        margin-left: 6%;
        margin-right: 6%;
        margin-top: 20px;
        .left-list{
            flex: 1;
            //border: 1px solid red;
            position: relative;
            ul{
                font-size: 25px;
                font-weight: bold;
                text-align: left;
                list-style-type: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                li{
                    position: relative;
                    cursor: pointer;
                    margin-bottom: 50px;
                    padding-bottom: 10px;
                    width: fit-content;

                    transition: background-color 0.3s;

                    &:hover{
                        color: #00B0F0;
                    }

                    span {
                        position: relative; /* 添加相对定位 */
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
                    }

                    &:hover span {
                            top: 2px;
                            left: 2px;
                        }
                }
                .selected::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 7px; /* Height of the blue line */
                    background-color: #00B0F0; /* Color of the blue line */
                }
            }
        }
        .right-area{
            flex: 6;
            //border: 1px solid red;

            .checks-container{
                display: flex;
                justify-content:space-between; /* 横向居中 */
                align-items: center;     /* 纵向居中 */
                width: 100%;
                .check1 {
                    display: flex;
                    align-items: center;
                    label{
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        #drive-chain {
                            width: 30px;
                            height: 30px;
                            margin-left: 30px;
                            margin-right: 10px;
                        }
                        div {
                            font-size: 20px;
                            font-weight: 550;
                        }
                    }

                }

                .check2{
                    display: flex;
                    align-items: center;
                    label{
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        #small-chain {
                            width: 30px;
                            height: 30px;
                            margin-left: 30px;
                            margin-right:10px;
                        }
                        div {
                            font-size: 20px;
                            font-weight: 550;
                        }
                    }

                }
                .check3{
                    display: flex;
                    align-items: center;
                    label{
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        #large-chain {
                            width: 30px;
                            height: 30px;
                            margin-left: 30px;
                            margin-right: 10px;
                        }
                        div {
                            font-size: 20px;
                            font-weight: 550;
                            margin-right: 230px;
                        }
                    }
                }

                .check1, .check2, .check3 {
                    input[type="checkbox"] {
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        width: 30px;
                        height: 30px;
                        background-color: #E8E8E8;
                        border: 2px solid #ccc;
                        border-radius: 3px;
                        cursor: pointer;
                    }

                    input[type="checkbox"]:checked {
                        background-color: #4472C4;
                        border-color: #4472C4;
                    }

                    input[type="checkbox"]:checked::after {
                        content: '';
                        position: relative;
                        display: block;
                        width: 10px;
                        height: 16px;
                        border: solid white;
                        border-width: 0 3px 3px 0;
                        transform: rotate(45deg);
                        margin-left: 8px;
                        margin-top: 4px;
                    }
                }
            }

            .search-container{
                display: flex;
                justify-content: flex-end;
                margin-top: 5px;
                .btn-search{
                    background-color: #4472C4;
                    color: white;
                    font-size: 17px;
                    padding: 10px 60px;
                    border-radius: 5px;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;

                    &:hover{
                        background-color: #284782;
                    }

                    span {
                        position: relative; /* 添加相对定位 */
                        top: 0;
                        left: 0;
                        transition: top 0.2s ease, left 0.2s ease; /* 添加过渡效果 */
                    }

                    &:hover span {
                            top: 2px;
                            left: 2px;
                        }
                }
            }

            .table-container{
                margin-top: 10px;
                height: 440px;
                overflow-y:scroll;
                border: 1px solid #ddd;
                .data-table{
                    width: 100%;
                    //border-collapse: collapse;
                    font-size: 20px;
                    thead {
                        height: 50px;
                        background-color: #156082;
                        opacity: 1;
                        position: sticky;
                        top: 0;
                        z-index: 1;
                        th {
                             /* 表头颜色 */
                            color: white;
                            text-align: center;
                        }
                    }
                    td {
                        padding: 10px;

                        .custom-select {
                            position: relative;
                            display: inline-block;
                            width: 220px;
                            height: 40px;
                            border-radius: 5px;
                            background-color: #E7E6E6;
                            cursor: pointer;
                            margin-top: 1px;
                            border: 1px solid #8f8d8d;
                            .selected {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                height: 100%;
                                padding: 0 20px 0 20px;
                                font-size: 20px;
                                color: #333;
                                
                            }

                            .selected::after {
                            content: '';
                                display: inline-block;
                                margin-top: 1px;
                                width: 0;
                                height: 0;
                                border-left: 10px solid transparent;
                                border-right: 10px solid transparent;
                                border-top: 10px solid #333;
                            }
                            .dropdown-list {
                                position: absolute;
                                top: 100%;
                                left: 0;
                                z-index: 1;
                                width: 100%;
                                max-height: 200px;
                                overflow-y: auto;
                                background-color: #E7E6E6;
                                border-radius: 5px;
                                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                                z-index: 9999;

                                .dropdown-item {
                                    height: 40px;
                                    padding: 0 20px;
                                    display: flex;
                                    align-items: center;
                                    font-size: 20px;
                                    color: #333;
                                    cursor: pointer;
                                    justify-content: center;
                                    border: 1px solid white;
                                }

                                .dropdown-item:hover {
                                    background-color: white;
                                }
                            }
                        }

                        .custom-select.show .dropdown-list {
                        display: block;
                        }
                    }

                    td:first-child{
                        width: 7%;
                    }
                    td:nth-child(2){
                        width: 30%;
                    }
                    td:nth-child(3){
                        width: 30%;
                    }
                    td:nth-child(4){
                        width: 10%;
                    }
                    td:nth-child(5){
                        width: 23%;
                    }

                    .odd-row {
                        background-color: #CCD2D8; /* 单行颜色 */
                    }

                    .even-row {
                        background-color: #E7EAED; /* 双行颜色 */
                    }
                }
            }
            
        }
    }

    .lower-btn{
            position: relative;
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            button{
                margin-left: 6%;
                margin-right: 6%;
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
            font-size: 20px;
            margin-top: 60px;
        }

        .regbtn-container {
            margin-right: 3%;
            margin-top: 10px;

            .btn-reg {
                font-size: 14px;
                padding: 8px 20px;
            }
        }

        .main-area {
            flex-direction: column;
            margin: 15px 3%;

            .left-list {
                ul {
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 10px;
                    font-size: 16px;

                    li {
                        margin-bottom: 10px;
                    }
                }
            }

            .right-area {
                margin-top: 15px;

                .checks-container {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;

                    .check1, .check2, .check3 {
                        label {
                            input[type="checkbox"] {
                                width: 24px;
                                height: 24px;
                                margin-left: 0;
                            }

                            div {
                                font-size: 14px;
                                margin-right: 0;
                            }
                        }

                        input[type="checkbox"] {
                            width: 24px;
                            height: 24px;
                        }

                        input[type="checkbox"]:checked::after {
                            width: 8px;
                            height: 12px;
                            margin-left: 6px;
                            margin-top: 3px;
                        }
                    }
                }

                .table-container {
                    height: 350px;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;

                    .data-table {
                        min-width: 600px;
                        font-size: 14px;

                        thead {
                            height: 40px;

                            th {
                                font-size: 12px;
                            }
                        }

                        td {
                            padding: 8px;
                            font-size: 13px;

                            .custom-select {
                                width: 120px;
                                height: 35px;

                                .selected {
                                    font-size: 14px;
                                    padding: 0 10px;
                                }

                                .selected::after {
                                    border-left-width: 6px;
                                    border-right-width: 6px;
                                    border-top-width: 6px;
                                }

                                .dropdown-list .dropdown-item {
                                    height: 35px;
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .lower-btn {
            flex-direction: column;
            gap: 10px;
            align-items: center;
            padding: 15px 3%;

            button {
                margin: 0;
                width: 100%;
                max-width: 300px;
                height: 40px;
                font-size: 15px;
            }
        }
    }

    @media (max-width: 480px) {
        h3 {
            font-size: 18px;
        }

        .regbtn-container .btn-reg {
            font-size: 13px;
            padding: 6px 15px;
        }

        .main-area {
            .left-list ul {
                font-size: 14px;
            }

            .right-area {
                .checks-container .check1, .checks-container .check2, .checks-container .check3 {
                    label {
                        input[type="checkbox"] {
                            width: 20px;
                            height: 20px;
                        }

                        div {
                            font-size: 13px;
                        }
                    }
                }

                .table-container {
                    height: 300px;

                    .data-table {
                        font-size: 12px;

                        td .custom-select {
                            width: 100px;
                            height: 30px;

                            .selected {
                                font-size: 12px;
                            }
                        }
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

