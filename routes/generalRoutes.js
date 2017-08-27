/*jshint esversion: 6 */
'use strict';

const Bluebird = require("bluebird");
const router = require("express-promise-router")();
const error = require("../utils/error");
const GeneralController = require("../controllers/generalController");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;
