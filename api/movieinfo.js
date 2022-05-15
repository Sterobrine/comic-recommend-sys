import axios from './axios'

export default {
    getMovieInfo: function(params){
        return axios.request({
            url:"/movie/info",
            method: "GET",
            params
        });
    },
    getMovieRecommand: function(params){
        return axios.request({
            url:"/movie/recommand",
            method: "GET",
            params
        });
    },
    getMovieSubscribeCount: function(params){
        return axios.request({
            url:"/movie/subscribe/count",
            method: "GET",
            params
        });
    },
}