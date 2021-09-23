const sku = (sequelize, DataTypes) => {
    const SKU = sequelize.define('sku', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        size: DataTypes.STRING,
        quantity: DataTypes.STRING
    });

    SKU.associate = models => {
        //SKU.belongsTo(models.Style, {foreignKey: 'styleId', targetKey: 'id'});
    }

    return SKU;
}

module.exports = sku;