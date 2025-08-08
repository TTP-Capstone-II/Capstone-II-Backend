const { DataTypes } = require("sequelize");
const db = require("../db");

const Simulation = db.define("Simulation", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  forumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  storedValues: {
    type: DataTypes.TEXT,
    allownull:false,
  },
});

module.exports = Simulation;