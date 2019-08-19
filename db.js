const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false
    }
);

// Models
const Job = require("./models/Job")(sequelize, Sequelize);

let isConnected = false;
let Models = {
    Job,
};


/**
 * Creating Associations
 */
Object.keys(Models).forEach(function (modelName) {
    if (Models[modelName].associate) {
        Models[modelName].associate(Models);
    }
});

module.exports = async () => {
    if (isConnected) {
        console.log("use existing connection");
        return Models;
    }

    await sequelize.sync()
    await sequelize.authenticate();
    isConnected = true;
    console.log("use new connection");
    return Models;
};

