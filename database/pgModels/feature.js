const feature = (sequelize, DataTypes) => {
    const Feature = sequelize.define('feature', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        feature: DataTypes.STRING,
        value: DataTypes.STRING
    });

    Feature.associate = models => {
        Feature.belongsTo(models.Product, {foreignKey: 'product_id', targetKey: 'id'});
    }

    return Feature;
}

module.exports = feature;