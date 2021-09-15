const {Category} = require('../models/category');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {

    const api = process.env.API_URL;

    app.get(`${api}/category`, async (req, res) => {

        const categoryList = await Category.find();
        if(!categoryList) res.status(500).json({error: "Cannot get anything from MongoDB"});
        
        res.status(200).json(categoryList);
   
    });

    app.post(`${api}/category`, (req, res) => {

        const category = new Category({
            name: req.body.name,
            image: req.body.image,
            countInStock: req.body.countInStock

        })

        category.save().then(createdCategory => {
        
            res.status(201).json(createdCategory);
        
        }).catch(error => {
        
            res.status(500).json({
                error,
                success:false
            });
        
        })

    });
}