import { Message, Loading } from 'element-ui';
import axios from 'axios';
let showLoad = null;

// 环境的切换 
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = '/api';
} else {
  // axios.defaults.baseURL = 'https://yuncoding.cn';
}


axios.defaults.timeout = 10000;


axios.defaults.withCredentials = false;
// 允许跨域。
// 后端要设置Access-Control-Allow-Origin为你的源地址，例如http://localhost:8080，不能是*，而且还要设置header('Access-Control-Allow-Credentials: true');

axios.defaults.validateStatus = function validateStatus(status) {
  //=>自定义成功失败规则：RESOLVE / REJECT（默认规则：状态码以2开头算作成功）
  return /^(2|3)\d{2}$/.test(status);
};



axios.interceptors.request.use(
  config => {
    // 请求拦截器   
    // 每次发送请求之前判断vuex中是否存在token        
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 

    const token = sessionStorage.getItem('user-token');
    token && (config.headers['Authentication'] = token);
    showLoad = Loading.service({
      lock: true,
      text: '拼命加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    });
    return config;
  },
  error => {
    return Promise.error(error);
  }
)

axios.interceptors.response.use(
  response => {
    showLoad.close();
    // 如果返回的状态码以2/3开头，说明接口请求成功，可以正常拿到数据     
    // 否则的话抛出错误
    if (response.data.code == 1) {
      return response.data.data || response.data.message;
    } else {
      Message.error(response.data.message)
    }

  },
  // 服务器状态码不是2/3开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    showLoad.close();
    console.log(error, '44')
    if (error.response.status) {
      switch (error.response.status) {
        //   // 401: 未登录
        //   // 未登录则跳转登录页面，并携带当前页面的路径
        //   // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        //   case 401:
        //     router.replace({
        //       path: '/login',
        //       query: {
        //         redirect: router.currentRoute.fullPath
        //       }
        //     });
        //     break;

        //   // 403 token过期
        //   // 登录过期对用户进行提示
        //   // 清除本地token和清空vuex中token对象
        //   // 跳转登录页面                
        //   case 403:
        //     Toast({
        //       message: '登录过期，请重新登录',
        //       duration: 1000,
        //       forbidClick: true
        //     });
        //     // 清除token
        //     localStorage.removeItem('token');
        //     store.commit('loginSuccess', null);
        //     // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
        //     setTimeout(() => {
        //       router.replace({
        //         path: '/login',
        //         query: {
        //           redirect: router.currentRoute.fullPath
        //         }
        //       });
        //     }, 1000);
        //     break;

        //   // 404请求不存在
        case 404:
          Message.error({
            content: '页面消失啦',
          });
          break;
        // 其他错误，直接抛出错误提示
        default:
          let errMes = error.response.data.message;
          Message.error(errMes);
          break;
      }
      // return Promise.reject(error.response);
    }
  }
);

export default axios;