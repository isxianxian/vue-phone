import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasLogin: false,

    getSchool: false, // 是否获取学校数据了
    schools: [],

    getStudent: false,
    allStudents: [],

    hasCurStudent: false,

    getMsgs: false,
    msgs: [],

    getScore: false,
    scoreList: [],
  },
  mutations: {
    loginState(state, val) {
      state.hasLogin = val;
    },
    saveToken(state, token) {
      state.token = token;
      state.hasLogin = true;
    },
    saveSchools(state, schools) {
      state.getSchool = true;
      state.schools = schools;
    },
    saveAllStudens(state, students) {
      state.getStudent = true;
      state.allStudents = students;
    },
    saveCurStudent(state, student) {
      sessionStorage.setItem('curStudent', JSON.stringify(student));
      state.hasCurStudent = true;
      state.getMsgs = false;
      state.msgs = [];
      state.getScore = false;
      state.scoreList = [];
    },
    saveMsgs(state, msgs) {
      state.getMsgs = true;
      state.msgs = msgs;
    },
    saveScore(state, scoreList) {
      state.getScore = true;
      state.scoreList = scoreList;
    },
  },
  actions: {
  },
  getters: {
  }
})
