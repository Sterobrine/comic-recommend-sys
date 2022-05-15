import axios from 'axios'
import vm from '@/main'

let baseURL = "";

if(process.env.NODE_ENV === 'development'){
    baseURL = "http://localhost:9000";
} else if(DE_ENV === 'production'){
    baseURL = "";
}

axios.defaults.withCredentials = true;

function HttpRequest(baseUrl){
    this.baseUrl = baseUrl;
}

HttpRequest.prototype.getInsideConfig = function(){
    return {
        baseURL: this.baseUrl,
        headers:{}
    }
}

HttpRequest.prototype.interceptors = function(instance){
    instance.interceptors.request.use(config => {
        let token = vm.$store.state.login.token;
        config.headers.Authorization = token;
        return config;
    }, error => Promise.reject(error));
    instance.interceptors.response.use(res => res,
        error => {
            return Promise.reject(error);
        });
}

HttpRequest.prototype.request = function(options){
    const instance = axios.create();
    //创建实例对象
    options = {...this.getInsideConfig(), ...options};
    //合并配置项
    this.interceptors(instance);
    //设置拦截器
    return instance(options);
    //发送请求
}

export default new HttpRequest(baseURL);