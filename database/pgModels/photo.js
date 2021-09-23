const photo = (sequelize, DataTypes) => {
    const Photo = sequelize.define('photo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        thumbnail_url: DataTypes.STRING,
        url: DataTypes.STRING
    });

    Photo.associate = models => {
        //Photo.belongsTo(models.Style, {foreignKey: 'styleId', targetKey: 'id'})
    }

    return Photo;
}

module.exports = photo;