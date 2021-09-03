const sku = (sequelize, DataTypes) => {
    const SKU = sequelize.define('sku', {
        size: DataTypes.STRING,
        quantity: DataTypes.STRING
    });

    SKU.associate = models => {
        SKU.belongsTo(models.Style);
    }

    return SKU;
}

module.exports = sku;