/*jshint esversion: 6 */
'use strict';

const Bluebird = require('bluebird');
const jwt = Bluebird.promisifyAll(require('jsonwebtoken'));
const User = require('../models/user');
const config = require('../config')();
const error = require('./error');

const authenticate = function (username, password) {
    return Bluebird.try(() => {
        return User.verifyUser(username, password);
    }).then((result) => {
        if (!result) {
            throw error._401("Wrong username/password");
        }

        return generateToken(username);
    }).then((token) => {
        return token;
    });
};

const generateToken = function (username, expiresIn = '1h', role = 'user') {
    return Bluebird.try(() => {
        const payload = {
            issuedFor: username,
            role: role
        };

        const OPTIONS = {
            algorithm: config.JWT.ALGORITHM,
            issuer: config.JWT.ISSUER,
            expiresIn: expiresIn
        };

        return jwt.signAsync(payload, config.JWT.SECRET, OPTIONS);
    });
};

module.exports = {
    authenticate: authenticate
};