const Sequelize  =  require("sequelize");

const product = (sequelize, DataTypes) => {
    
    const Product = sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        name: DataTypes.STRING,
        slogan: DataTypes.STRING,
        description: DataTypes.STRING(1000),
        category: DataTypes.STRING,
        default_price: DataTypes.INTEGER,
    });

    Product.associate = models => {
        Product.hasMany(models.Style, { onDelete: 'CASCADE', foreignKey: 'productId', sourceKey: 'id'});
        Product.hasMany(models.Feature, { onDelete: 'CASCADE', foreignKey: 'product_id', sourceKey: 'id' });
    }
    
    return Product;
}


//export default product;

module.exports = product;