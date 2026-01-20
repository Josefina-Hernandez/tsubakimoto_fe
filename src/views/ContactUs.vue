<template>
    <div class="index">
      
      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <div class="title">
            <h3>Contact Us</h3>
        </div>
        
        <div v-if="loginMode === 'Tsubakimoto'" class="contents">
            <div class="company-wrapper">
                <div class="company-name">TSUBAKIMOTO (THAILAND) CO., LTD.</div>
                <div class="content-wrapper">
                    <div class="label">Address:</div>
                    <div class="content-text">388 EXCHANGE TOWER, 19TH FLOOR UNIT 1902, SUKHUMVIT ROAD, KLONGTOEY, BANGKOK 10110 THAILAND</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Tel:</div>
                    <div class="content-text">02-262-0667-9</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Website:</div>
                    <div class="content-text"  style=""><a href="http://tsubaki.co.th" target="_blank">http://tsubaki.co.th</a></div>
                </div>
            </div>
            <div class="company-wrapper" v-for="(agent, index) in agentList" :key="index">
                <div class="company-name">{{ agent.companyName }}</div>
                <div class="content-wrapper">
                    <div class="label">Address:</div>
                    <div class="content-text">{{ agent.address }}</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Contact Person:</div>
                    <div class="content-text">{{ agent.contactPerson }}</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Email:</div>
                    <div class="content-text">
                        <a :href="`mailto:${agent.email}`">{{ agent.email }}</a>
                    </div>
                </div>
                <div v-if="agent.value === 'NICHIDEN'" class="content-wrapper">
                    <div class="label">Contact Person:</div>
                    <div class="content-text">{{ agent.contactPerson2 }}</div>
                </div>
                <div v-if="agent.value==='NICHIDEN'" class="content-wrapper">
                    <div class="label">Email:</div>
                    <div class="content-text">
                        <a :href="`mailto:${agent.email2}`">{{ agent.email2 }}</a>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="contents">
            <div class="company-wrapper">
                <div class="company-name">TSUBAKIMOTO (THAILAND) CO., LTD.</div>
                <div class="content-wrapper">
                    <div class="label">Address:</div>
                    <div class="content-text">388 EXCHANGE TOWER, 19TH FLOOR UNIT 1902, SUKHUMVIT ROAD, KLONGTOEY, BANGKOK 10110 THAILAND</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Tel:</div>
                    <div class="content-text">02-262-0667-9</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Website:</div>
                    <div class="content-text"  style=""><a href="http://tsubaki.co.th" target="_blank">http://tsubaki.co.th</a></div>
                </div>
            </div>
            <div class="company-wrapper" v-for="(agent, index) in matchedAgents" :key="index">
                <!-- <div class="company-name">{{ agent.companyName }}</div>
                <div class="content-wrapper">
                    <div class="label">Address:</div>
                    <div class="content-text">{{ agent.address }}</div>
                </div> -->
                <div class="content-wrapper">
                    <div class="label">Contact Person:</div>
                    <div class="content-text">{{ agent.contactPerson }}</div>
                </div>
                <div class="content-wrapper">
                    <div class="label">Email:</div>
                    <div class="content-text">
                        <a :href="`mailto:${agent.email}`">{{ agent.email }}</a>
                    </div>
                </div>
                <div v-if="agent.value === 'NICHIDEN'" class="content-wrapper">
                    <div class="label">Contact Person:</div>
                    <div class="content-text">{{ agent.contactPerson2 }}</div>
                </div>
                <div v-if="agent.value==='NICHIDEN'" class="content-wrapper">
                    <div class="label">Email:</div>
                    <div class="content-text">
                        <a :href="`mailto:${agent.email2}`">{{ agent.email2 }}</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </template>

