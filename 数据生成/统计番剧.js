const fs = require('fs');

let data = fs.readFileSync('../追番.json', 'utf-8');
data = JSON.parse(data);

let animations = [];

for(uid in data){
    if(uid === 'totalUser' || uid === 'totalPage'){
        continue;
    }
    else{
        data[uid].forEach(item => {
            animations.push(item.id);
        });
    }
}

// for(let i=0;i<data.length;i++){
//     animations.push(data[i].title);
// }

console.log(animations.length);

animations = Array.from(new Set(animations))

console.log(animations.length, animations);