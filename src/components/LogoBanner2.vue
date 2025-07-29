<template>
    <div class="logo-container">
        <a href="/#/index">
          <img alt="Company logo" src="../assets/logo.png" />
        </a> 
        <div class="welcome">{{welcomeText}}</div>
    </div>
    <div class="banner-container">
        <div class="text">{{title}}</div>
        <div class="sheet-icon" @click="handleClick">
            <img src="../assets/list_icon.png" alt="sheet icon" />
            <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
        </div>
    </div>
</template>


<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore();
        const loginMode = computed(() => store.getters.getLoginMode);

        const welcomeText = computed(() => 
            loginMode.value === 'Tsubakimoto' ? 'Welcome! TTCL' : `Welcome! ${loginMode.value}`);

        return {
            loginMode,
            welcomeText,
        }
    },
    name: 'LogoBanner2',
    props: {
        title: String,
        cartCount: Number,
        clickFunction: Function,
    },

    methods: {
        handleClick() {
            this.clickFunction();
        },
    },
}
</script>

<style scoped lang="less">

.logo-container {
    text-align: left;
    padding: 30px;
    img{
        width: 300px;
        height: 70px;
        margin-left: 50px;
    }
    .welcome {
    font-size: 28px;
    font-weight: bold;
    margin-right: 5vw;
    margin-left: auto;
    margin-top: 20px;
    float: right;
    color: #7C7C7C;
    }
}


.banner-container {
    margin-top: 5px;
    height: 70px;
    background-color: #53C5F4;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    .text{
        font-size: 23px;
        color: white;
    }

    .sheet-icon {
        position: absolute;
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;

        img {
            width: 55px;
        }

        .badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: red;
            color: white;
            font-size: 17px;
            font-weight: bold;
            border-radius: 50%;
            padding: 3px 7px;
            line-height: 1;
        }
    }
}

</style>
