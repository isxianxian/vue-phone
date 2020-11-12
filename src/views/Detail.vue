<template>
    <div class="h-100 bg-gray">
        <TopNav tit="成绩详情" :back="true" />
        <div class="px-7">
            <div class="my-7 fs-bold">
                {{ mes.name }}（{{ curStudent.name }}）
            </div>
            <div class="bg-white record-box bor-rad5">
                <div
                    class="bg-primary lh-1 txt-white fs-12 px-7 py-5 flex txt-cen record-tit"
                >
                    <div class="name">总分</div>
                    <div class="score">
                        {{ totalScore.score }}/{{ totalScore.total }}
                    </div>
                    <div class="serve flex-1 txt-r">
                        <span
                            class="px-5 py-2 bg-white txt-tit bor-rad5"
                            @click="goHistory(totalScore)"
                            >历史趋势</span
                        >
                    </div>
                </div>
                <div
                    class="px-6"
                    v-for="(item, index) in scoreList"
                    :key="index"
                >
                    <div
                        class="lh-1 txt-info fs-12 py-7 flex ali-cen txt-cen"
                        :class="{ 'bor-b': index < scoreList.length - 1 }"
                    >
                        <div class="name fs-9">{{ item.name }}</div>
                        <div class="score" v-if="item.score == null">
                            暂无成绩
                        </div>
                        <div class="score" v-else>
                            {{ item.score }} / {{ item.total }}
                        </div>
                        <div class="serve flex-1 txt-r">
                            <span
                                class="px-5 py-2 bg-white txt-primary border bor-rad5"
                                style="border-color: #389cf0"
                                @click="goHistory(item)"
                                >历史趋势</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        data: function () {
            return {
                mes: {},
                totalScore: {},
                scoreList: [],
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
            }
        },
        methods: {
            goHistory(item) {
                console.log(item)
                let {
                        mes: { name },
                    } = this,
                    { sign: subject } = item
                this.$router.push({
                    path: '/history',
                    query: {
                        name,
                        subject,
                    },
                })
            },
            formatScore(mes) {
                let tempObj = {
                        chinese: {
                            name: '语文',
                        },
                        mathematics: {
                            name: '数学',
                        },
                        english: {
                            name: '英语',
                        },
                        geography: {
                            name: '地理',
                        },
                        history: {
                            name: '历史',
                        },
                        politics: {
                            name: '政治',
                        },
                        biology: {
                            name: '生物',
                        },
                        chemistry: {
                            name: '化学',
                        },
                        physics: {
                            name: '物理',
                        },
                        total: {
                            name: '总分',
                        },
                    },
                    tempArr = []

                for (let attr in mes) {
                    if (tempObj.hasOwnProperty(attr)) {
                        let totalName =
                            attr == 'total' ? 'totalScore' : attr + 'TotalScore'
                        tempObj[attr].score = mes[attr]
                        tempObj[attr].total = mes[totalName]
                        tempObj[attr].sign = attr
                        tempArr.push(tempObj[attr])
                    }
                }

                let totalIndex = tempArr.findIndex((item) => item.name == '总分'),
                    totalItem = tempArr.splice(totalIndex, 1)
                this.totalScore = totalItem[0]

                return tempArr
            },
        },
        created() {
            let mes = JSON.parse(this.$route.query.mes)
            this.scoreList = this.formatScore(mes)
            this.mes = mes
        },
    }
</script>

<style scoped  lang="scss" >
    .record-box {
        .name {
            min-width: 120px;
        }
        .score {
            min-width: 120px;
        }
    }
</style>
