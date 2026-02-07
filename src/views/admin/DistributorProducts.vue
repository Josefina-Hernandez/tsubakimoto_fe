<template>
    <div class="user-container">
        <BannerAdmin />

        <h3>Distributor - Products List</h3>

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
                        <td v-for="([key, value]) in getVisibleEntries(row)" :key="key">
                            {{ value }}
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>

        <h3 class="label2">Distributor - Products List</h3>

        <div class="table-container2">
            <table>
                <thead>
                    <tr>
                        <th v-for="(header, index) in tableHeaders2" :key="index">
                            {{ header }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in tableData2" :key="rowIndex">
                        <td v-for="([key, value]) in getVisibleEntries(row)" :key="key">
                            {{ value }}
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
    name: 'distributor-products',
    data(){
        return{
            rows: 8,
            columns: 4,
            apiUrl: config.apiUrl,

            tableHeaders: [
                "Distributor/Pricelist Name",
                "Drive Chain",
                "Small Size Conveyor Chain",
                "Sprocket",
                "TTCL Warehouse",
                "Other Chain (TOP CH., LSCC, Cableveyor)",
                "PTUC Product (KTE)",
                "PTUC Product",
                "KTE Stock",
                "SCG Group (Chain)",
                "SCG Group (CAM Clutch)",
                "Sugar Stock",
                "Kabelschlepp",
                "Total",
            ],

            tableData: [
                ["KTE CORPORATION", "✔️", "✔️", "✔️", "✔️", "✔️", "✔️", "", "✔️", "✔️", "✔️", "✔️", "", "10"],
                ["TSUBACO KTE (Bangkok)", "✔️", "✔️", "✔️", "✔️", "✔️", "", "✔️", "", "", "", "", "", "6"],
                ["TSUBACO KTE (Pattaya)", "✔️", "✔️", "✔️", "✔️", "✔️", "", "✔️", "", "", "", "", "", "6"],
                ["PLANET T AND S", "✔️", "✔️", "✔️", "✔️", "✔️", "", "✔️", "", "", "", "", "✔️", "7"],
                ["HRD (THAILAND)", "✔️", "✔️", "✔️", "✔️", "✔️", "", "✔️", "", "", "", "", "", "6"],
                ["NICHIDEN TRADING (THAILAND)", "✔️", "✔️", "✔️", "✔️", "✔️", "", "✔️", "", "", "", "", "", "6"],
            ],

            tableHeaders2: [
                "No.",
                "JPY Cost File",
                "Price List",
            ],

            tableData2: [],
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

        async fetchData() {
            await axios.get(`${this.apiUrl}/admin/cost-matching`)
            .then(response => {
                //console.log(response.data);
                this.tableData2 = response.data.data;
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
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
        width: 96%;
        //height: 80vh; /* 固定表格高度 */
        overflow-y: auto; /* 启用垂直滚动条 */
        //border: 1px solid #ddd;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

        //will-change: scroll-position; /* 提示浏览器优化滚动性能 */
        //backface-visibility: hidden; /* 避免元素闪烁或位移 */

        table{
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;

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
                        font-size: 13px;
                        font-weight: bold;
                        padding: 2px 2px;
                        border: 1px solid #000;
                        width: 5%;
                    }
                }
            }

            tbody {
                tr {
                    height: 30px;
                    //border: 2px solid #F2F2F2 ;
                    border: 1px solid #000;

                    td{
                        font-size: 13px;
                        padding: 0 10px;
                        border: 1px solid #000;

                        &:nth-child(1) {
                            font-weight: bold;
                            white-space: nowrap;
                        }

                        &:last-child {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }

    .label2 {
        margin-left: 6%;
        text-align: left;
        font-size: 19px;
        margin-top: 20px;
    }

    .table-container2 {
        margin-top: 10px;
        margin-left: 2%;
        margin-right: 2%;
        width: 56%;
        height: 46vh; /* 固定表格高度 */
        overflow-y: auto; /* 启用垂直滚动条 */
        //border: 1px solid #ddd;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

        //will-change: scroll-position; /* 提示浏览器优化滚动性能 */
        //backface-visibility: hidden; /* 避免元素闪烁或位移 */

        table{
            width: 100%;
            border-collapse: collapse;
            //border: 2px solid #000;

            thead {
                background-color: #000;
                //background-color: #03e995;
                color: white;
                opacity: 1;
                position: sticky;
                top: 0px;
                z-index: 1; /* 使表头在滚动时保持在顶部 */
                height: 25px;

                tr {                        
                    th {
                        font-size: 14px;
                        //font-weight: bold;
                        padding: 2px 10px;
                        border: 1px solid #ccc;
                    }
                }
            }

            tbody {
                tr {
                    height: 22px;
                    //border: 2px solid #F2F2F2 ;
                    border: 1px solid #ccc;
                    td{
                        font-size: 13px;
                        padding: 0 10px;
                        border: 1px solid #ccc;
                    }
                }
            }
        }
    }
    .lower-btn{
            position: relative;
            margin-top: 20px;
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

        .label2 {
            margin-left: 3%;
            font-size: 17px;
        }

        .table-container {
            margin: 10px 2%;
            width: 96%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;

            table {
                min-width: 1000px;

                thead tr th {
                    font-size: 11px;
                    padding: 2px 3px;
                }

                tbody tr {
                    height: 28px;

                    td {
                        font-size: 11px;
                        padding: 0 5px;
                    }
                }
            }
        }

        .table-container2 {
            margin: 10px 2%;
            width: 96%;
            height: auto;
            max-height: 40vh;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;

            table {
                min-width: 400px;

                thead tr th {
                    font-size: 13px;
                }

                tbody tr {
                    td {
                        font-size: 12px;
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
        h3, .label2 {
            font-size: 15px;
        }

        .table-container {
            table {
                min-width: 800px;

                thead tr th {
                    font-size: 10px;
                }

                tbody tr td {
                    font-size: 10px;
                }
            }
        }

        .table-container2 table {
            min-width: 350px;

            thead tr th {
                font-size: 12px;
            }

            tbody tr td {
                font-size: 11px;
            }
        }

        .lower-btn button {
            height: 36px;
            font-size: 14px;
        }
    }

</style>

