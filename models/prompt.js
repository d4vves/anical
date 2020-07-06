'use strict';
module.exports = (sequelize, DataTypes) => {
  const prompt = sequelize.define('prompt', {
    text: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    characterId: DataTypes.INTEGER
  }, {});
  prompt.associate = function(models) {
    models.prompt.belongsTo(models.user)
    models.prompt.belongsTo(models.character)
  };
  return prompt;
};