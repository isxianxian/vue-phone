<template>
    <div class="home h-100">
        <div class="pos-rel">
            <div class="pos-abs home-bg">
                <img src="../assets/img/home-bg.png" width="100%" />
            </div>
            <div class="content px-7 pos-rel">
                <div
                    class="p-7 bor-shadow bor-rad5 bg-white txt-cen"
                    v-if="loginStatus == 0"
                >
                    <div>
                        <p class="txt-tit fs-bold lh-2" style="font-size: 16px">
                            登录
                        </p>
                        <p class="txt-info lh-2" style="font-size: 12px">
                            对不起，您还未登录
                        </p>
                    </div>
                </div>

                <div
                    class="p-7 bor-shadow bor-rad5 bg-white"
                    v-else-if="loginStatus == 1"
                >
                    <div class="flex ali-cen">
                        <div class="txt-cen">
                            <img
                                src="../assets/img/avator.png"
                                style="width: 1.35rem; height: 1.35rem"
                            />
                        </div>
                        <div class="fs-12 txt-info pl-7">
                            <p>对不起，您还未绑定学生卡！</p>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div
                        class="my-4"
                        v-for="(item, index) in allStudents"
                        :key="item.id"
                        @click="selectStudent(item, index)"
                    >
                        <Person
                            :student="item"
                            :isActive="activeIndex == index"
                        />
                    </div>
                </div>

                <div
                    class="txt-cen txt-info my-5 add bor-rad5"
                    @click="bindStudent"
                >
                    <span class="icon-add bg mr-3"></span>
                    <span> 绑定学生卡</span>
                </div>
            </div>
        </div>
        <div class="bill-box" @click="$router.push('/pay')">
            <img src="../assets/img/bill-bg.png" width="100%" />
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'

    export default {
        name: 'Home',
        data: function () {
            return {
                num: 2,
                activeIndex: NaN,
                curStudent: {},
                loginStatus: 2, // 登陆状态：0，未登录，1，登陆未绑定，2，已绑定
            }
        },
        methods: {
            ...mapMutations(['saveSchools', 'saveAllStudens', 'saveCurStudent']),
            selectStudent(student, index) {
                this.saveCurStudent(student)
                this.activeIndex = index
                this.$router.push('/tel')
                this.$emit('changeCur', true)
            },
            bindStudent() {
                this.$router.push('/bind')
            },

            getAllStudents() {
                this.$api.allStudents().then((res) => {
                    if (res && res.length > 0) {
                        this.loginStatus = 2
                        this.saveAllStudens(res)
                        if (this.curStudent) {
                            let { id: curId } = this.curStudent
                            this.activeIndex = this.allStudents.findIndex(
                                (item) => item.id == curId
                            )
                        }
                    } else {
                        this.loginStatus = 1
                    }
                })
            },
            getAllSchools() {
                this.$api.allSchool().then((res) => {
                    this.saveSchools(res)
                    this.getAllStudents()
                })
            },
            getSchoolName(id) {
                let school = this.schools.filter((item) => item.id == id)
                if (school.length > 0) {
                    return school[0].name
                } else {
                    return ''
                }
            },
        },
        computed: {
            ...mapState(['getSchool', 'schools', 'getStudent', 'allStudents']),
        },
        created() {
            this.curStudent = JSON.parse(sessionStorage.getItem('curStudent'))
            let token = sessionStorage.getItem('user-token')
            if (!token) {
                return
            }

            // this.getSchool ? '' : this.getAllSchools()
            this.getStudent ? '' : this.getAllStudents()

            if (this.curStudent) {
                let { id: curId } = this.curStudent
                this.activeIndex = this.allStudents.findIndex(
                    (item) => item.id == curId
                )
            }
        },
    }
</script>

<style scoped lang="scss" >
    .home {
        .home-bg {
            width: 100%;
            height: 150px;
        }
        .content {
            padding-top: 220px;
        }
        .add {
            height: 98px;
            line-height: 98px;
            border: 2px dotted #cccccc;
            .icon-add {
                display: inline-block;
                width: 22px;
                height: 20px;
                background-image: url('../assets/img/icon-add.png');
            }
        }
        .bill-box {
            width: 120px;
            height: 120px;
            position: fixed;
            z-index: 2;
            bottom: 140px;
            right: 60px;
        }
    }
</style>
