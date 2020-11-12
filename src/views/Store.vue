<template>
    <div class="h-100 bg-gray px-7 over-scroll">
        <div class="my-4">
            <Person></Person>
        </div>

        <div :class="{ 'show-detail': showService }">
            <div
                @click="showService = !showService"
                class="flex jus-between ali-cen bg-primary txt-white p-4 tit-box"
            >
                <div class="flex ali-cen">
                    <span class="tit-icon bg one mr-3"></span>
                    <span>购买服务</span>
                </div>
                <span class="icon-arrow bg"></span>
            </div>
            <div class="buy">
                <div class="flex pt-4 jus-between">
                    <!-- active 是已经开通 -->
                    <div class="service-box" @click="goMeal">
                        <div class="tel bg flex jus-end ali-end pb-2 pr-3">
                            <span class="service-tit">亲情话机</span>
                        </div>
                        <div class="btn txt-cen txt-white py-2">立即购买</div>
                    </div>
                    <div
                        class="service-box"
                        :class="{ active: mesStatus }"
                        @click="mesStatus ? '' : goMeal()"
                    >
                        <div class="mes bg flex jus-end ali-end pb-2 pr-3">
                            <span class="service-tit">即时短信</span>
                        </div>
                        <div class="btn txt-cen txt-white bg-orange py-2">
                            {{ !mesStatus ? '立即购买' : '已经开通' }}
                        </div>
                    </div>
                    <div
                        class="service-box"
                        :class="{ active: scoreStatus }"
                        @click="scoreStatus ? '' : goMeal()"
                    >
                        <div class="query bg flex jus-end ali-end pb-2 pr-3">
                            <span class="service-tit">成绩查询</span>
                        </div>
                        <div class="btn txt-cen txt-white bg-orange py-2">
                            {{ !scoreStatus ? '立即购买' : '已经开通' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="my-4" :class="{ 'show-detail': showMeal }">
            <div
                @click="showMeal = !showMeal"
                class="flex jus-between ali-cen bg-primary txt-white p-4 tit-box"
            >
                <div class="flex ali-cen">
                    <span class="tit-icon bg two mr-3"></span>
                    <span>套餐用量</span>
                </div>
                <span class="icon-arrow bg"></span>
            </div>
            <div
                class="px-5 bg-white lh-1 meal"
                :style="{ height: showMeal ? mealH : 0 }"
            >
                <div ref="meal">
                    <div v-if="usedPlan.length > 0">
                        <div
                            v-for="(item, index) in usedPlan"
                            :key="'A' + item.id"
                            class="pt-6 pb-4"
                            :class="{
                                'bor-b': !(index == usedPlan.length - 1),
                            }"
                        >
                            <div class="txt-tit fs-bold txt-cen">
                                {{ item.moduleName }}
                            </div>
                            <div class="flex jus-between ali-cen my-4">
                                <div>
                                    本月余额:
                                    <span class="txt-orange">
                                        {{
                                            item.total +
                                            item.extraTotal -
                                            (item.totalUsed + item.extraUsed)
                                        }} </span
                                    >分钟
                                </div>

                                <div class="fs-10">
                                    （套餐：{{ Number(item.totalUsed) }}/{{
                                        item.total
                                    }}
                                    流量包：{{ item.extraUsed }}/{{
                                        item.extraTotal
                                    }}）
                                </div>
                            </div>
                            <div class="txt-r txt-info" style="font-size: 10px">
                                <div
                                    class="my-2 fs-10"
                                    v-for="(plan, planIndex) in item.planList"
                                    :key="planIndex"
                                >
                                    {{ plan.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="txt-info p-4">暂无套餐消息~</div>
                </div>
            </div>
        </div>

        <div class="bor-rad5 mb-8" :class="{ 'show-detail': showRecord }">
            <div
                @click="showRecord = !showRecord"
                class="flex jus-between ali-cen bg-primary txt-white p-4 tit-box"
            >
                <div class="flex ali-cen">
                    <span class="tit-icon bg three mr-3"></span>
                    <span>付款记录</span>
                </div>
                <span class="icon-arrow bg"></span>
            </div>

            <div class="pay" :style="{ height: showRecord ? payH : 0 }">
                <div ref="pay">
                    <div v-if="!record.length" class="px-5">
                        <p class="txt-info p-4">暂无购买记录~</p>
                    </div>

                    <div v-else>
                        <div
                            class="px-3 bg-white"
                            v-for="(item, index) in record"
                            :key="'C' + index"
                        >
                            <div
                                class="lh-1 txt-info fs-12 py-7 flex ali-cen txt-cen record-box"
                                :class="{ 'bor-b': index < record.length - 1 }"
                            >
                                <div class="time fs-9">
                                    {{ item.createTime }}
                                </div>
                                <div class="money">
                                    <p
                                        v-for="(detail, detailI) in item.detail"
                                        :key="detailI"
                                    >
                                        {{ detail.price }}元
                                    </p>
                                </div>
                                <div class="serve flex-1 txt-r">
                                    <p
                                        v-for="(detail, detailI) in item.detail"
                                        :key="detailI"
                                    >
                                        {{ detail.name }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let timeId = null
    import { mapState, mapMutations } from 'vuex'
    export default {
        name: 'Home',
        data: function () {
            return {
                record: [],

                showService: false,
                showMeal: false,
                mealH: 0,
                payH: 0,
                showRecord: false,
                usedPlan: [],
                mesStatus: 0,
                scoreStatus: 0,
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
            }
        },
        methods: {
            goMeal() {
                this.$router.push('/setMeal')
            },
            extendDetail() {},
            queryPlanUsed() {
                let { id } = this.curStudent
                this.$api.planUsed(id).then((res) => {
                    this.usedPlan = res
                    if (res.length > 0) {
                        let mes = res.find((item) => item.moduleName == '即时短信'),
                            score = res.find(
                                (item) => item.moduleName == '成绩查询'
                            )
                        this.mesStatus = mes ? mes.status : 0
                        this.scoreStatus = score ? score.status : 0
                    }
                    timeId = setTimeout(() => {
                        this.mealH = this.$refs.meal.clientHeight + 'px'
                        timeId = null
                        clearTimeout(timeId)
                    })
                })
            },
            payRecord() {
                let params = { payType: 'self', studentId: this.curStudent.id }
                this.$api.payRecords(params).then((res) => {
                    if (res.length > 0) {
                        res.forEach(
                            (item) => (item.detail = JSON.parse(item.detail))
                        )
                    }
                    this.record = res
                    timeId = setTimeout(() => {
                        this.payH = this.$refs.pay.clientHeight + 'px'
                        timeId = null
                        clearTimeout(timeId)
                    })
                })
            },
        },
        created() {
            this.queryPlanUsed()
            this.payRecord()
        },
    }
</script>

<style scoped lang="scss" >
    .record-box {
        .record-tit {
            border-radius: 5px 5px 0 0;
        }
        .time {
            width: 200px;
        }
        .money {
            width: 220px;
        }
    }
    .tit-box {
        border-radius: 8px 8px 0 0;
        .tit-icon {
            display: inline-block;
            width: 30px;
            height: 30px;
            &.one {
                background-image: url('../assets/img/tit-icon1.png');
            }
            &.two {
                background-image: url('../assets/img/tit-icon2.png');
            }
            &.three {
                background-image: url('../assets/img/tit-icon3.png');
            }
        }
    }
    .service-box {
        width: 210px;

        .tel {
            height: 100px;
            background-image: url('../assets/img/tel.png');
        }
        .mes {
            height: 100px;
            background-image: url('../assets/img/mes.png');
        }
        .query {
            height: 100px;
            background-image: url('../assets/img/query.png');
        }
        .btn {
            border-radius: 0 0 8px 8px;
            background-color: #ffae14;
        }
        .service-tit {
            color: #343434;
        }

        &.active {
            .tel {
                background-image: url('../assets/img/tel.png');
            }
            .mes {
                background-image: url('../assets/img/mes1.png');
            }
            .query {
                background-image: url('../assets/img/query1.png');
            }
            .btn {
                background-color: #389cf0;
            }
            .service-tit {
                color: #9a9a9a;
            }
        }
    }

    .buy,
    .meal,
    .pay {
        height: 0;
        overflow: hidden;
        transition: height 0.3s linear 0s;
    }
    .buy {
        transition: height 0.2s linear 0s;
    }

    .icon-arrow {
        display: inline-block;
        width: 24px;
        height: 14px;
        transition: height 0.2s linear 0s;
        background-image: url('../assets/img/icon-arrow.png');
    }
    .show-detail {
        .buy {
            height: 180px;
        }
        .pay {
            height: 400px;
        }
        .icon-arrow {
            transform: rotate(180deg);
        }
    }
</style>
