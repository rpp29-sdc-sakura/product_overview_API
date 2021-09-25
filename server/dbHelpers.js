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
    return result;
}

const fetchProduct = async id => {
    let product = await models.Product.findAll({
        where: { id },
        include: [
            {
                model: models.Feature,
                attributes: ['feature', 'value'],
                where: {}
            }
        ]
    });
    return product[0];
}

const fetchProductStyles = async id => {
    let styles = { product_id: id }
    styles.results = await models.Style.findAll({
        where: { productId: id },
        attributes: [['id', 'style_id'], 'name', 'original_price', 'sale_price', ['default_style', 'default?']],
        include: [
            {
                model: models.Photo,
                where: {},
                attributes: ['thumbnail_url', 'url']
            },
            {
                model: models.SKU,
                where: {},
                attributes: ['id', 'quantity', 'size']
            }
        ]
    });

    // Reformats SKUs property
    styles.results = styles.results.map(style => style.get({ plain: true }))
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