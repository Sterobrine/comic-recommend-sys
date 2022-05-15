import axios from './axios'

export default {
    getDetail: function(params){
        return axios.request({
            url:"/personal/detail",
            method: "GET",
            params
        });
    },
    getSubscribeList: function(params){
        return axios.request({
            url:"/personal/subscribe/list",
            method: "GET",
            params
        });
    },
    getSubscribeStatus: function(params){
        return axios.request({
            url:"/personal/subscribe/status",
            method: "GET",
            params
        });
    },
    enterSubscribeMovie: function(params){
        return axios.request({
            url:"/personal/subscribe/enter",
            method: "POST",
            params
        });
    },
    cancelSubscribeMovie: function(params){
        return axios.request({
            url:"/personal/subscribe/cancel",
            method: "POST",
            params
        });
    },
    getTag: function(params){
        return axios.request({
            url:"/personal/tag",
            method: "GET",
            params
        });
    },
    enterTag: function(params){
        return axios.request({
            url:"/personal/tag/enter",
            method: "POST",
            params
        });
    },
    cancelTag: function(params){
        return axios.request({
            url:"/personal/tag/cancel",
            method: "POST",
            params
        });
    },
}