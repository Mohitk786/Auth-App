const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();

const corsOptions = {
    origin: 'http://localhost:5000/',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json());

require("./config/database").connect();
const authApp = require("./routes/auth");
app.use("/authApp",authApp);


app.listen(process.env.PORT, ()=>{
    console.log(`Server started on Port ${process.env.PORT}`)
});

app.get("/", (req, res) => {
    res.send("<h1>this is auth App </h1>"); 
})