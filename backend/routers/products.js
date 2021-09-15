const {Product} = require('../models/product');
require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {
    const api = process.env.API_URL;

    app.get(`${api}/product`, async (req, res) => {
        const productList = await Product.find();

        if(!productList) res.status(500).json({error: "Cannot get anything from MongoDB"});

        res.status(200).json(productList);
    });

    app.post(`${api}/product`, (req, res) => {

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
}