<script>
    import { mapGetters } from 'vuex';
    import BannerContainer from '@/components/BannerContainer.vue';
    export default {
        name: 'ContactUS',
        data() {
            return {
                firstLabel: 'Information',
                loginMode: 'Tsubakimoto',
                agentList: [
                    {
                        value: 'KTE Corporation',
                        companyName: 'KTE CORPORATION CO., LTD.',
                        address: '37 SUKHAPIBAN 2 SOI 10, PRAWET, PRAWET, BANGKOK 10250, THAILAND',
                        contactPerson: 'Ms. Salilporn Mahattanawat (Pam), Sales Coordinator',
                        email: 'Salilporn@tsubakimoto.co.th',
                    },
                    {
                        value: 'KTE Bangkok',
                        companyName: 'TSUBACO KTE CO., LTD. (Bangkok)',
                        address: '952 RAMALAND BLDG., 17TH FLOOR, RAMA IV ROAD SURIYAWONG, BANGRAK BANGKOK 10500, THAILAND',
                        contactPerson: 'Ms. Chompunuch Chatbuaroy (Aum), Sales Coordinator',
                        email: 'Chompunuch@tsubakimoto.co.th',
                    },
                    {
                        value: 'KTE Pattaya',
                        companyName: 'TSUBACO KTE CO., LTD. (Pattaya)',
                        address: '4/222 HARBOR MALL OFFICE, ROOM 5B-01, MOO 10 SUKHUMVIT RD.TUNGSUKLA, SRIRACHA, CHONBURI 20230, THAILAND',
                        contactPerson: 'Ms. Sirikamon Chatjaroenpaisarn (Toey), Sales Coordinator',
                        email: 'Sirikamon@tsubakimoto.co.th',
                    },
                    {
                        value: 'PLANET',
                        companyName: 'PLANET T AND S CO., LTD.',
                        address: '28 KRUNGTHEP KRITHA 20 YAEK 3, THAPCHANG, SAPANSUNG, BANGKOK 10250, THAILAND',
                        contactPerson: 'Ms. Arparwan Sanantung (Aom), Senior Sales Coordinator',
                        email: 'arparwan@tsubakimoto.co.th',
                    },
                    {
                        value: 'HRD',
                        companyName: 'HRD (THAILAND) CO., LTD.',
                        address: 'BANGNA TOWERS-A, 2ND. FL., 2/3 MOO 14, BANGNA-TRAD RD., K.M.6.5, BANGKAEW, BANGPLEE SAMUTPRAKARN 10540, THAILAND',
                        contactPerson: 'Ms. Chompunuch Chatbuaroy (Aum), Sales Coordinator',
                        email: 'Chompunuch@tsubakimoto.co.th',
                    },
                    // {   value: 'NICHIDEN',
                    //     companyName: 'NICHIDEN TRADING BANGKOK (THAILAND) CO., LTD.',
                    //     address: '159/18 SERM-MIT TOWER, 11TH FL. UNIT 1103, SUKHUMVIT 21 (ASOKE) RD., KLONGTOEY NUA, WATTANA, BANGKOK 10110, THAILAND',
                    //     contactPerson: 'Ms. Chompunuch Chatbuaroy (Aum), Sales Coordinator',
                    //     email: 'Chompunuch@tsubakimoto.co.th',
                    // },
                    // {
                    //     value: 'NICHIDEN',
                    //     companyName: 'NICHIDEN TRADING SRIRACHA (THAILAND) CO., LTD.',
                    //     address: '222/6 ATARA MALL SRIRACHA 2nd FL, UNIT.206, SRIRACHA NAKHON 3 RD., SRIRACHA, CHONBURI 20110',
                    //     contactPerson: 'Ms. Sirikamon Chatjaroenpaisarn (Toey), Sales Coordinator',
                    //     email: 'Sirikamon@tsubakimoto.co.th',
                    // },
                    {
                        value: 'NICHIDEN',
                        companyName: 'NICHIDEN TRADING (THAILAND) CO., LTD.',
                        address: '2556, 66 TOWER, 7TH FLOOR, UNIT 704-705, SUKHUMVIT ROAD, BANG NA NUE, BANGNA, BANGKOK 10260 THAILAND',
                        contactPerson: 'BKK - Ms. Chompunuch Chatbuaroy (Aum), Sales Coordinator',
                        contactPerson2: 'SRIRACHA - Ms. Sirikamon Chatjaroenpaisarn (Toey), Sales Coordinator',
                        email: 'Chompunuch@tsubakimoto.co.th',
                        email2: 'Sirikamon@tsubakimoto.co.th',
                    },
                ],
            };
        },

        components: {
            BannerContainer,
        },

        computed: {
            ...mapGetters(['getLoginMode']),

            matchedAgents() {
                return this.agentList.filter(agent => agent.value === this.loginMode);
            },
        },

        mounted() {
            //console.log(this.getLoginMode);
            this.loginMode = this.getLoginMode;
        },

        methods: {

        },

    }
</script>

<style scoped lang="less">
    .index {
        //max-width: 100vw;
        margin: 0 auto;
        width: 100%;

        .main-contents{
            margin-left: 8%;
            margin-right: 8%;
            .title{
                margin-top: 20px;
                align-items: center;
                h3{     
                    text-align: center;
                    font-size: 22px;
                    font-weight: bold;
                }
            }

            .contents{
                margin-top: -40px;
                padding-left: 10%;
                padding-right: 10%;
                margin-bottom: 100px;

                .company-wrapper {
                    margin-top: 80px;
                    .company-name {
                        text-align: left;
                        color: #4975C5;
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 25px;
                    }
                    .content-wrapper {
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 10px;
                        font-size: 18px;
                        height: 30px;

                        .label {
                            flex: 1;
                            text-align: left;
                            color: #4975C5;
                            font-weight: bold;
                        }
                        .content-text {
                            flex: 6;
                            text-align: left;
                            white-space: pre-line;
                            a {
                                text-decoration: underline;
                                color: #4975C5;
                                transition: all 0.3s ease; // 添加平滑过渡动画
                                

                                &:hover {
                                    font-size: 21px;
                                    text-shadow: 1px 1px 2px #00acf0; // 添加文字阴影
                                }
                            }
                        }
                    }
                }   
            }
        }
    }
</style>