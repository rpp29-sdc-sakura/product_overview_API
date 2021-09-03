const mongoose = require('mongoose');
//onst config = require('../config.js');




function main() {
    mongoose.connect('mongodb://localhost/products',  { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('db running');
}

const productSchema = mongoose.Schema({
    id: Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: Number,
    features: [
        {
            feature: String,
            value: String
        }
    ],
    styles: [
        {
            style_id: Number,
            name: String,
            original_price: Number,
            sale_price: Number,
            default: Boolean,
            photos: [
                {
                    thumbnail_url: String,
                    url: String
                }
            ],
            skus: {
                SKU : {
                    size: String,
                    quantity: String
                }
            }
        }
    ]
});

const Product = mongoose.model('Product', productSchema);

console.time('DB Entry');

const newProduct = new Product({
    id: 1,
    name: 'name',
    slogan: 'slogan',
    description: 'description',
    category: 'String',
    default_price: 1,
    features: [
        {
            feature: 'String',
            value: 'String'
        }
    ],
    styles: [
        {
            style_id: 1,
            name: 'String',
            original_price: 1,
            sale_price: 1,
            default: true,
            photos: [
                {
                    thumbnail_url: 'String',
                    url: 'String'
                }
            ],
            skus: {
                1: {
                    size: 'String',
                    quantity: 'String'
                }
            }
        }
    ]
});

newProduct.save();
console.timeEnd('DB Entry');


console.time('Product Search');
Product.find({id: 1});
console.timeEnd('Product Search');


main();
