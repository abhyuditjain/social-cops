/*jshint esversion: 6 */
"use strict";

require("dotenv").config();
const config = require("./config")();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const methodOverride = require("method-override");
const routes = require("./routes/generalRoutes");
const fs = require("fs");

const app = express();

if (!fs.existsSync("./pics")) {
    fs.mkdirSync("pics");
}

if (!fs.existsSync("./pics/thumbnails")) {
    fs.mkdirSync("./pics/thumbnails");
}

const port = normalizePort(config.APP.PORT || "8080");

// Enable helmet (headers)
app.use(helmet());
app.use(helmet.noCache());

// Enable cors
app.use(cors());
// Enable cors for verbs other than GET/HEAD/POST
app.options("*", cors());

// log
app.use(morgan("dev"));

// json request parser
app.use(bodyParser.json({limit: "10mb"}));

// Other verbs (PUT and DELETE)
app.use(methodOverride());

app.use('/static', express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    return res.json({
        success: true,
        data: {
            message: "Welcome to the API"
        }
    });
});

app.get('/docs', function (req, res) {
    return res.sendFile(__dirname + "/public/index.html");
});

app.use("/api", routes);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

app.use(function (err, req, res, next) {
    // res.status(err.status || 500);

    return res.status(err.statusCode || 500).json({
        reason: err.statusCode === 500 ? "Something went wrong" : err.message,
        success: false
    });
});

app.listen(port, function () {
    console.log("App running on port: " + port);
});