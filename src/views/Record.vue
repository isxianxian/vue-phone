<template>
    <div class="h-100 bg-gray over-scroll">
        <TopNav tit="通话记录" :back="true" />
        <div class="px-7">
            <div class="label">
                <span>通话记录（{{ curStudent.name }}）</span>
            </div>
            <div v-if="record.length == 0" class="py-8">
                <img src="../assets/img/empty-bg.png" width="100%" />
                <p class="txt-info txt-cen">暂无通话记录~</p>
            </div>
            <div v-else class="bg-white record-box bor-rad5">
                <div
                    class="bg-primary lh-1 txt-white fs-12 px-6 py-4 flex txt-cen record-tit"
                >
                    <div class="time fs-9">开始时间</div>
                    <div class="duration">通话时长</div>
                    <div class="num flex-1">被叫号码</div>
                </div>
                <div class="px-6" v-for="(item, index) in record" :key="index">
                    <div
                        class="lh-1 txt-info fs-12 py-4 flex ali-cen txt-cen"
                        :class="{ 'bor-b': index < record.length - 1 }"
                    >
                        <div class="time fs-9">{{ item.startTime }}</div>
                        <div class="duration">
                            {{ item.calledDuration }}分钟
                        </div>
                        <div class="num flex-1">
                            {{ item.otherParty }}
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
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
                record: [],
            }
        },
        methods: {
            getTelRecord() {
                let id = this.curStudent.id
                this.$api.telRecords(id).then((res) => {
                    this.record = res
                })
            },
        },
        created() {
            this.getTelRecord()
        },
    }
</script>

<style scoped  lang="scss" >
    .record-box {
        .record-tit {
            border-radius: 5px 5px 0 0;
        }
        .time,
        .duration {
            width: 200px;
        }
    }
</style>