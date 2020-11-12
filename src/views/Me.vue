<template>
    <div class="h-100 bg-gray px-7 over-scroll">
        <div class="label">
            <span>付款记录（张一凡）</span>
        </div>
        <div class="bg-white record-box bor-rad5">
            <div
                class="bg-primary lh-1 txt-white fs-12 px-6 py-4 flex txt-cen record-tit"
            >
                <div class="time fs-9">付款时间</div>
                <div class="money">支付金额</div>
                <div class="serve flex-1 txt-r">购买服务</div>
            </div>
            <div class="px-6" v-for="(item, index) in record" :key="index">
                <div
                    class="lh-1 txt-info fs-12 py-4 flex ali-cen txt-cen"
                    :class="{ 'bor-b': index < record.length - 1 }"
                >
                    <div class="time fs-9">{{ item.time }}</div>
                    <div class="money">{{ item.money }}元</div>
                    <div class="serve flex-1 txt-r">
                        {{ item.serve }}
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
                record: [
                    { time: '2020-9-10 11:12:00', money: 120, serve: '亲情话机' },
                    { time: '2020-9-12 11:12:00', money: 120, serve: '亲情话机' },
                    { time: '2020-9-21 11:12:00', money: 120, serve: '亲情话机' },
                ],
            }
        },
        components: {},
    }
</script>

<style scoped  lang="scss" >
    .record-box {
        .record-tit {
            border-radius: 5px 5px 0 0;
        }
        .time,
        .money {
            width: 200px;
        }
    }
</style>
