const mongoose = require('mongoose');
const { MONGO_HOST, MONGO_USER, MONGO_PASS } = require('../config.js');

//onst config = require('../config.js');

function main() {
    mongoose.connect(`mongodb://${MONGO_HOST}/productOverview`,  { useNewUrlParser: true, useUnifiedTopology: true })
    .then(success => {
        console.log('Connected to DB');
    })
    .catch(err => {
        console.log(err);
    })
    //mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@productoverview.fnpft.mongodb.net/productOverview?retryWrites=true&w=majority`,  { useNewUrlParser: true, useUnifiedTopology: true });
}

const productSchema = mongoose.Schema({
    id: { 
        type: Number, 
        unique: true,
        index: true
    },
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: Number,
    features: [
        {
            feature: String,
            value: String,
            _id: { id: false }
        }
    ],
    styles: [
        {
            style_id: Number,
            name: String,
            original_price: Number,
            sale_price: Number,
            'default?': Boolean,
            photos: [
                {
                    thumbnail_url: String,
                    url: String,
                    _id: { id: false }
                }
            ],
            skus: [
                {
                    id: Number,
                    quantity: String,
                    size: String,
                    _id: { id: false }
                }
            ],
            _id: { id: false }
        }
    ]
});


const Product = mongoose.model('Product', productSchema);
main();

module.exports = Product;