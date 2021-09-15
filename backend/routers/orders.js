const {Order} = require('../models/order');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {

    const api = process.env.API_URL;

    app.get(`${api}/order`, async (req, res) => {

        const orderList = await Order.find();
        if(!orderList) res.status(500).json({error: "Cannot get anything from MongoDB"});
        
        res.status(200).json(orderList);
   
    });

    app.post(`${api}/order`, (req, res) => {

        const order = new Order({
            name: req.body.name,
            image: req.body.image,
            countInStock: req.body.countInStock

        })

        order.save().then(createdOrder => {
        
            res.status(201).json(createdOrder);
        
        }).catch(error => {
        
            res.status(500).json({
                error,
                success:false
            });
        
        })

    });
}