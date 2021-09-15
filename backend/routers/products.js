const {Product} = require('../models/product');
const {Category} = require('../models/category');

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

    // CREATE PRODUCT and post method
    app.post(`${api}/product`, async (req, res) => {

        const category = await Category.findById(req.body.category);

        if(!category) {
            return res.status(404).json({message: "Invalid Category"});
        }

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription, 
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        });

        product = await product.save();

        if(!product)
            return res.status(500).json({message: "product cannot be created"});
        
        return res.status(200).json({
            message: "Product created successfully",
            product
        });

    });
}