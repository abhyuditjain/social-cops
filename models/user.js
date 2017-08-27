/*jshint esversion: 6 */
'use strict';

const Promise = require('bluebird');


const verifyUser = function (username, password) {
    return Promise.try(function () {
        // Run db query to verify user
        // As of now, I am returning true for all username and password pairs

        return true;
    });
};

module.exports = {
    verifyUser: verifyUser
};