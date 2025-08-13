require("dotenv").config();
const express = require("express");
const citiesRouter = require("./routes/cities");

const app = express();
app.use(express.json());

app.use("/cities", citiesRouter);

module.exports = app;
