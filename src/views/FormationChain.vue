<template>
    <div class="index">
      
      <BannerContainer :firstLabel="this.firstLabel" :ifShowBtn="true" />
      
      <div class="main-contents">
        <h3>Product Info</h3>
        <h4>Products</h4>
        <div class="list">
            <div class="item" v-for="item in this.items" :key="item.value">
                <div>
                    <div class="item-label" :data-selected="item.ifSelected" @click="toggleDetail(item)">{{ item.label }}</div>
                    
                    <Transition name="expand">
                        <div 
                            v-if="item.ifSelected"
                            class="item-detail"
                            :key="'detail-' + item.value"
                            >
                            <div class="detail-image">
                                <img :src="require(`@/assets/pics/${item.imageName}`)"  alt="Image for {{ item.label }}">
                            </div>                               
                            <div class="detail-text">
                                <h4>{{ item.label }}</h4>
                                <p v-if="item.linkname_en1!==''"><a :href='item.link_en1' target="_blank" rel="noopener noreferrer">Click to review the details of {{ item.linkname_en1 }} in EN</a></p>
                                <p v-if="item.linkname_jp1!==''"><a :href="item.link_jp1" target="_blank" rel="noopener noreferrer">Click to review the details of {{ item.linkname_jp1 }} in JP</a></p>
                                <p v-if="item.linkname_en2!==''"><a :href='item.link_en2' target="_blank" rel="noopener noreferrer">Click to review the details of {{ item.linkname_en2 }} in EN</a></p>
                                <p v-if="item.linkname_jp2!==''"><a :href="item.link_jp2" target="_blank" rel="noopener noreferrer">Click to review the details of {{ item.linkname_jp2 }} in JP</a></p>
                                <p v-if="item.linkname_en3!==''"><a :href='item.link_en3' target="_blank" rel="noopener noreferrer">Click to review the details of {{ item.linkname_en3 }} in EN</a></p>
                                <p v-if="item.linkname_jp3!==''"><a :href="item.link_jp3" target="_blank" rel="noopener noreferrer">Click to review the details of {{ item.linkname_jp3 }} in JP</a></p>
                            </div>
                        </div>
                    </Transition>
                </div>
                
            </div>
        </div>
      </div>

    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    export default {
        name: 'FormationChain',
        data() {
            return {
                firstLabel: 'Product Info',
                items: [
                    {
                        value: '1',
                        label: 'Drive Chains',
                        linkname_en1: 'TSUBAKI DRIVE CHAINS & SPROCKETS',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき ドライブチェーン&スプロケット',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'drive_chain.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CDC_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CDC/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '2',
                        label: 'Small Size Conveyor Chains',
                        linkname_en1: 'TSUBAKI SMALL SIZE CONVEYOR CHAINS & SPROCKETS',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: '小形コンベヤチェーン＆スプロケット',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'small_conveyor.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CSC_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CSC/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '3',
                        label: 'Large Size Conveyor Chains',
                        linkname_en1: 'TSUBAKI LARGE SIZE CONVEYOR CHAINS & SPROCKETS',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき 大形コンベヤチェーン&スプロケット',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'large_conveyor.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CLC_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CLC/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '4',
                        label: 'Top Chains',
                        linkname_en1: 'TSUBAKI TOP CHAIN & SPROCKET',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'プラスチックモジュラーチェーン＆トップチェーン＆プラブロックチェーン',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'top_chains.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CTC_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CTC/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '5',
                        label: 'Sprockets',
                        linkname_en1: 'TSUBAKI DRIVE CHAINS & SPROCKETS',
                        linkname_en2: 'TSUBAKI SMALL SIZE CONVEYOR CHAINS & SPROCKETS',
                        linkname_en3: 'TSUBAKI LARGE SIZE CONVEYOR CHAINS & SPROCKETS',
                        linkname_jp1: 'つばき ドライブチェーン&スプロケット',
                        linkname_jp2: '小形コンベヤチェーン&スプロケット',
                        linkname_jp3: 'つばき 大形コンベヤチェーン&スプロケット',
                        imageName: 'drive_chain.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CDC_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CDC/book/index.html#target/page_no=1',
                        link_en2: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CSC_EN/book/index.html#target/page_no=1',
                        link_jp2: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CSC/book/index.html#target/page_no=1',
                        link_en3: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CLC_EN/book/index.html#target/page_no=1',
                        link_jp3: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CLC/book/index.html#target/page_no=1',
                        ifSelected: false
                    },
                    {
                        value: '6',
                        label: 'Hose and Cable Carrier Systems',
                        linkname_en1: 'TSUBAKI CABLEVEYOR (Cable Carriers)',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき ケーブルベヤ',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'cable_carriers.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CCV_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CCV/book/index.html',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '7',
                        label: 'Reducers',
                        linkname_en1: 'TSUBAKI GEAR MOTOR (40W-5.5 kW)',
                        linkname_en2: 'TSUBAKI Troi Drive / Worm Power Drive',
                        linkname_en3: 'TSUBAKI MITER GEAR BOX / ARA GEAR BOX',
                        linkname_jp1: 'つばき 小形ギヤモータ（40W～5.5kW）',
                        linkname_jp2: 'つばき トロイドライブ ウォームパワードライブ',
                        linkname_jp3: 'つばき マイタギヤボックスARA / ギヤボックス',
                        imageName: 'reducers.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_GEN_GM_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_GEN_GM/book/index.html#target/page_no=1',
                        link_en2: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_GEN_EW_EN/book/index.html#target/page_no=1',
                        link_jp2: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_GEN_EW/book/index.html#target/page_no=1',
                        link_en3: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_GEN_ED_EN/book/index.html#target/page_no=1',
                        link_jp3: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_GEN_ED/book/index.html#target/page_no=1',
                        ifSelected: false
                    },
                    {
                        value: '8',
                        label: 'Locking Devices',
                        linkname_en1: 'TSUBAKI Power-Lock',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき パワーロック',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'locking_devices.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KPL_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KPL/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '9',
                        label: 'Shaft Couplings',
                        linkname_en1: 'TSUBAKI COUPLINGS',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき カップリング',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'shaft_couplings.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KCP_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KCP/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '10',
                        label: 'Clutches',
                        linkname_en1: 'TSUBAKI CAM CLUTCH',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき カムクラッチ',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'clutches.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CLU_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_CLU/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '11',
                        label: 'Electrical Controllers',
                        linkname_en1: 'TSUBAKI Electrical Control Devices',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: 'つばき 電気式制御機器',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'electrical_controllers.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KKF_CONTROL_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KKF_CONTROL/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '12',
                        label: 'Mechanical Controllers',
                        linkname_en1: 'Mechanical Protectors',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: '機械式過負荷保護機器',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'mechanical_controllers.jpg',
                        link_en1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KKF_SAFETY_EN/book/index.html#target/page_no=1',
                        link_jp1: 'https://tt-net.tsubakimoto.co.jp/lib/catalog/C_KKF_SAFETY/book/index.html#target/page_no=1',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    },
                    {
                        value: '13',
                        label: 'Others',
                        linkname_en1: 'Tsubaki: One-Touch Inspection Door',
                        linkname_en2: '',
                        linkname_en3: '',
                        linkname_jp1: '',
                        linkname_jp2: '',
                        linkname_jp3: '',
                        imageName: 'others.jpg',
                        link_en1: 'https://en.tsubaki.co.th/products/bulk-handling-systems/one-touch-inspection-door/',
                        link_jp1: '',
                        link_en2: '',
                        link_jp2: '',
                        link_en3: '',
                        link_jp3: '',
                        ifSelected: false
                    }
                ]
            };
        },
        components: {
            BannerContainer,
        },
        methods: {
            toggleDetail(item) {
                item.ifSelected = !item.ifSelected;
            }
        },
    }
