const express = require('express');
const app = express();

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


app.listen(3000, () => {
    console.log(api);
    console.log("Servidor rodando na porta 3000");
})