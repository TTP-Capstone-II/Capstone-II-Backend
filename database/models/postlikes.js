const { DataTypes } = require('sequelize');
const db = require('../db');

const Postlikes = db.define("Postlikes", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
},
  {
    timestamps: false,
    tableName: "postlikes",
    freezeTableName: true,
});

module.exports = Postlikes;