<template>
    <div
        class="flex ali-cen jus-between bg-white p-7 pos-rel my-6 bor-rad5 student-box"
        :class="{ active: isActive }"
    >
        <div class="flex">
            <div class="flex flex-col jus-between txt-cen">
                <img
                    src="../assets/img/avator.png"
                    style="width: 1.35rem; height: 1.35rem"
                />
                <p class="fs-16 fs-bold txt-tit lh-1.5 mt-3">
                    {{ curStudent.name }}
                </p>
            </div>
            <div class="fs-10 txt-info pl-4">
                <p class="lh-2">班级：{{ curStudent.grade }}</p>
                <p class="lh-2">学校：{{ showSchool(curStudent.schoolId) }}</p>
                <p class="lh-2">学号：{{ curStudent.studentNumber }}</p>
                <p class="lh-2">一卡通号：{{ curStudent.cardId }}</p>
            </div>
        </div>
        <slot name="btn"></slot>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'

    export default {
        name: 'Person',
        props: {
            student: {
                type: Object,
                default: () => {
                    return {}
                },
            },
            isActive: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                curStudent: {},
            }
        },
        computed: {
            ...mapState(['schools', 'getSchool']),
        },
        methods: {
            ...mapMutations(['saveSchools']),
            getAllSchools() {
                this.$api.allSchool().then((res) => {
                    this.saveSchools(res)
                })
            },
            showSchool(schoolId) {
                let getSchool = this.getSchool
                if (!getSchool) {
                    this.getAllSchools()
                    return
                }

                let schools = this.schools,
                    school = schools.find((item) => item.id == schoolId),
                    schoolName = school ? school.name : ''
                return schoolName
            },
        },
        created() {
            this.curStudent = Object.keys(this.student).length
                ? this.student
                : JSON.parse(sessionStorage.getItem('curStudent'))
        },
    }
</script>


<style lang="scss" scoped>
    .student-box {
        &.active {
            background-color: #389cf0;
            & p {
                color: #fff !important;
            }
        }
    }
</style>
