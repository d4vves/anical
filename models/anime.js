'use strict';
module.exports = (sequelize, DataTypes) => {
  const anime = sequelize.define('anime', {
    name: DataTypes.STRING,
    date: DataTypes.STRING,
    imageurl: DataTypes.STRING,
    malId: DataTypes.INTEGER
  }, {});
  anime.associate = function(models) {
    models.anime.belongsToMany(models.user, {through: 'usersAnimes'})
  };
  return anime;
};