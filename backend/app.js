const express = require('express');
const app = express();
const mongoose = require('mongoose');
const consign = require('consign');

app.use(express.json());
app.use(express.urlencoded({extended:true}))

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