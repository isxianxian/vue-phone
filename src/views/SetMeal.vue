<template>
    <div class="h-100 bg-gray">
        <TopNav :back="true" :tit="navTit"></TopNav>
        <div class="px-7 pb-4" v-if="allPlan.length > 0">
            <div class="label">套餐购买</div>
            <div class="bg-white bor-rad5 px-4 py-5">
                <div v-for="plan in allPlan" :key="'m' + plan.moduleId">
                    <div class="fs-bold mt-4 mb-2">{{ plan.moduleName }}</div>
                    <div class="flex flex-wrap">
                        <div
                            class="meal-box bor-rad5 txt-cen bg-white flex flex-col jus-around mr-3 my-2 fs-10 pos-rel py-2"
                            :class="{
                                isPay: !item.canPay,
                                isSelect: item.isSelect,
                            }"
                            v-for="item in plan.planList"
                            :key="item.id"
                            @click="selectMeal(item)"
                        >
                            <div class="fs-bold txt-primary mb-2">
                                <span class="fs-15"> {{ item.price }}元</span>
                                <span class="fs-12">/</span>
                                <span>月</span>
                            </div>
                            <div class="fs-10 txt-info">{{ item.name }}</div>
                            <div class="select-icon bg"></div>
                        </div>
                    </div>
                </div>

                <div class="fs-bold mt-3" style="font-size: 18px">
                    合计：<span class="txt-red">{{ totalMoney }}</span
                    >元
                </div>
            </div>
            <div
                class="fs-14 txt-white bg-orange txt-cen bor-rad5 py-3 mt-4"
                @click="createSign"
            >
                立即支付
            </div>
        </div>
        <div v-else class="box-size" style="padding-top: 200px">
            <img src="../assets/img/empty-bg.png" width="100%" />
            <p class="txt-cen txt-info">空空如也，暂无套餐消息！</p>
        </div>
        <el-dialog
            title="订单提示"
            center
            :visible.sync="payVisible"
            :show-close="false"
            :close-on-click-modal="false"
            width="80%"
        >
            <div class="txt-cen">
                <p class="txt-tit fs-14">订单创建中，请稍等</p>
                <p class="txt-info">({{ countdown }}s过后会自动消失）</p>
            </div>
            <span slot="footer" class="dialog-footer"> </span>
        </el-dialog>
    </div>
</template>

<script>
    let timeId = null
    export default {
        name: 'setMeal',
        data() {
            return {
                navTit: '套餐购买',
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
                allPlan: [],
                totalMoney: 0,
                payType: 'other',
                orderId: NaN,
                payVisible: false,
                countdown: 5,
            }
        },
        methods: {
            queryPlanUsed(id) {
                return this.$api.allPlan(id).then((res) => {
                    let allPlan = [
                        { moduleName: '亲情话机', moduleId: 1 },
                        { moduleName: '即时短信', moduleId: 2 },
                        { moduleName: '成绩查询', moduleId: 3 },
                    ]

                    for (let item of allPlan) {
                        let id = item.moduleId
                        let planList = res.filter((item) => item.moduleId == id)
                        for (let item of planList) {
                            item.isSelect = false
                        }
                        item.planList = planList
                    }

                    this.allPlan = allPlan

                    return 1
                })
            },
            selectMeal(item) {
                let { isSelect, canPay } = item
                if (!canPay) {
                    return
                }
                item.isSelect = !item.isSelect
                this.countTotal()
            },
            countTotal() {
                let { allPlan } = this,
                    selectPlan = [],
                    totalMoney = 0
                for (let plan of allPlan) {
                    selectPlan.push(
                        ...plan.planList.filter((item) => item.isSelect)
                    )
                }

                for (let item of selectPlan) {
                    totalMoney += Number(item.price)
                }

                this.totalMoney = totalMoney
            },
            createSign() {
                let allPlans = [],
                    planIds = [],
                    payType = this.payType
                this.allPlan.forEach((item) => {
                    allPlans = [...allPlans, ...item.planList]
                })
                allPlans.forEach((item) => {
                    if (item.isSelect) {
                        planIds.push(item.id)
                    }
                })

                if (planIds.length <= 0) {
                    this.$message.error('请先选择套餐！')
                    return
                }
                planIds = planIds.join(',')

                let studentId = this.searchId,
                    params = { studentId, payType, planIds }
                this.$api.pay(params).then((res) => {
                    if (res) {
                        let wxpaydetail = JSON.parse(res.wxpayDetail)
                        this.orderId = res.id
                        this.jsSDK(wxpaydetail)
                    }
                })
            },
            judgeOrder(orderId) {
                this.$api.judgeOrder(orderId).then((res) => {
                    res.indexOf('成功') != -1
                        ? this.$message.success(res)
                        : this.$message.error(res)
                    let id = this.searchId
                    this.queryPlanUsed(id)
                })
            },

            jsSDK(params) {
                let _this = this
                if (typeof window.WeixinJSBridge === 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener(
                            'WeixinJSBridgeReady',
                            function () {
                                _this.onBridgeReady(params)
                            }
                        )
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', function () {
                            _this.onBridgeReady(params)
                        })
                        document.attachEvent('onWeixinJSBridgeReady', function () {
                            _this.onBridgeReady(params)
                        })
                    }
                } else {
                    _this.onBridgeReady(params)
                }
            },

            countdownEvent() {
                this.countdown = 5
                this.payVisible = true
                timeId = setInterval(() => {
                    this.countdown--
                    if (this.countdown <= 0) {
                        clearTimeout(timeId)
                        timeId = null
                        this.payVisible = false
                        this.judgeOrder(this.orderId)
                    }
                }, 1000)
            },

            onBridgeReady(data) {
                let _this = this
                window.WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',
                    data,
                    function (res) {
                        _this.countdownEvent()
                    }
                )
            },
        },
        created() {
            let id = this.$route.query.studentId
            id ? '' : ((id = this.curStudent.id), (this.payType = 'self'))
            this.searchId = id
            this.queryPlanUsed(id)
        },
    }
</script>

<style lang="scss" scoped>
    .meal-box {
        width: 198px;
        border: 1px solid #379cf0;
        &:nth-child(3n) {
            margin-right: 0;
        }
        .icon {
            display: none;
        }
        &.isSelect {
            background-color: #389cf0;
            div {
                color: #fff;
            }
            .icon {
                display: block;
                color: #389cf0;
            }
            .select-icon {
                display: block;
            }
        }
        &.isPay {
            background-color: #f8f8f8;
            border-color: #cccccc;
            div {
                color: #9a9a9a;
            }
        }
        .select-icon {
            display: none;
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            background-image: url('../assets/img/active.png');
        }
    }
</style>