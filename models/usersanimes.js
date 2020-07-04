'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersAnimes = sequelize.define('usersAnimes', {
    userId: DataTypes.INTEGER,
    animeId: DataTypes.INTEGER
  }, {});
  usersAnimes.associate = function(models) {
    // associations can be defined here
  };
  return usersAnimes;
};