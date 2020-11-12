import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import './assets/css/style.scss'
import 'lib-flexible/flexible.js'

import common from './common';

Vue.prototype.$common = common;

import api from './api';
Vue.prototype.$api = api;

import TopNav from './components/TopNav.vue';
import Person from './components/Person.vue'
Vue.component('TopNav', TopNav);
Vue.component('Person', Person);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
