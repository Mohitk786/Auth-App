const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")

const app = express();
require("dotenv").config();

const corsOptions = {
    origin: '*',  //we can change it later for our domain
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(cookieParser())
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