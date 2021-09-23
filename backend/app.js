const express = require('express');
const app = express();
const mongoose = require('mongoose');
const consign = require('consign');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/public/upload', express.static(__dirname + '/public/upload'));
app.use(authJwt);
app.use(errorHandler);

consign({
    verbose: true,
    locale: 'pt-br'
}).include('/backend/routers').into(app);

//DOTENV -variaveis de ambiente
require('dotenv').config({
    path:'./backend/.env'
})

const api = process.env.API_URL;


//CONECTANDO AO MONGO DB
mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eshop-database'
    }).then(() => {
    console.log("Conectado ao mongoDB");
}).catch( err => console.error(err))

app.listen(8080, () => {
    console.log(api);
    console.log("Servidor rodando na porta 8080");
})