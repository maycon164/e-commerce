const {Order} = require('../models/order');
const {OrderItem} = require('../models/order-item');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {

    const api = process.env.API_URL;

    app.get(`${api}/order`, async (req, res) => {

        const orderList = await Order.find().populate('user', 'name').sort('dateOrdered');
        //.sort([['dateOrdered', 1]]);

        if(!orderList) res.status(500).json({error: "Cannot get anything from MongoDB"});
        
        res.status(200).json(orderList);
   
    });


    app.get(`${api}/order/:id`, async (req, res) => {
        let order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: {
                path:'product',
                select: 'name description price',
                
                populate: {
                    path:'category',
                    select: 'name'
                }
            }
        });

        if(!order)
            return res.status(404).send("i cannot find order");
        
        return res.status(200).send(order);
    });

    app.post(`${api}/order`, async (req, res) => {

        let orderItensIds = Promise.all (req.body.orderItems.map(async orderItem => {
            
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product : orderItem.product
            })

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;

        }));

        let orderItensIdsResolved = await orderItensIds;

        let order = new Order({
            orderItems: orderItensIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user
        });

        order = await order.save();

        if(!order)
            return res.status(400).send("the order cannot be created");

        return res.status(200).send(order);

    });
}