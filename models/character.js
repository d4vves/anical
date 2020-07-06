'use strict';
module.exports = (sequelize, DataTypes) => {
  const character = sequelize.define('character', {
    name: DataTypes.STRING,
    imageurl: DataTypes.STRING
  }, {});
  character.associate = function(models) {
    models.character.hasMany(models.prompt)
  };
  return character;
};