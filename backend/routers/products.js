const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

const VALID_EXTENSION_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

//CONFIGURANDO LOCAL DE UPLOAD
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadError = new Error('Invalid type of file');

        if (VALID_EXTENSION_MAP[file.mimetype]) {
            uploadError = null;
        }

        cb(uploadError, 'backend/public/upload')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(" ", "-")
        const extension = VALID_EXTENSION_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    }
})
//upload
const upload = multer({ storage: storage })

require('dotenv').config({
    path: './backend/.env'
})

module.exports = (app) => {
    const api = process.env.API_URL;

    //VALIDAR ID DO PRODUTO
    function checkId(id, res) {

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(500).json({ message: "product invalid id" })

    }

    //Lista de todoso os product
    app.get(`${api}/product`, async (req, res) => {

        let filter = {};

        if (req.query.categories) {
            filter = {
                category: req.query.categories.split(',')
            }
        }

        const productList = await Product
            .find(filter)
            .select('name price image description category')
            .populate('category');

        if (!productList)
            return res.status(500).json({ error: "Cannot get anything from MongoDB" });

        return res.status(200).json(productList);

    });

    //find by productId
    app.get(`${api}/product/:id`, async (req, res) => {

        checkId(req.params.id, res);

        let product = await Product
            .findById(req.params.id)
            .populate('category');

        if (!product)
            return res.status(404).json({ message: "cannot find product" });

        return res.json(product);
    });

    // CREATE PRODUCT and post method
    app.post(`${api}/product`, upload.single('image'), async (req, res) => {

        const category = await Category.findById(req.body.category);

        if (!category)
            return res.status(404).json({ message: "Invalid Category" });

        const file = req.file;

        if (!file)
            return res.status(500).json({ message: "no file in the request" });

        const filename = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${filename}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        });

        product = await product.save();

        if (!product)
            return res.status(500).json({ message: "product cannot be created" });

        return res.status(200).json({
            message: "Product created successfully",
            product
        });

    });

    // UPDATE Product
    app.put(`${api}/product/:id`, async (req, res) => {

        checkId(req.params.id, res);

        const category = await Category.findById(req.body.category);

        if (!category)
            return res.status(404).json({ message: "category invalid" });

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
            { new: true }
        )

        if (!product)
            return res.status(500).json({ message: 'Product cannot be able to be updated' })

        return res.status(200).json({
            message: "Product it was successfully updated",
            product
        })

    })

    //Delete By id
    app.delete(`${api}/product/:id`, async (req, res) => {

        checkId(req.params.id, res);

        let product = await Product.findByIdAndRemove(req.params.id);

        if (!product)
            return res.status(404).json({ message: "Product not found" })

        return res.status(200).json({
            success: true,
            message: "Product successfully removed",
            product
        });

    });

    app.get(`${api}/product/get/count`, async (req, res) => {
        let productCount = await Product.countDocuments({});

        if (!productCount)
            return res.status(500).json({ error: "Cannot get anything from db" });

        return res.status(200).json({
            success: true,
            count: productCount
        });

    });

    // isFeatured
    app.get(`${api}/product/get/featured/:count`, async (req, res) => {
        const count = req.params.count ? req.params.count : 0;

        let listProduct = await Product.find({
            isFeatured: true
        }).limit(+count);

        if (!listProduct)
            return res.status(500).json({ message: "error", });

        return res.status(200).json(listProduct);
    });

    //ENVIANDO ARRAY DE IMAGES PARA O PRODUTO
    app.put(`${api}/product/images-gallary/:id`, upload.array('images', 10), async (req, res) => {
        checkId(req.params.id, res);

        let files = req.files;
        let imagesPath = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

        if (files) {
            imagesPath = files.map(file => `${basePath}${file.filename}`);
        }

        let product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPath
            },
            { new: true }
        );

        if (!product)
            return res.status(500).json({ message: 'Product cannot be able to be updated' })

        return res.status(200).json({
            message: "Product it was successfully updated",
            product
        })
    })

}