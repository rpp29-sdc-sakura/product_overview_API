const Sequelize  =  require("sequelize");

const product = (sequelize, DataTypes) => {
    
    const Product = sequelize.define('product', {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        name: DataTypes.STRING,
        slogan: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        default_price: DataTypes.INTEGER,
    });

    Product.associate = models => {
        Product.hasMany(models.Style, { onDelete: 'CASCADE' });
        Product.hasMany(models.Feature, { onDelete: 'CASCADE' });
    }
    
    return Product;
}

//export default product;

module.exports = product;