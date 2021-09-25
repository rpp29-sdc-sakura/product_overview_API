const { productOverviewDB, models } = require('../database/postgres.js');
const { Op } = require('sequelize');
const style = require('../database/pgModels/style.js');

const fetchProducts = async params => {
    // Selects the page of results to return. Default 1.
    const page = params.page ? params.page : 1;
    // Specifies how many results per page to return. Default 5.
    const count = params.count ?  params.count : 5;
    let result = await models.Product.findAll({
        limit: count,
        order: [
            ['id', 'ASC']
        ],
        where: {
            id: {
                [Op.gt]: (page - 1) * count
            }
        }
    });
    result = result.map(product => product.dataValues);
    return result;
}

const fetchProduct = async id => {
    let product = await models.Product.findAll({
        where: { id }
    });
    product = product[0].dataValues
    let features = await models.Feature.findAll({
        where: { product_id: id }
    });
    product.features = features.map(feature => {
        return { 
            feature: feature.dataValues.feature,
            value:  feature.dataValues.value
        };
    })
    return product;
}

const fetchProductStyles = async id => {
    let styles = { product_id: id }
    styles.results = await models.Style.findAll({
        where: { productId: id },
        include: [
            {
                model: models.Photo,
                where: {}
            },
            {
                model: models.SKU,
                where: {}
            }
        ]
    })

    // Reformats individual style and photo results 
    styles.results = styles.results.map(style => {
        style = style.get({ plain: true });
        return {
            style_id: style.id,
            name: style.name,
            original_price: style['original_price'],
            sale_price: style['sale_price'],
            'default?':  style['default_style'],
            photos: style.photos.map(photo => {
                return {
                    thumbnail_url: photo['thumbnail_url'],
                    url: photo['url'],
                }
            }),
            skus: style.skus
        }
    });

    // Reformats SKUs property
    styles.results.forEach(style => {
        const skus = {};
        style.skus.forEach(sku => {
            skus[sku.id] = {
                quantity: sku.quantity,
                size: sku.size
            }
        });
        style.skus = skus;
    })
    
    return styles;
}



module.exports = {
    fetchProducts,
    fetchProduct,
    fetchProductStyles
}