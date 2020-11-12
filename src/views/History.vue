<template>
    <div class="history h-100 bg-gray">
        <TopNav tit="历史成绩" :back="true" />
        <div class="px-7">
            <div class="py-7">
                <div class="flex ali-cen">
                    <div class="flex-1 one-elli mr-2 fs-bold">
                        <!-- {{ examName }}（{{ curStudent.name }}） -->
                        {{ curStudent.name }}
                    </div>
                    <div class="pos-rel" style="width: 2.4rem">
                        <span
                            class="el-icon-s-grid txt-primary pos-abs menu-icon"
                            style="z-index: 1"
                        ></span>
                        <el-select v-model="type" @change="changeType">
                            <el-option
                                class="subject"
                                v-for="item in types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="bg-white bor-rad5 txt-cen pt-4" ref="content">
                <p class="fs-bold txt-tit">{{ subjectName }}历史趋势</p>
                <div class="chart-box" v-show="hasScore">
                    <div class="chart" id="history"></div>
                </div>
                <div class="py-8" v-show="!hasScore">
                    <img src="../assets/img/empty-bg.png" width="100%" />
                    <p class="txt-info txt-cen">空空如也，暂无历史成绩！</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var echarts = require('echarts'),
        historyChart = ''
    export default {
        name: 'Home',
        data: function () {
            return {
                type: '', // 选中科目的值
                types: [
                    // 科目列表
                    { label: '总分', value: 'total' },
                    { label: '语文', value: 'chinese' },
                    { label: '数学', value: 'mathematics' },
                    { label: '英语', value: 'english' },
                    { label: '物理', value: 'physics' },
                    { label: '生物', value: 'biology' },
                    { label: '化学', value: 'chemistry' },
                    { label: '政治', value: 'politics' },
                    { label: '历史', value: 'history' },
                    { label: '地理', value: 'geography' },
                ],
                clientW: 300,
                hasScore: true,
                examName: '',
                subject: '',
                subjectName: '',
                scoreList: [],
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
            }
        },
        methods: {
            getScore(data) {
                let option = this.setBar(data),
                    height = data.scores.length * 60
                historyChart.resize({ height, width: this.clientW })
                historyChart.clear()
                historyChart.setOption(option)
            },
            setBar(data) {
                let option = {
                    // tooltip: {
                    //     trigger: 'axis',
                    //     axisPointer: {
                    //         type: 'shadow',
                    //     },
                    // },
                    grid: {
                        top: '5%',
                        left: '3%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        show: false,
                        max: data.max,
                    },
                    yAxis: [
                        {
                            inverse: true,
                            type: 'category',
                            axisLine: { show: false },
                            axisTick: { show: false },
                            axisLabel: { show: false },
                            data: data.names,
                        },
                        {
                            inverse: true,
                            type: 'category',
                            axisLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false,
                            },
                            axisLabel: {
                                show: true,
                                inside: false,
                                align: 'right',
                                verticalAlign: 'bottom',
                                lineHeight: 28,
                                textStyle: {
                                    color: '#666666',
                                },
                            },
                            splitArea: {
                                show: false,
                            },
                            splitLine: {
                                show: false,
                            },
                            data: data.scores,
                        },
                    ],
                    series: [
                        {
                            type: 'bar',
                            data: data.scores,
                            itemStyle: {
                                color: '#389CF0',
                            },
                            barMaxWidth: 10,
                            barCategoryGap: 10,
                            showBackground: true,
                            backgroundStyle: {
                                barBorderRadius: 5,
                            },
                            itemStyle: {
                                barBorderRadius: 5,
                                color: '#379CF0',
                            },
                            label: {
                                show: true,
                                color: '#666666',
                                position: [0, '-15px'],
                                formatter: function (item) {
                                    return item.name
                                },
                            },
                        },
                    ],
                }
                return option
            },
            changeType() {
                this.subjectName = this.types.find(
                    (item) => item.value == this.type
                ).label

                let objName = this.type + 'Obj'
                if (!this[objName]) {
                    this[objName] = this.sortScore()
                }
                let scores = this[objName].scores,
                    flag = scores.every((item) => item == 0)

                if (flag) {
                    this.hasScore = false
                } else {
                    this.hasScore = true
                    this.getScore(this[objName])
                }
                flag ? '' : ''
            },

            sortScore() {
                let { scoreList, type } = this,
                    tempObj = {
                        names: [],
                        scores: [],
                        total:
                            scoreList[0][
                                type == 'total' ? 'totalScore' : type + 'TotalScore'
                            ],
                    }

                for (let item of scoreList) {
                    let score = item[type] ? item[type] : 0
                    tempObj.scores.push(score)
                    tempObj.names.push(item.name)
                }

                return tempObj
            },
            getScoreList() {
                let { id } = this.curStudent
                this.$api.queryScore(id).then((res) => {
                    this.scoreList = res
                    this.type = this.subject
                    this.changeType()
                })
            },
        },
        components: {},
        mounted() {
            this.$nextTick(() => {
                // 基于准备好的dom，初始化echarts实例
                this.clientW = this.$refs.content.offsetWidth
                historyChart = echarts.init(document.getElementById('history'))
                this.getScoreList()
            })
        },
        created() {
            let { name, subject } = this.$route.query
            this.examName = name
            this.subject = subject
            this.subjectName = this.types.find(
                (item) => item.value == subject
            ).label
        },
    }
</script>

<style lang="scss" >
    .history {
        .menu-icon {
            top: 12px;
            left: 16px;
            font-size: 30px;
        }
        .chart-box {
            min-height: 400px;
        }
        .chart {
            width: 100%;
            min-height: 400px;
        }
        .el-select {
            .el-input__inner {
                font-size: 12px; /* no */
                height: 50px;
                line-height: 50px;
                padding-left: 60px;
                padding-right: 30px;
                color: #343434;
            }
            .el-input__icon {
                width: 20px;
                line-height: 50px;
            }
        }
    }

    .el-scrollbar {
        .subject.el-select-dropdown__item {
            font-size: 12px; /* no */
            height: 60px;
            line-height: 60px;
            padding: 0;
            text-align: center;
            color: #343434;
            &.selected {
                background-color: #cfeaff;
                font-weight: normal;
            }
        }
    }
</style>

