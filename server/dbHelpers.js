const Product = require('../database/mongo.js');

const fetchProducts = async params => {
    // Selects the page of results to return. Default 1.
    params.page = params.page && typeof parseInt(params.page) === 'number' ? parseInt(params.page) : 1;
    // Specifies how many results per page to return. Default 5.
    params.count = params.count && typeof parseInt(params.count) === 'number' ?  parseInt(params.count) : 5;
    // Defines excluded properties from result
    const projection = { '_id': 0, '__v': 0, 'features': 0, 'styles': 0};
    let products = await Product.find({id: {$gt: (page - 1) * count}}, projection).cach({key: JSON.stringify(params)})
    .limit(count).sort({'id': 1});
    
    return products;
}


const fetchProduct = async id => {
    let product = await Product.find({ id }, { "_id": false, "__v": false }).cache({ key: id });

    if (product.length > 0) {
        product = product[0].toObject();
        // Reformats skus property
        product.styles = product.styles.map(style => {
            let skus = {}
            style.skus.forEach(sku => {
                skus[sku.id] = { quantity: sku.quantity, size: sku.size };
                style.skus = skus;
            });
            return style;
        });
    }
    
    return product;
}


const updateProduct = async (id, update) => {

    const objProperties = {
        features: true,
        styles: true,
        photos: true,
        skus: true
    }

    const property = Object.keys(update)[0];
    if (objProperties[property]) {
        update[property] = JSON.parse(update[property]);
    }

    const result = await Product.updateOne({ id }, update)
    .then(success => {
        return success;
    })
    .catch(err => {
        return err;
    })
    console.log(result);
    return result;
}


module.exports = {
    fetchProducts,
    fetchProduct,
    updateProduct
}