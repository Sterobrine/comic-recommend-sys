import axios from './axios'

export default {
    getAllPopular: function(params){
        return axios.request({
            url:"/home/popular/all",
            method: "GET",
            params
        });
    },
    getMonthPopular: function(params){
        return axios.request({
            url:"/home/popular/month",
            method: "GET",
            params
        });
    },
    getHead: function(params){
        return axios.request({
            url:"/home/head",
            method: "GET",
            params
        });
    },
}