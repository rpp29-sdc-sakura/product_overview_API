const photo = (sequelize, DataTypes) => {
    const Photo = sequelize.define('photo', {
        thumbnail_url: DataTypes.STRING,
        url: DataTypes.STRING
    });

    Photo.associate = models => {
        Photo.belongsTo(models.Style)
    }

    return Photo;
}

module.exports = photo;