const Product = require('../../database/mongo.js');
const range = require('just-range');

// Function takes page and count params, then returns array of product data objs
// excludes features and styles product data
const fetchProducts = async params => {
    // Selects the page of results to return. Default 1.
    params.page = params.page ?  parseInt(params.page) : 1;
    // Specifies how many results per page to return. Default 5.
    params.count = params.count ?  parseInt(params.count) : 5;
    // Defines excluded properties from result
    const projection = { '_id': false, '__v': false, 'features': false, 'styles': false};
    const cacheKey = `.${range((params.page * params.count) - (params.count - 1), (params.page * params.count) +1 ).join('.')}.`;
    let products = await Product.find({id: {$gt: (params.page - 1) * params.count}}, projection)
    .limit(params.count).sort({'id': 1}).lean().cache({key: cacheKey});
    
    return products;
}

// Function takes a productId, then returns a product obj
const fetchProduct = async id => {
    let product = await Product.find({ id }, { "_id": false, "__v": false }).lean().cache({ key: `.${id}.` });

    if (product.length > 0) {
        product = product[0]

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

// Function takes productId and update obj, then updates specified product in collection
const updateProduct = async (id, update) => {

    const objProperties = {
        features: true,
        styles: true,
        photos: true,
        skus: true
    }

    for (var property in update) {
        if (objProperties[property]) {
            update[property] = JSON.parse(update[property]);
        }
    }

    const result = await Product.findOneAndUpdate({ id }, update, { new: true, projection: { "_id": false, "__v": false }})
    .then(result => {
        return result;
    })
    .catch(err => {
        return err;
    })

    return result;
}


module.exports = {
    fetchProducts,
    fetchProduct,
    updateProduct
}