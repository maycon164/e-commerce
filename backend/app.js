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

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Products', productSchema);


app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find();
    
    if(!productList) res.status(500).json({error: "Cannot get anything from MongoDB"});

    res.status(200).json(productList);
});

app.post(`${api}/products`, (req, res) => {

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock

    })

    product.save().then(createdProduct => {
        res.status(201).json(createdProduct);
    }).catch(error => {
        res.status(500).json({
            error,
            success:false
        });
    })

});

//CONECTANDO AO MONGO DB
mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eshop-database'
    }).then(() => {
    console.log("Conectado ao mongoDB");
}).catch( err => console.error(err))

app.listen(3000, () => {
    console.log(api);
    console.log("Servidor rodando na porta 3000");
})