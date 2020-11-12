<template>
    <div class="h-100 bg-gray px-7 over-scroll pos-rel">
        <div
            v-if="!scoreList.length"
            class="pos-abs w-100"
            style="left: 0; right: 0; bottom: 3rem"
        >
            <img src="../assets/img/empty-bg.png" width="100%" />
            <p class="fs-16 txt-info txt-cen mt-7">
                空空如也，您还没有任何记录
            </p>
        </div>
        <div v-else>
            <div class="label">
                <span>考试记录（{{ curStudent.name }}）</span>
            </div>
            <div class="bg-white record-box bor-rad5 mb-2">
                <div
                    class="bg-primary lh-1 txt-white fs-12 px-6 py-4 flex txt-l record-tit"
                >
                    <div class="time fs-9">考试时间</div>
                    <div class="serve flex-1">考试名称</div>
                </div>
                <div
                    class="px-6"
                    v-for="(item, index) in scoreList"
                    :key="index"
                    @click="goDetail(item)"
                >
                    <div
                        class="lh-1 txt-info fs-12 py-4 flex ali-cen"
                        :class="{ 'bor-b': index < scoreList.length - 1 }"
                    >
                        <div class="time fs-9">
                            {{
                                $common.formatTime(item.startTime, 'yyyy/MM/dd')
                            }}
                        </div>
                        <div class="serve flex-1 over-hide">
                            <div
                                class="one-elli"
                                style="
                                    display: inline-block;
                                    width: calc(100% - 20px);
                                "
                            >
                                {{ item.name }}
                            </div>
                            <div
                                class="txt-r"
                                style="display: inline-block; width: 20px"
                            >
                                <span class="icon el-icon-arrow-right"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    export default {
        name: 'Home',
        data: function () {
            return {
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
                record: [],
            }
        },
        computed: {
            ...mapState(['getScore', 'scoreList']),
        },
        methods: {
            ...mapMutations(['saveScore']),
            goDetail(item) {
                item = JSON.stringify(item)
                this.$router.push(`/detail?mes=${item}`)
            },
            getScoreList() {
                let { id } = this.curStudent
                this.$api.queryScore(id).then((res) => {
                    this.saveScore(res)
                })
            },
        },
        created() {
            if (!this.getScore) {
                this.getScoreList()
            }
        },
    }
</script>

<style scoped  lang="scss" >
    .record-box {
        .record-tit {
            border-radius: 5px 5px 0 0;
        }
        .time {
            min-width: 200px;
        }
    }
</style>
