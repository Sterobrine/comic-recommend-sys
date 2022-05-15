import axios from './axios'

export default {
    loginCheck: function(params){
        return axios.request({
            url:"/login/check",
            method: "POST",
            params
        });
    },
    login: function(params){
        return axios.request({
            url:"/login/login",
            method: "POST",
            params
        });
    },
    regist: function(params){
        return axios.request({
            url:"/login/regist",
            method: "POST",
            params
        });
    },
}