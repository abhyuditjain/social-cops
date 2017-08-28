/*jshint esversion: 6 */
'use strict';

const Bluebird = require("bluebird");
const error = require("../utils/error");
const moment = require("moment");
const authMiddleware = require('../middleware/authMiddleware');
const authUtil = require('../utils/auth');
const jsonPatch = require('fast-json-patch');
const fs = Bluebird.promisifyAll(require("fs"));
const validations = require('../utils/validations');
const requestAsync = require("request-promise");
const imageUtil = require("../utils/imageUtil");

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

const resize = function (reqBody) {
    return Bluebird.try(() => {
        if (!validations.postResizeValidate(reqBody)) {
            throw validations.constructError(validations.postResizeValidate.errors);
        }

        const options = {
            method: "HEAD",
            uri: reqBody.imageUrl
        };

        return requestAsync(options);
    }).then((headers) => {
        console.log(headers);
        //Limit to files <= 10mb
        if (headers['content-length'] > 10485760) {
            throw error._400("Image size exceeded the max allowed size of 10mb");
        }

        return imageUtil.resizeImage(reqBody.imageUrl).catch((err) => {
            throw err;
        });
    }).then((result) => {
        return result;
    });
};

module.exports = {
    login: login,
    patch: patch,
    resize: resize
};