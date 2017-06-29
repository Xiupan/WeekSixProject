'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gabs = sequelize.define('Gabs', {
    user: DataTypes.STRING,
    text: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Gabs;
};