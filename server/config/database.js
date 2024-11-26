const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("DB connected Successfuly"))
    .catch((err)=> {
        console.log("DB connection Failed");
        console.error(err.message);
        process.exit(1);
    })
}