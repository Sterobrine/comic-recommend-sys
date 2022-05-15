import axios from './axios'

export default {
    getMovieInfo: function(params){
        return axios.request({
            url:"/category/list",
            method: "GET",
            params
        });
    },
    getTypes: function(params){
        return axios.request({
            url:"/category/type",
            method: "GET",
            params
        });
    },
}