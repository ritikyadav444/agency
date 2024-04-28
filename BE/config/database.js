const mongoose = require("mongoose");
const dotenv = require("dotenv").config()
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then(

        (data) => {
            console.log(`Mongodb connected server:${data.connection.host}`);

        });
};
module.exports = connectDatabase