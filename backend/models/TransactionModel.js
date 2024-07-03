import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Transactions = db.define('transaction', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
});

Products.hasMany(Transactions, { foreignKey: 'productId' });
Transactions.belongsTo(Products, { foreignKey: 'productId' });

Users.hasMany(Transactions, { foreignKey: 'userId' });
Transactions.belongsTo(Users, { foreignKey: 'userId' });

export default Transactions;
