const Sequelize = require("sequelize");
require('pg');
const UserModel = require("./model/user");
const apm = require("./pkg/apm");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);
const User = UserModel(sequelize, Sequelize);
const Models = { User };
const connection = {};

// Models { User } 
module.exports = async () => {
    // open start span shold on function
    const span = apm.startSpan("database connections", "repository-db");
    try {
        if (connection.isConnected) {
            span.end();
            return Models;
        }
        await sequelize.sync();
        await sequelize.authenticate();
        connection.isConnected = true;
        span.end();
    } catch (e) {
        apm.captureError(e);
        span.end(); // End the span before throwing the error

        // Rethrow the error after it's been captured by APM
        throw e;
    }finally {
        if (span) span.end();
    }
    return Models;
};
