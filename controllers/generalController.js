/*jshint esversion: 6 */
'use strict';

const Bluebird = require("bluebird");
const error = require("../utils/error");
const moment = require("moment");
const authMiddleware = require('../middleware/authMiddleware');
const authUtil = require('../utils/auth');
const jsonPatch = require('fast-json-patch');

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


const patch = function (reqBody) {
    return Bluebird.try(() => {
        if (!validations.patchValidate(reqBody)) {
            throw validations.constructError(validations.patchValidate.errors);
        }
        let patched = null;
        try {
            patched = jsonPatch.applyPatch(jsonPatch.deepClone(reqBody.document), reqBody.patches, true);
        } catch (e) {
            throw error._400("Invalid patch request");
        }

        return patched.newDocument;
    });
};

module.exports = {
    login: login,
    patch: patch
};