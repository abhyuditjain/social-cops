/*jshint esversion: 6 */
'use strict';

// const Trade = require("../models/trade");
const error = require("../utils/error");
const Bluebird = require("bluebird");
const jwt = Bluebird.promisifyAll(require('jsonwebtoken'));
const config = require('../config')();

const verifyToken = function (req, res, next) {
    return Bluebird.try(() => {
        if (!req.headers.authorization) {
            throw error._401("Unauthorized");
        }

        return jwt.verifyAsync(req.headers.authorization, config.JWT.SECRET).catch((err) => {
            // console.log(err);
            throw error._401("Token invalid/expired");
        });
    }).then((decoded) => {
        req.user = decoded.issuedFor;

        return next();
    });
};

module.exports = {
    verifyToken: verifyToken
};