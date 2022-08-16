let fs = require('fs');
let path = require('path');
let data = fs.readFileSync(path.resolve(__dirname, '../info.json'), 'utf-8');
data = JSON.parse(data).data;

let tags = [];

for(let i=0;i<data.length;i++){
    tags = tags.concat(data[i].tags);
}

tags = Array.from(new Set(tags));
console.log(tags);