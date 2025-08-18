const { DataTypes } = require("sequelize");
const db = require("../db");

const Simulation = db.define("Simulation", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  forumTitle: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  topic: {
    type: DataTypes.TEXT,
    allowNull:false
  },
  storedValues: {
    type: DataTypes.TEXT,
    allowNull:false,
  },
});

module.exports = Simulation;