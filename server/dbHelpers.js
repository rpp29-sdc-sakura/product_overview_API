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
    result = result.map(product => {
        delete product.dataValues.createdAt;
        delete product.dataValues.updatedAt;
        return product.dataValues
     });
    return result;
}

module.exports = {
    fetchProducts
}