</script>

<style scoped lang="less">
    .index {
        //max-width: 100vw;
        width: 100%;
        margin: 0 auto;

        .main-contents{
            h3{
                margin-top: 20px;
                font-size: 22px;
                font-weight: bold;
            }
            h4{
                text-align: left;
                margin-top: 20px;
                margin-left: 8%;
                font-size: 20px;
                font-weight: bold;
            }
            .list{
                margin-left: 8%;
                margin-right: 8%;
                margin-top: 20px;
                margin-bottom: 100px;
                display: flex;
                flex-direction: column;
                width: 84%;

                .item{
                    display: flex;
                    justify-content: space-between;
                    background-color: #D7F1FC;
                    width: 100%;
                    align-items: center;
                    margin-bottom: 10px;
                    //padding: 0 50px;
                    font-size: 19px;
                    font-weight: bold;
                    transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                    border-radius: 5px;

                    &:hover{
                        background-color: #53C5F4;
                        color: white;
                        transform: translate(-2px, -2px);
                    }

                    
                    div{
                        height: auto;
                        width: 100%;
                        //border-radius: 5px;
                        .item-label {
                            display: flex;
                            align-items: center;
                            position: relative;
                            height: 55px;
                            padding-left: 50px;

                            &:hover{
                                cursor: pointer;
                            }
                            
                            &::after{
                                margin-right: 60px;
                                content: '';
                                display: inline-block;
                                width: 0;
                                height: 0;
                                border-top: 10px solid #00ACF0;
                                border-right: 10px solid transparent;
                                border-bottom: 0 solid transparent;
                                border-left: 10px solid transparent;
                                position: absolute;
                                right: 0;
                                top: 50%;
                                transition: background-color 0.3s, transform 0.3s; /* 添加 transform 过渡效果 */
                            }

                            &[data-selected="true"]::after {
                                transform: translateY(-50%) rotate(-90deg); /* 旋转90度 */
                            }
                                
                        }

                        .item-detail {
                            //width: 100%;
                            display: flex;
                            background-color: white;
                            //padding: 30px 0;
                            //margin-top: 10px;
                            font-size: 18px;
                            color: #333;
                            justify-content: space-between;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

                            .detail-image {
                                //flex: 2;
                                margin-right: 70px;
                                margin-left: 0;
                                width: 350px;
                                img{
                                    width: 350px;
                                    height: auto;
                                    
                                }
                            }

                            .detail-text {
                                //flex: 3;
                                h4 {
                                    margin: 20px 0 10px 0;
                                    text-align: left;
                                }
                                p {
                                    margin: 20px 0 0 0;
                                    text-align: left;
                                    font-weight: lighter;
                                    color: #0297d7;
                                    a{
                                        text-decoration: underline;
                                        transition: all 0.3s ease; // 添加平滑过渡动画

                                        &:hover {
                                            font-size: 19px;
                                            text-shadow: 1px 1px 2px #00acf0; // 添加文字阴影
                                        }
                                    }

                                    
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .expand-enter-from,
    .expand-leave-to {
        max-height: 0px;
        opacity: 0;
        //padding: 0 0;
        overflow: hidden;
    }

    .expand-enter-active {
        transition: all 0.6s ease-in;
    }
    .expand-leave-active {
        transition: all 0.4s ease-out;
    }

    .expand-enter-to,
    .expand-leave-from {
        max-height: 1000px;
        opacity: 1;
        //padding: 30px 0;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .index .main-contents {
            h3 {
                margin-top: 15px;
                font-size: 18px;
            }

            h4 {
                margin-top: 15px;
                margin-left: 3%;
                font-size: 16px;
            }

            .list {
                margin-left: 3%;
                margin-right: 3%;
                width: 94%;
                margin-top: 15px;
                margin-bottom: 50px;

                .item {
                    font-size: 14px;

                    div {
                        .item-label {
                            height: 45px;
                            padding-left: 15px;

                            &::after {
                                margin-right: 15px;
                                border-top-width: 8px;
                                border-right-width: 8px;
                                border-left-width: 8px;
                            }
                        }

                        .item-detail {
                            flex-direction: column;
                            font-size: 14px;

                            .detail-image {
                                width: 100%;
                                margin-right: 0;

                                img {
                                    width: 100%;
                                    max-width: 300px;
                                }
                            }

                            .detail-text {
                                padding: 15px;

                                h4 {
                                    margin: 10px 0;
                                    font-size: 15px;
                                }

                                p {
                                    margin: 10px 0;
                                    font-size: 13px;

                                    a {
                                        font-size: 13px;

                                        &:hover {
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 480px) {
        .index .main-contents {
            h3 {
                font-size: 16px;
            }

            h4 {
                font-size: 14px;
            }

            .list .item {
                font-size: 13px;

                div {
                    .item-label {
                        height: 40px;
                        padding-left: 10px;

                        &::after {
                            margin-right: 10px;
                        }
                    }

                    .item-detail {
                        font-size: 13px;

                        .detail-text {
                            padding: 10px;

                            h4 {
                                font-size: 14px;
                            }

                            p {
                                font-size: 12px;

                                a {
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>