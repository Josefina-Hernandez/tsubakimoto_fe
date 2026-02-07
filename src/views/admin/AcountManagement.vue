<template>
    <div class="user-container">
        <BannerAdmin />

        <h5>User Management</h5>

        <div class="user-table">
            <table>
                <thead>
                    <tr>
                        <th>Name Surname</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Access Type</th>
                        <th>User Type</th>
                        <th>Company Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user, index in user_list" :key="index">
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{maskPassword(user.password)}}</td>
                        <td>{{user.access_type}}</td>
                        <td>{{user.user_type}}</td>
                        <td class="btns">
                            <button class="edit" @click="editUser(user)">Edit</button>
                            <button class="delete" @click="deleteUser(user)">Delete</button>
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
import config from '@/config';
import BannerAdmin from '@/components/admin/BannerAdmin.vue';
import qs from 'qs';

export default {
    data(){
        return{
            rows: 8,
            columns: 4,
            apiUrl: config.apiUrl,
            user_list: []
        };
    },
    
    components: {
        BannerAdmin,
    },

    mounted(){
        this.fetchData();
    },

    methods: {
        maskPassword(password) {
            return '*'.repeat(password.length); // 将密码转换为相同长度的星号字符串
        },

        fetchData() {
            this.user_list = [];
            axios.post(`${this.apiUrl}/user/listall`)
            .then(response => {
                const res = response.data;
                for (const each of response.data) {
                    //console.log(each);
                    let accessType;
                    if (each[3]==='admin') {
                        accessType = 'Admin';
                    } else if (each[3]==='user') {
                        accessType = 'User';
                    } else {
                        accessType = each[3];
                    }

                    let userType;
                    if (each[4] === 'ttcl_admin') {
                        userType = 'TTCL (Admin)';
                    } else if (each[4] === 'ttcl_user') {
                        userType = 'TTCL (User)';
                    } else if (each[4] === 'nichiden') {
                        userType = 'NICHIDEN TRADING';
                    } else if (each[4] === 'kte_bkk') {
                        userType = 'TSUBACO KTE (BKK)';
                    } else if (each[4] === 'kte_sri') {
                        userType = 'TSUBACO KTE (SRIRACHA)';
                    } else if (each[4] === 'kte_corp') {
                        userType = 'KTE CORPORATION';
                    } else if (each[4] === 'hdr') {
                        userType = 'HDR';
                    } else if (each[4] === 'planet') {
                        userType = 'PLANET T AND S';
                    } else {
                        userType = each[4];
                    }
                    this.user_list.push({
                        'name': each[0],
                        'email': each[1],
                        'password': each[2],
                        'access_type': accessType,
                        'user_type': userType,
                        'access_type_org': each[3],
                        'user_type_org': each[4],
                        'user_id': each[5],
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
        },

        editUser(user){
            this.$router.push({
                name: 'edit-user',
                params: { userId: user.user_id },
                query: { ...user } // 将用户对象作为查询参数传递
            });
        },

        deleteUser(user){
            if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                return;
            }

            const userId = user.user_id;

            axios.post(`${this.apiUrl}/user/delete`,
                qs.stringify(
                    {
                        id: userId,
                    }
                ),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }             
            )
            .then(response => {
                console.log(response);
                this.fetchData();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
        },

        goToRegisterPage(){
            this.$router.push('/admin/register-user');
        },

        goBack(){
            this.$router.push('/admin/user');
        },
    }
};
</script>

<style scoped lang="less">
    h5 {
        display: none;
    }

    .user-table{
    display: flex;
    justify-content: center;
    margin-top: 50px;
    margin-left: 100px;
    margin-right: 100px;
    height: calc(70vh - 20px);
    overflow: hidden;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);

    table{
        position: relative;
        border-collapse: collapse;
        width: 100%;
        //height: 30px;
        background-color: white;  // 设置背景颜色
        //box-shadow: 0 1px 3px rgba(0,0,0,0.2);  // 添加阴影效果
        overflow: visible;

        thead{
           position: sticky;
           top: 0;
           z-index: 1; 
           //border-top: 2px solid #00AAEE; //固定顶部边框，并更改颜色
                
           th{
              background-color: #f2f2f2;
              //border: 2px solid #00AAEE;  // 更改边框颜色
              padding: 8px;
              text-align: center;
              line-height: 30px;
              font-family: Arial, sans-serif;  // 更改字体
           }
        }

        tbody{
            display: block;
            height: calc(70vh - 65px);
            overflow: auto;
            border-bottom: 10px solid transparent;

            td{
                border: 1px solid #f2f2f2;  // 更改边框颜色
                padding: 8px;
                text-align: center;
                line-height: 30px;
                font-family: Arial, sans-serif;  // 更改字体
            }

            .btns{
                
                .edit{
                    background-color: #4472C4;
                    color: white;
                    border: none;
                    height: 25px;
                    width: 100px;
                    cursor: pointer;
                    border-radius: 2px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                    transition: background-color 0.2s, transform 0.2s; /* 添加 transform 过渡效果 */

                    &:hover{
                        background-color: #284782;
                        transform: translate(3px, 3px);
                    }
                }
                .delete{
                    margin-left: 10px;
                    background-color: #BE0505;
                    color: white;
                    border: none;
                    height: 25px;
                    width: 100px;
                    cursor: pointer;
                    border-radius: 2px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                    transition: background-color 0.2s, transform 0.2s; /* 添加 transform 过渡效果 */

                    &:hover{
                        background-color: #970000;
                        transform: translate(3px, 3px);
                    }
                }
            }
        }

        thead, tbody tr {
            display: table; // 添加display: table;
            width: 100%;
            table-layout: fixed; // 添加table-layout: fixed;
            }
       
    }
    }

    .lower-btn{
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        bottom: 0px;

        button{
            margin-left: 100px;
            margin-bottom: 40px;
            width: 180px;
            height: 35px;
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
                transform: translate(3px, 3px);
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
        .user-container {
            padding-bottom: 80px;
            padding-top: 50px;

            :deep(.top) {
                margin-top: 0;

                .logo img {
                    display: none;
                }
            }
        }

        h5 {
            display: block;
            font-size: 20px;
            margin: 3px 0 7px 0;
        }

        .user-table {
            display: block;
            margin: 5px 10px;
            height: auto;
            max-height: calc(100vh - 4vh - 40px - 5px - 95px);
            overflow-x: auto;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;

            table {
                min-width: 700px;
                width: 100%;
                table-layout: auto;

                thead {
                    display: table;
                    width: 100%;
                    table-layout: fixed;
                    position: sticky;
                    top: 0;
                    z-index: 2;

                    th {
                        padding: 8px 10px;
                        font-size: 13px;
                        line-height: 24px;
                        text-align: center;
                        word-wrap: break-word;
                        white-space: normal;
                    }
                }

                tbody {
                    display: table;
                    width: 100%;
                    table-layout: fixed;
                    height: auto;

                    tr {
                        display: table-row;
                    }

                    td {
                        padding: 8px 10px;
                        font-size: 13px;
                        line-height: 1.4;
                        text-align: left;
                        vertical-align: middle;
                        white-space: normal;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .btns {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        justify-content: center;
                        gap: 0.5vh;
                        padding: 2px !important;

                        .edit, .delete {
                            width: 100% !important;
                            min-width: 60px;
                            height: 26px;
                            font-size: 12px;
                            margin: 0 !important;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }

        .lower-btn {
            position: fixed;
            bottom: 4vh;
            left: 0;
            right: 0;
            justify-content: center;
            padding: 0 15px;

            button {
                margin-left: 0;
                margin-bottom: 0;
                width: 100%;
                max-width: 400px;
                height: 40px;
                font-size: 16px;
                background-color: #BE0505;

                &:hover {
                    background-color: #970000;
                }
            }
        }
    }

    @media (max-width: 480px) {
        .user-table {
            table {
                min-width: 650px;

                thead th {
                    padding: 6px 8px;
                    font-size: 12px;
                }

                tbody {
                    td {
                        padding: 6px 8px;
                        font-size: 12px;
                    }

                    .btns {
                        .edit, .delete {
                            width: 50px;
                            height: 22px;
                            font-size: 11px;
                        }
                    }
                }
            }
        }

        .lower-btn {
            button {
                height: 38px;
                font-size: 15px;
            }
        }
    }

</style>

