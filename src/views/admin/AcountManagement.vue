<template>
    <div class="user-container">
        <BannerAdmin />

        <div class="user-table">
            <table>
                <thead>
                    <tr>
                        <th>Name Surname</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Access Type</th>
                        <th>Settings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in user_list" :key="user.id">
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.password}}</td>
                        <td>{{user.access_type}}</td>
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
import config from '@/config'
import BannerAdmin from '@/components/admin/BannerAdmin.vue'
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
        fetchData() {
            axios.get(`${this.apiUrl}/users`)
            .then(response => {
                //console.log(response.data);
                this.user_list = response.data;
            })
            .catch(error => {
                console.log(error);
            })
        },

        editUser(user){
            this.$router.push({
                name: 'edit-user',
                params: { userId: user.id },
                query: { ...user } // 将用户对象作为查询参数传递
            });
        },

        deleteUser(user){
            const userId = user.id;

            axios.post(`${this.apiUrl}/deleteuser`,
                {
                    userId: userId,
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
    .user-table{
    display: flex;
    justify-content: center;
    margin-top: 50px;
    margin-left: 100px;
    margin-right: 100px;
    height: 350px;
    overflow: visible;

    table{
        position: relative;
        border-collapse: collapse;
        width: 100%;
        height: 30px;
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
            height: 250px;
            overflow: auto;

            td{
                border: 1px solid #f2f2f2;  // 更改边框颜色
                padding: 8px;
                text-align: center;
                line-height: 30px;
                font-family: Arial, sans-serif;  // 更改字体
            }

            .btns{
                
                .edit{
                    background-color: #00AAEE;
                    color: white;
                    border: none;
                    height: 25px;
                    cursor: pointer;
                    border-radius: 2px;

                    &:hover{
                        background-color: #284782;
                    }
                }
                .delete{
                    margin-left: 10px;
                    background-color:red;
                    color: white;
                    border: none;
                    height: 25px;
                    cursor: pointer;
                    border-radius: 2px;

                    &:hover{
                        background-color: #970000;
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
            margin-top: 30px;
                display: flex;
            button{
                margin-left: 100px;
                width: 150px;
                height: 40px;
                border-radius: 5px;
                background-color: #00AAEE;
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

</style>

