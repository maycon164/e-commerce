const {Category} = require('../models/category');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {

    const api = process.env.API_URL;

    //Listar todos
    app.get(`${api}/category`, async (req, res) => {

        const categoryList = await Category.find();
        if(!categoryList) res.status(500).json({error: "Cannot get anything from MongoDB"});
        
        res.status(200).json(categoryList);
   
    });

    //find by id
    app.get(`${api}/category/:id`, async (req, res) => {
    
        const category = await Category.findById(req.params.id);
        
        if(category) return res.status(200).json({success: true, category});
        else return res.status(404).json({success: false, message: `cannot find category with id ${req.params.id}`});
    
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

    //update by id
    app.put(`${api}/category/:id`, async (req, res) => {
        
        let category = await Category.findByIdAndUpdate( 
            req.params.id,
            {
                name: req.body.name,
                color: req.body.color,
                icon: req.body.icon
            },
            {new: true}
        )

        if(!category){
            res.status(400).json({
                success: false,
                message: `ìt wasnt be able update category with id ${req.params.id}`
            })            
        }
        
        res.status(200).json({
            success: true, 
            message: `Category with id ${req.params.id} it was updated`,
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