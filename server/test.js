var isMatch = function (s, p) {
    s = s.split('');
    p = p.split('');
    let a = 0, b = 0;
    let tmp = null;
    while (a < s.length && b < p.length) {
        tmp = p.slice(b, b + 2);
        if (tmp.length > 1 && tmp[1] === '*') {
            while (a < s.length && equal(tmp[0], s[a])) a++;
            b += 2;
        }
        else {
            console.log(tmp[0], s[a]);
            if (!equal(tmp[0], s[a])) return false;
            a++;
            b++;
        }
    }
    if (a < s.length) return false;
    else return true;
};

var equal = function (a, b) {
    if (a === '.') return true;
    else return a === b;
}

console.log(isMatch('aab', 'c*a*b*'));


