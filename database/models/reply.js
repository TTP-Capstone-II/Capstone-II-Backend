const { DataTypes } = require('sequelize');
const db = require('../db');

const Reply = db.define('reply', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    threadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Reply;