/*jshint esversion: 6 */
'use strict';

const Bluebird = require("bluebird");
const router = require("express-promise-router")();
const error = require("../utils/error");
const GeneralController = require("../controllers/generalController");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");
const fs = Bluebird.promisifyAll(require("fs"));

router.post("/login", (req, res, next) => {
    return Bluebird.try(() => {
        return GeneralController.login(req.body);
    }).then((data) => {
        return res.status(201).json({
            success: true,
            data: data
        });
    });
});

router.patch("/patch", authMiddleware.verifyToken, (req, res) => {
    return Bluebird.try(() => {
        return GeneralController.patch(req.body);
    }).then((data) => {
        return res.status(201).json({
            success: true,
            data: data
        });
    });
});

router.post("/thumbnail", authMiddleware.verifyToken, (req, res) => {
    return Bluebird.try(() => {
        return GeneralController.resize(req.body);
    }).then((result) => {
        console.log(result);
        return Bluebird.try(() => {
            return fs.readFileAsync(result.filename);
        }).then((data) => {
            res.writeHead(201, {"Content-Type": result.mime, "Content-Length": result.size});
            return res.write(data, "binary");
        });
    });
});

module.exports = router;
