const style = (sequelize, DataTypes) => {
    const Style = sequelize.define('style',     {
        name: DataTypes.STRING,
        original_price: DataTypes.INTEGER,
        sale_price: DataTypes.INTEGER,
        default: DataTypes.BOOLEAN,
    });

    Style.associate = models => {
        Style.belongsTo(models.Product);
        Style.hasMany(models.SKU, { onDelete: 'CASCADE' });
        Style.hasMany(models.Photo, { onDelete: 'CASCADE' });
    };

    return Style;
}

module.exports = style;