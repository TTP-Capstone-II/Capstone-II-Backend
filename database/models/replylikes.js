const { DataTypes } = require("sequelize");
const db = require("../db");

const Replylikes = db.define("Replylikes", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  replyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
},
  {
    timestamps: false,
    tableName: "replylikes",
    freezeTableName: true,
});

module.exports = Replylikes;
