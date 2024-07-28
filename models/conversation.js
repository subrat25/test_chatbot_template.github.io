const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
    sessionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    botId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    agentSource: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    inputText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    outputText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    contextVariables: {
        type: DataTypes.JSON,
        allowNull: true
    },
    timeOfMessage: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

module.exports = Conversation;
