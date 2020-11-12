<template>
    <div class="top-nav bg-primary txt-cen pos-rel txt-white fs-14">
        <div
            v-if="back"
            class="back-icon flex ali-cen jus-cen"
            @click="backPage"
        >
            <div class="icon-back bg"></div>
        </div>
        <div>
            {{ tit }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Head',
        props: {
            tit: String,
            back: Boolean,
        },
        methods: {
            backPage() {
                this.$router.go(-1)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .icon-back {
        width: 18px;
        height: 30px;
        background-image: url('../assets/img/back.png');
    }
</style>


