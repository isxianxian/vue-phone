<template>
    <div class="h-100 bg-gray over-scroll" ref="box">
        <div class="px-7 py-5" ref="content">
            <div>
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="content"
                >
                </el-input>
            </div>
            <div
                class="bg-green bor-rad5 txt-cen fs-12 txt-white my-4"
                style="height: 1rem; line-height: 1rem"
                @click="pushMes"
            >
                推送
            </div>
            <div>
                <div class="label">
                    <span>消息记录（{{ curStudent.name }}）</span>
                </div>
                <div v-if="msgs.length">
                    <div
                        class="p-6 bg-white mb-6 bor-rad5"
                        v-for="(item, index) in msgList"
                        :key="index"
                    >
                        <div class="txt-primary mb-4">
                            {{ item.createTime }}
                        </div>
                        <div>{{ item.content }}</div>
                    </div>
                </div>
                <div v-else class="txt-info ml-4">暂无消息~</div>
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
                content: '',
                hasMsg: true,
                pageNum: 1,
                msgList: [],
                curStudent: JSON.parse(sessionStorage.getItem('curStudent')),
            }
        },
        methods: {
            ...mapMutations(['saveMsgs']),
            getMes(isPush) {
                let {
                        curStudent: { id },
                        pageNum,
                    } = this,
                    msgs = [],
                    msgList = [...this.msgList]

                this.$api
                    .getMes({ pageNum, pageSize: 10, studentId: id })
                    .then((res) => {
                        if (res) {
                            if (isPush) {
                                msgs = res
                                msgList = res
                                this.saveMsgs(msgs)
                            } else {
                                msgList.push(...res)
                            }
                            this.pageNum += 1
                            this.msgList = msgList
                        }
                        this.hasMsg = res && res.length ? true : false
                    })
            },
            pushMes() {
                let {
                    curStudent: { id },
                    content,
                } = this

                if (!content) {
                    this.$message.error('消息不能为空！')
                    return
                }

                this.$api.pushMes({ studentId: id, content }).then((res) => {
                    if (res) {
                        this.$message.success(res)
                        this.content = ''
                        this.pageNum = 1
                        this.getMes(true)
                    }
                })
            },
        },
        computed: {
            ...mapState(['getMsgs', 'msgs']),
        },
        created() {
            if (!this.getMsgs) {
                this.getMes(true)
            } else {
                this.pageNum = 2
                this.msgList = [...this.msgs]
            }
        },
        mounted() {
            this.$nextTick(() => {
                let _this = this,
                    boxEle = this.$refs.box,
                    contentEle = this.$refs.content
                boxEle.onscroll = function () {
                    let boxH = boxEle.clientHeight,
                        contentH = contentEle.offsetHeight,
                        scrollH = boxEle.scrollTop
                    if (boxH + scrollH >= contentH - 10 && _this.hasMsg) {
                        _this.hasMsg = false
                        _this.getMes()
                    }
                }
            })
        },
    }
</script>

<style lang="scss" >
</style>
