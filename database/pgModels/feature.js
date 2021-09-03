const feature = (sequelize, DataTypes) => {
    const Feature = sequelize.define('feature', {
        feature: DataTypes.STRING,
        value: DataTypes.STRING
    });

    Feature.associate = models => {
        Feature.belongsTo(models.Product);
    }

    return Feature;
}

module.exports = feature;