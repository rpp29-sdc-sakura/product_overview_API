const style = (sequelize, DataTypes) => {
    const Style = sequelize.define('style',     {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        name: DataTypes.STRING,
        original_price: DataTypes.INTEGER,
        sale_price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        default_style: DataTypes.BOOLEAN,
    });

    Style.associate = models => {
        Style.belongsTo(models.Product, {foreignKey: 'productId', targetKey: 'id'});
        Style.hasMany(models.SKU, { onDelete: 'CASCADE', foreignKey: 'styleId', sourceKey: 'id'});
        Style.hasMany(models.Photo, { onDelete: 'CASCADE', foreignKey: 'styleId', sourceKey: 'id'});
    };

    return Style;
}

module.exports = style;