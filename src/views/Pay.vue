<template>
    <div class="h-100">
        <TopNav tit="帮人代付" :back="true" />
        <div class="bg-gray px-7">
            <div>
                <div class="label">
                    <span>学生查找</span>
                </div>
                <div class="student-box bg-white pt-4 pb-4 bor-rad5">
                    <el-form
                        ref="form"
                        :model="searchForm"
                        label-width="1.5rem"
                    >
                        <el-form-item label="学校">
                            <el-select
                                v-model="searchForm.schoolId"
                                placeholder="请选择学校"
                            >
                                <el-option
                                    class="student"
                                    v-for="(item, i) in schools"
                                    :key="i"
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
                        <el-form-item label="学号">
                            <el-input
                                v-model="searchForm.studentNumber"
                                placeholder="请输入学号"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <span
                                class="py-4 bg-primary bor-rad5 txt-white"
                                style="
                                    padding-left: 0.7rem;
                                    padding-right: 0.7rem;
                                "
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
                                    class="px-4 ml-3 py-3 bg-orange bor-rad5 txt-white"
                                    @click="pay(item)"
                                    >购买服务</span
                                >
                            </div>
                        </template>
                    </Person>
                </div>
            </div>

            <div class="my-8">
                <div class="label">
                    <span>代付记录</span>
                </div>
                <div v-if="payList.length == 0" class="pt-8 pb-4">
                    <img src="../assets/img/empty-bg.png" width="100%" />
                    <p class="txt-info txt-cen">空空如也，暂无代付记录~</p>
                </div>
                <div class="bg-white pay-box bor-rad5 mb-2 txt-cen" v-else>
                    <div
                        class="bg-primary lh-1 txt-white fs-12 px-6 py-4 flex record-tit"
                    >
                        <div class="time">付款时间</div>
                        <div class="time">姓名</div>
                        <div class="time">支付金额</div>
                        <div class="serve flex-1">购买服务</div>
                    </div>
                    <div
                        class="px-6"
                        v-for="(item, index) in payList"
                        :key="index"
                        @click="goDetail(item)"
                    >
                        <div
                            class="lh-1 txt-info py-4 flex ali-cen"
                            :class="{ 'bor-b': index < payList.length - 1 }"
                        >
                            <div class="time">{{ item.createTime }}</div>
                            <div class="time">{{ item.studentName }}</div>
                            <div class="time">
                                <p
                                    v-for="(detail, detailI) in item.detail"
                                    :key="detailI"
                                >
                                    {{ detail.price }}元
                                </p>
                            </div>
                            <div class="serve flex-1">
                                <p
                                    v-for="(detail, detailI) in item.detail"
                                    :key="detailI"
                                >
                                    {{ detail.moduleName }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="信息" :visible.sync="mesVisible" width="80%" center>
            <div class="txt-cen">电子学生证号见电话卡的编号</div>

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
                curStudent: JSON.parse(localStorage.getItem('curStudent')),
                schools: JSON.parse(localStorage.getItem('schools')),
                searchForm: {
                    name: '',
                    studentNumber: '',
                    schoolId: '',
                },
                students: [],
                mesVisible: false,
                payList: [],
            }
        },
        methods: {
            searchStudent() {
                let { schoolId, name, studentNumber } = this.searchForm
                if (!(schoolId && name && studentNumber)) {
                    this.$message.error('请输入完整的学生信息')
                    return
                }

                this.$api.searchStuden({ ...this.searchForm }).then((res) => {
                    if (res.length == 0 || !res[0]) {
                        this.$message.error('信息有误，未查找到相关学生')
                    }
                    res[0] ? (this.students = res) : ''
                    this.searchForm.schoolId = ''
                    this.searchForm.name = ''
                    this.searchForm.studentNumber = ''
                })
            },

            pay(item) {
                this.$router.push(`/setMeal?studentId=${item.id}`)
            },
            payRecord() {
                let params = { payType: 'other', studentId: 0 }
                this.$api.payRecords(params).then((res) => {
                    if (res.length > 0) {
                        res.forEach(
                            (item) => (item.detail = JSON.parse(item.detail))
                        )
                    }
                    this.payList = res
                })
            },
        },
        components: {},
        created() {
            this.payRecord()
        },
    }
</script>

<style  lang="scss" >
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
    .pay-box .time {
        width: 150px;
    }
</style>
