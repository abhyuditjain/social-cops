/*jshint esversion: 6 */
'use strict';

const Bluebird = require("bluebird");
const error = require("../utils/error");
const moment = require("moment");
const authMiddleware = require('../middleware/authMiddleware');
const authUtil = require('../utils/auth');

const validations = require('../utils/validations');

const login = function (reqBody) {
    return Bluebird.try(() => {
        if (!validations.postLoginValidate(reqBody)) {
            throw validations.constructError(validations.postLoginValidate.errors);
        }

        return authUtil.authenticate(reqBody.username, reqBody.password);
    }).then((accessToken) => {
        return {accessToken: accessToken};
    });
};


module.exports = {
    login: login
};