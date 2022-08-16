let axios = require('axios');

// axios.get('http://8.130.11.154:9000/comment/list',{
//     headers:{
//         ContentType: 'application/json'
//     },
//     params:{
//         option:{
//             num: 10,
//             mid: '8892'
//         }
//     }
// }).then(res => console.log(res.data));

console.log(JSON.stringify({option:{
    num: 10,
    mid: '8892'
}}))