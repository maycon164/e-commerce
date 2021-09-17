const expressJwt = require('express-jwt');

require('dotenv').config({
    path:'./backend/.env'
})

const secret = process.env.SECRET;
console.log(secret);

const authJwt = expressJwt({
    secret: secret,
    algorithms: ['HS256']
});

module.exports = authJwt;
