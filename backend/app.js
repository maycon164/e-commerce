const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({extended:true}))

//DOTENV -variaveis de ambiente
require('dotenv').config({
    path:'./backend/.env'
})

const api = process.env.API_URL;

app.get(`${api}/products`, (req, res) => {
    res.status(200).json({
        id:1,
        message:"OLÁ MEU AMIGO"
    })
});

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log(req.body)
    newProduct.otherMessage = "TUDO BOM COM VOCE?"
    res.status(200).json(newProduct);
});

//CONECTANDO AO MONGO DB
mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
    console.log("Conectado ao mongoDB");
}).catch( err => console.error(err))

app.listen(3000, () => {
    console.log(api);
    console.log("Servidor rodando na porta 3000");
})