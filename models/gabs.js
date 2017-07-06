'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gabs = sequelize.define('Gabs', {
    userId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    publishedAt: DataTypes.DATE,
    likes: DataTypes.ARRAY(DataTypes.STRING),
    likeButtonBool: DataTypes.BOOLEAN,
    deleteButtonBool: DataTypes.BOOLEAN
  });

  Gabs.associate = function(models){
    Gabs.belongsTo(models.Users, {as: 'userAlias', foreignKey: 'userId'}) // for some reason, you need the 'as' thingy in order to properly call an attribute or key in the mustache file
  }

  return Gabs;
};
