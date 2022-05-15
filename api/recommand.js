import axios from './axios'

export default {
    getRecommandList: function(params){
        return axios.request({
            url:"/recommand/list",
            method: "GET",
            params
        });
    },
}