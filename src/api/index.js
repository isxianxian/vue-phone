import { get, post } from './http.js';
import Qs from 'qs';

export default {
  // 登陆
  login(code) {
    return post('/user/login', Qs.stringify({ code }));
  },
  // 获取所有学校
  allSchool() {
    return get('/school')
  },
  // 获取所有学生
  allStudents() {
    return get('/user/student');
  },
  // 查询学生
  searchStuden(params) {
    return get('/student', params);
  },
  // 绑定学生
  bindStudent(params) {
    return post('/user/binding_student', Qs.stringify(params))
  },
  // 所有亲情号
  allFamilyNum(params) {
    return get('/call/guardians', params)
  },
  // 增加亲情号
  addFamilyNum(params) {
    return post('/call/add/guardian', Qs.stringify(params));
  },
  // 删除亲情号
  delFamilyNum(guardianId) {
    return post('/call/delete/guardian', Qs.stringify({ guardianId }));
  },
  // 获取即时消息
  getMes(params) {
    return get('/message', params)
  },
  // 发送消息
  pushMes(params) {
    return post('/message/send', Qs.stringify(params))
  },
  // 成绩查询
  queryScore(studentId) {
    return get('/exam', { studentId })
  },
  // 所有套餐
  allPlan(studentId) {
    return get('/plan', { studentId })
  },
  // 套餐使用情况
  planUsed(studentId) {
    return get('/plan/used', { studentId })
  },
  pay(params) {
    return post('/order/plan', Qs.stringify(params))
  },
  judgeOrder(orderId) {
    return get('/order/query', { orderId })
  },
  // 付款记录
  payRecords(params) {
    return get('/order/record', params)
  },
  // 通话记录
  telRecords(studentId) {
    return get('/call', { studentId })
  }
}