'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gabs = sequelize.define('Gabs', {
    user: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter a username.'
        }
      }
    },
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter a gab.'
        },
        max: 140
      }
    },
    publishedAt: DataTypes.DATE,
    likes: DataTypes.ARRAY(DataTypes.STRING) // this may not work... but let's try it. Hoping to have an array of users who liked the gab.
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Gabs;
};
