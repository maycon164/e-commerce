const expressJwt = require('express-jwt');

require('dotenv').config({
    path:'./backend/.env'
})

const secret = process.env.SECRET;
const api = process.env.API;
console.log(secret);

const authJwt = expressJwt({
    secret: secret,
    algorithms: ['HS256']
}).unless({
    path: [
        {url:/\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
        `${api}/user/login`,
        `${api}/user/register`
    ]
})

module.exports = authJwt;
