<template>
    <div class="h-100">
        <TopNav tit="绑定学生" :back="true" />
        <div class="bg-gray px-7">
            <div class="label">
                <span>学生查找</span>
            </div>
            <div class="student-box bg-white pt-4 pb-4 bor-rad5">
                <el-form ref="form" :model="searchForm" label-width="1.5rem">
                    <el-form-item label="学校">
                        <el-select
                            v-model="searchForm.schoolId"
                            placeholder="请选择学校"
                        >
                            <el-option
                                class="student"
                                v-for="item in schools"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input
                            v-model="searchForm.name"
                            placeholder="请输入姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span
                            class="py-4 bg-primary bor-rad5 txt-white"
                            style="padding-left: 0.7rem; padding-right: 0.7rem"
                            @click="searchStudent"
                            >搜索</span
                        >
                    </el-form-item>
                </el-form>
            </div>

            <div v-for="item in students" :key="item.id">
                <Person :student="item">
                    <template v-slot:btn>
                        <div>
                            <span
                                class="px-4 py-3 bg-primary bor-rad5 txt-white"
                                @click="bindStudent(item)"
                                >绑定学生</span
                            >
                        </div>
                    </template>
                </Person>
            </div>
        </div>

        <el-dialog
            class="student-mes"
            title="绑定学生"
            :visible.sync="bindVisible"
            width="80%"
            center
        >
            <div class="fs-12">
                <div class="flex ali-cen mb-6 txt-r">
                    <span class="mr-4">学号</span>
                    <el-input
                        class="flex-1"
                        v-model="studentForm.studentNumber"
                        autocomplete="off"
                    ></el-input>
                </div>
                <div class="flex ali-cen mb-6 txt-r">
                    <div
                        class="mr-4 flex ali-cen"
                        style="width: 2.5rem"
                        @click="mesVisible = true"
                    >
                        <div class="lh-1">电子学生证</div>
                        <div class="que-icon bg"></div>
                    </div>
                    <el-input
                        class="flex-1"
                        v-model="studentForm.cardId"
                        autocomplete="off"
                    ></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="bindVisible = false"
                    >取 消</el-button
                >
                <el-button size="small" type="primary" @click="sureBind"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <el-dialog title="信息" :visible.sync="mesVisible" width="80%" center>
            <div class="fs-12 txt-cen">电子学生证号如图所示</div>
            <div class="txt-cen">
                <img src="../assets/img/card.png" style="width: 50%" />
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button
                    size="small"
                    type="primary"
                    @click="mesVisible = false"
                    >关 闭</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        data: function () {
            return {
                loginStatus: 2, // 登陆状态：0，未登录，1，登陆未绑定，2，已绑定
                students: [],
                studentForm: {},
                bindStudentId: 0,
                schools: JSON.parse(localStorage.getItem('schools')),
                // token: localStorage.getItem('user-token'),
                bindVisible: false,
                mesVisible: false,
                searchForm: {
                    name: '',
                    schoolId: '',
                },
            }
        },
        methods: {
            bindStudent(item) {
                this.bindStudentId = item.id
                this.bindVisible = true
            },
            searchStudent() {
                let { schoolId, name } = this.searchForm
                if (!(schoolId && name)) {
                    this.$message.error('请输入完整的学生信息')
                    return
                }

                this.$api.searchStuden({ ...this.searchForm }).then((res) => {
                    if (res.length == 0) {
                        this.$message.error('信息有误，未查找到相关学生')
                    }

                    for (let item of res) {
                        item.cardId = item.cardId.replace(/./g, '*')
                    }
                    this.students = res
                    this.searchForm.schoolId = ''
                    this.searchForm.name = ''
                })
            },
            sureBind() {
                let { studentNumber, cardId } = this.studentForm
                if (!(studentNumber && cardId)) {
                    this.$message.error('请输入完整的学生信息')
                    return
                }

                this.$api
                    .bindStudent({
                        studentNumber,
                        cardId,
                        studentId: this.bindStudentId,
                    })
                    .then((res) => {
                        if (res) {
                            this.$message.success('绑定成功！')
                            this.getBindStudents()
                        }
                        this.bindVisible = false
                        this.studentForm.studentNumber = ''
                        this.studentForm.cardId = ''
                    })
            },
            getBindStudents() {
                this.$api.allStudents().then((res) => {
                    if (res && res.length > 0) {
                        this.$store.commit('saveAllStudens', res)
                    }
                })
            },
        },
    }
</script>

<style lang="scss" >
    .student-box {
        .el-form-item {
            margin-bottom: 20px;
        }
        .el-input__inner {
            width: 520px;
            height: 68px;
            line-height: 68px;
        }
    }
    .que-icon {
        background-image: url('../assets/img/que1.png');
    }
</style>
