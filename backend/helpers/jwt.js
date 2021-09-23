const expressJwt = require('express-jwt');

require('dotenv').config({
    path:'./backend/.env'
})

const secret = process.env.SECRET;
const api = process.env.API_URL;
console.log(api);

const authJwt = expressJwt({
    secret: secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
}).unless({
    path: [
        {url:/\/api\/v1\/public\/upload(.*)/, methods: ['GET', 'OPTIONS']},
        {url:/\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
        {url:/\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS']},
        `${api}/user/login`,
        `${api}/user/register`
    ]
})

async function isRevoked(req, playload, done){
    if(!playload.isAdmin){
        return done(null, true)
    }

    return done();
}

module.exports = authJwt;
