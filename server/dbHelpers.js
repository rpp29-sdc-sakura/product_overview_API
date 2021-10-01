const Product = require('../database/mongo.js');

const fetchProducts = async params => {
    // Selects the page of results to return. Default 1.
    const page = params.page && typeof parseInt(params.page) === 'number' ? parseInt(params.page) : 1;
    // Specifies how many results per page to return. Default 5.
    const count = params.count && typeof parseInt(params.count) === 'number' ?  parseInt(params.count) : 5;
    // Defines excluded properties from result
    const projection = { '_id': 0, '__v': 0, 'features': 0, 'styles': 0};
    let products = await Product.find({id: {$gt: (page - 1) * count}}, projection)
    .limit(count).sort({'id': 1});
    
    return products;
}


const fetchProductData = async id => {
    let product = await Product.find({ id }, { "_id": false, "__v": false });

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



module.exports = {
    fetchProducts,
    fetchProductData
}