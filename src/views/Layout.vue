<template>
    <div class="home h-100 bg-gray">
        <TopNav :back="false" :tit="navTit"></TopNav>
        <div class="main">
            <router-view
                v-if="isRouterAlive"
                @changeCur="changeCur"
            ></router-view>
        </div>
        <div
            class="bottom-nav flex ali-cen txt-cen txt-border bor-t"
            v-show="hasCurStudent"
        >
            <div
                class="flex-1"
                :class="[tabIndex == 0 ? 'active txt-primary' : '']"
                @click="changeTab(0)"
            >
                <div class="bg icon0"></div>
                <div>首页</div>
            </div>
            <div
                class="flex-1"
                :class="[tabIndex == 1 ? 'active txt-primary' : '']"
                @click="changeTab(1)"
            >
                <div class="bg icon1"></div>
                <div>亲情话机</div>
            </div>
            <div
                class="flex-1"
                :class="[tabIndex == 2 ? 'active txt-primary' : '']"
                @click="changeTab(2)"
            >
                <div class="bg icon2"></div>
                <div>消息推送</div>
            </div>
            <div
                class="flex-1"
                :class="[tabIndex == 3 ? 'active txt-primary' : '']"
                @click="changeTab(3)"
            >
                <div class="bg icon3"></div>
                <div>成绩查询</div>
            </div>
            <div
                class="flex-1"
                :class="[tabIndex == 4 ? 'active txt-primary' : '']"
                @click="changeTab(4)"
            >
                <div class="bg icon4"></div>
                <div>商店</div>
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
                isRouterAlive: false,
                tabIndex: 0,
                navTit: '首页',
                hasCurStudent: false,
                pathObj: {
                    0: {
                        path: '/home',
                        tit: '首页',
                    },
                    1: {
                        path: '/tel',
                        tit: '亲情话机',
                    },
                    2: {
                        path: '/msg',
                        tit: '消息推送',
                    },
                    3: {
                        path: '/fraction',
                        tit: '成绩查询',
                    },
                    4: {
                        path: '/store',
                        tit: '商店',
                    },
                },
            }
        },
        methods: {
            ...mapMutations(['loginState']),
            changeTab(index) {
                // this.tabIndex = index
                let obj = this.pathObj
                this.$router.push(obj[index].path)
                this.navTit = obj[index].tit
            },
            changeTabIndex(path) {
                let obj = {
                    '/home': 0,
                    '/tel': 1,
                    '/msg': 2,
                    '/fraction': 3,
                    '/store': 4,
                }
                this.tabIndex = obj[path]
                this.navTit = this.pathObj[this.tabIndex].tit
            },

            getCodeParam() {
                let search = window.location.search
                if (!search) {
                    return null
                }
                let arr = search.substr(1).split('&'),
                    obj = {}
                for (let item of arr) {
                    let tempArr = item.split('=')
                    obj[tempArr[0]] = tempArr[1]
                }

                return obj.code
            },
            loginPlan() {
                let code = this.getCodeParam()
                code = 1
                if (!code) {
                    let href =
                        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd12e5a279b145f0a&redirect_uri=https%3A%2F%2Fyunxuer.com%2Findex.html&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
                    window.location.replace(href)
                } else {
                    this.userLogin(code)
                }
            },
            userLogin(code) {
                let token = '18b1b7bf-2531-42a3-82e5-5581545e2ddd'
                // localStorage.setItem('user-token', token)
                sessionStorage.setItem('user-token', token)
                this.isRouterAlive = true
                return
                return this.$api.login(code).then((res) => {
                    if (res) {
                        this.$message({
                            message: '登陆成功了~',
                            type: 'success',
                            duration: 1000,
                        })
                        this.loginState(true)
                        localStorage.setItem('user-token', res)
                        this.isRouterAlive = true
                        return '1'
                    }
                })
            },
            changeCur(has) {
                this.hasCurStudent = has
            },
        },
        watch: {
            $route(to, from) {
                let { path } = to
                this.changeTabIndex(path)
            },
        },
        created() {
            let token = sessionStorage.getItem('user-token')
            if (!token) {
                this.loginPlan()
            } else {
                let { path } = this.$route
                this.changeTabIndex(path)
                this.isRouterAlive = true
                let curStudent = sessionStorage.getItem('curStudent')
                this.hasCurStudent = curStudent ? true : false
            }
        },
    }
</script>

<style scoped  lang="scss" >
    .home {
        .main {
            height: calc(100% - 180px);
        }
        .bottom-nav {
            height: 90px;
            font-size: 20px;
            .bg {
                display: inline-block;
                width: 48px;
                height: 48px;
            }
            .icon0 {
                background-image: url('../assets/img/nav1.1.png');
            }
            .icon1 {
                background-image: url('../assets/img/nav2.1.png');
            }
            .icon2 {
                background-image: url('../assets/img/nav3.1.png');
            }
            .icon3 {
                background-image: url('../assets/img/nav4.1.png');
            }
            .icon4 {
                background-image: url('../assets/img/nav5.1.png');
            }

            .active {
                .icon0 {
                    background-image: url('../assets/img/nav1.png');
                }
                .icon1 {
                    background-image: url('../assets/img/nav2.png');
                }
                .icon2 {
                    background-image: url('../assets/img/nav3.png');
                }
                .icon3 {
                    background-image: url('../assets/img/nav4.png');
                }
                .icon4 {
                    background-image: url('../assets/img/nav5.png');
                }
            }
        }
    }
</style>
