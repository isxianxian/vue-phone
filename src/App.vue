<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App',
        data: function () {
            return {}
        },
        methods: {},
        created() {
            if (window.name == '') {
                localStorage.clear()
                window.name = 'isFirstVisit'
            } else if (window.name == 'isFirstVisit') {
            }
        },
    }
</script>

<style lang="scss" scoped>
    #app {
        overflow-y: scroll;
    }
</style>

