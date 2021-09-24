const { productOverviewDB, models } = require('../database/postgres.js');
const { Op } = require('sequelize')

const fetchProducts = async params => {
    const page = params.page ? params.page : 1;
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
        where: {
            id: id
        }
    });
    product = product[0].dataValues
    let features = await models.Feature.findAll({
        where: {
            product_id: id
        }
    });
    product.features = features.map(feature => {
        return { 
            feature: feature.dataValues.feature,
            value:  feature.dataValues.value
        };
    })
    return product;
}



module.exports = {
    fetchProducts,
    fetchProduct
}