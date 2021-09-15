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

    //Post Category
    app.post(`${api}/category`, async (req, res) => {

        let category = new Category({
            name: req.body.name,
            color: req.body.color,
            icon : req.body.icon,
        })

        category = await category.save();

        if(!category) res.status(404).send("It wasnt be able to create the new category");

        res.status(202).json({
            message: "New category created",
            category
        })
        
    });

    //DELETE METHOD

    app.delete(`${api}/category/:id`, (req, res) => {
        
        Category.findByIdAndRemove(req.params.id).then(category => {
            if(category){
                
                return res.status(200).json({
                    success: true,
                    message: "Category deleted with success",
                    category
                })

            }else{

                return res.status(404).json({
                    success: false,
                    message: `cannot find the category with id ${req.params.id}` ,
                })

            }
        }).catch( error => {

            return res.status(500).json({
                message:"Error with our server",
                error
            })

        })

    });

}