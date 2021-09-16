const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {
    const api = process.env.API_URL;

    function checkId(id, res){

        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(500).json({message:"product invalid id"})
    
    }

    //Lista de todoso os product
    app.get(`${api}/product`, async (req, res) => {
        
        const productList = await Product
        .find()
        .select('name price image description category')
        .populate('category');

        if(!productList)
            return res.status(500).json({error: "Cannot get anything from MongoDB"});

        return res.status(200).json(productList);

    });

    //find by productId
    app.get(`${api}/product/:id`, async (req, res) => {
        
        checkId(req.params.id, res);

        let product = await Product
        .findById(req.params.id)
        .populate('category');
        
        if(!product) 
            return res.status(404).json({message:"cannot find product"});
        
        return res.json(product);
    });

    // CREATE PRODUCT and post method
    app.post(`${api}/product`, async (req, res) => {

        const category = await Category.findById(req.body.category);

        if(!category) 
            return res.status(404).json({message: "Invalid Category"});
        

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

    // UPDATE Product
    app.put(`${api}/product/:id`, async (req, res) => {

        checkId(req.params.id, res);

        const category = await Category.findById(req.body.category);
        
        if(!category) 
            return res.status(404).json({message: "category invalid"});

        let product = await Product.findByIdAndUpdate(
            req.params.id,
            {
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
            },
            {new:true}
        )

        if(!product) 
            return res.status(500).json({message: 'Product cannot be able to be updated'}) 
        
        return res.status(200).json({
            message: "Product it was successfully updated",
            product
        })

    })

    //Delete By id
    app.delete(`${api}/product/:id`, async (req, res) => {

        checkId(req.params.id, res);    

        let product = await Product.findByIdAndRemove(req.params.id);
        
        if(!product)
            return res.status(404).json({message: "Product not found"})

        return res.status(200).json({
            success: true, 
            message:"Product successfully removed",
            product
        });
    
    });

    app.get(`${api}/product/get/count`, async (req, res) => {
        let productCount = await Product.countDocuments({});


        if(!productCount) 
            return res.status(500).json({error: "Cannot get anything from db"});

        return res.status(200).json({
            success: true,
            count: productCount
        });

    });

}