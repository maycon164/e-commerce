const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

require('dotenv').config({
    path: './backend/.env'
})

module.exports = (app) => {

    const api = process.env.API_URL;

    //LISTAR TODOS OS PEDIDOS
    app.get(`${api}/order`, async (req, res) => {

        const orderList = await Order.find().populate('user', 'name').sort('dateOrdered');
        //.sort([['dateOrdered', 1]]);

        if (!orderList) res.status(500).json({ error: "Cannot get anything from MongoDB" });

        res.status(200).json(orderList);

    });

    //find by id
    app.get(`${api}/order/:id`, async (req, res) => {
        let order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    select: 'name description price',

                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                }
            });

        if (!order)
            return res.status(404).send("i cannot find order");

        return res.status(200).send(order);
    });

    //Cadastrar novo pedido
    app.post(`${api}/order`, async (req, res) => {

        let orderItensIds = Promise.all(req.body.orderItems.map(async orderItem => {

            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;

        }));

        let orderItensIdsResolved = await orderItensIds;

        let totalPrices = await Promise.all(orderItensIdsResolved.map(async id => {
            let orderItem = await OrderItem.findById(id).populate('product', 'price');
            let price = orderItem.product.price * orderItem.quantity;
            return price;
        }));

        let totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = new Order({
            orderItems: orderItensIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        });

        order = await order.save();

        if (!order)
            return res.status(400).send("the order cannot be created");

        return res.status(200).send(order);

    });

    //ATUALIZAR STATUS DO PEDIDO
    app.put(`${api}/order/:id`, async (req, res) => {

        let order = await Order.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        }, {
            new: true,
        });

        if (!order)
            return res.status(400).send("it cannot update the order");

        return res.status(200).send(order);
    });

    //DELETE ORDER

    app.delete(`${api}/order/:id`, async (req, res) => {

        Order.findByIdAndRemove(req.params.id).then(order => {
            if (order) {

                order.orderItems.forEach(async item => {
                    await OrderItem.findByIdAndRemove(item._id)
                });

                return res.status(200).send(order);

            } else {

                return res.status(404).send("cannot remove order");

            }
        }).catch(err => {
            return res.status(500).json({ message: err });
        });

    });

    //Total das vendas
    app.get(`${api}/order/get/totalsales`, async (req, res) => {

        let totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ])

        if (!totalSales)
            return res.status(400).send("the order sales cannot be generated")

        return res.status(200).send({ "totalsales": totalSales.pop().totalSales });

    });

    //Quantidade de pedidos
    app.get(`${api}/order/get/count`, async (req, res) => {
        let orderCount = await Order.countDocuments({});

        if (!orderCount)
            return res.status(500).json({ message: "cannot get total order" });

        return res.status(200).json({ orderCount });

    });

    //pedidos do usuario
    app.get(`${api}/order/get/userorders/:userid`, async (req, res) => {

        let userOrderList = await Order.find({ user: req.params.userid })
            .populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    select: 'name description price',

                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                }
            });

        if(!userOrderList)
            return res.status(500).json({success: false});
        
        return res.send(userOrderList);
    });

}