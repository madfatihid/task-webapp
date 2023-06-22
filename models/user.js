const { sequelize } = require('../db');
const { Sequelize } = require('sequelize');

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9a-zA-Z]{3,32}$/i
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true,
        unique: true,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
},
    {
        timestamps: true,
    });


module.exports = { User }