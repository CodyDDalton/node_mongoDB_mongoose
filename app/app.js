const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const albumRoutes = require("../api/routes/albumRoutes");
const artistRoutes = require("../api/routes/artistRoutes");


//middleware for logging
app.use(morgan("dev"));

//parsing middleware
app.use(express.urlencoded({
    extended: true
}));
//middleware JSON
app.use(express.json());

app.use("/album", albumRoutes);
app.use("/artist", artistRoutes);

//middleware to handle CORS policy
app.use((req,res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Acess-Control-Allow-Methods", "POST, PUT, GET, PATCH, DELETE");
    }
    next();
});

//error handling
app.use((res, req, next) => {
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
});

app.use((error, res) => {
    res.status(error.status || 500).json({
        error:{
            message: error.message,
            status: error.status,
        }
    })
});

//connect to MongoDb
mongoose.connect(process.env.mongoDbURL, (err) => {
    if (err) {
        console.error("Error: ", err.message);
    }
    else{
        console.log("MongoDb connection was successful!");
    }
});

module.exports = app;
