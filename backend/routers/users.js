const {User} = require('../models/user');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {

    const api = process.env.API_URL;

    app.get(`${api}/user`, async (req, res) => {

        const userList = await User.find();
        if(!userList) res.status(500).json({error: "Cannot get anything from MongoDB"});
        
        res.status(200).json(userList);
   
    });

    app.post(`${api}/user`, (req, res) => {

        const user = new User({
            name: req.body.name,
            image: req.body.image,
            countInStock: req.body.countInStock

        })

        user.save().then(createdUser => {
        
            res.status(201).json(createdUser);
        
        }).catch(error => {
        
            res.status(500).json({
                error,
                success:false
            });
        
        })

    });
}