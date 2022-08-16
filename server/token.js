const jwt = require("jsonwebtoken");
const SECRET_KEY = "login2022";

exports.token = {
    sign:function(info, time='12h'){
        return jwt.sign(info, SECRET_KEY, {expiresIn:time});
    },
    isOut: function(token){
        if(!token) return true;
        if(token.split('.').length<3) return true;
        try {
            jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return true;
        }
        return false;
        // let now = Math.floor(Date.now()/1000);
        // if(token.exp <= now) return true;
        // else return false;
    },
    verify: function(token){
        if(!token) return null;
        return jwt.verify(token, SECRET_KEY);
    }
}