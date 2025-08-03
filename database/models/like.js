const { DataTypes } = require('sequelize');
const db = require('../db');

const Like = db.define('like', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    threadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Like;