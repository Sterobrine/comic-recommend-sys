import axios from './axios'

export default {
    getSearchList: function(params){
        return axios.request({
            url:"/search/list",
            method: "GET",
            params
        });
    },
}