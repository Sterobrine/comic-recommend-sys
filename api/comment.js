import axios from './axios'

export default {
    getCommentList: function(params){
        return axios.request({
            url:"/comment/list",
            method: "GET",
            params
        });
    },
    addComment: function(params){
        return axios.request({
            url:"/comment/add",
            method: "POST",
            params
        });
    },
    addCommentThumb: function(params){
        return axios.request({
            url:"/comment/thumb/add",
            method: "POST",
            params
        });
    },
    cancelCommentThumb: function(params){
        return axios.request({
            url:"/comment/thumb/cancel",
            method: "POST",
            params
        });
    },
    getCommentCount: function(params){
        return axios.request({
            url:"/comment/count",
            method: "GET",
            params
        });
    },
}