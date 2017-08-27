/*jshint esversion: 6 */
'use strict';

const Ajv = require('ajv');
const error = require('./error');

const ajv = new Ajv({
    coerceTypes: true,
    format: 'full',
    verbose: true
});

const GeneralSchemas = require('../models/schemas/generalSchemas');

// Error constructing helper
const constructError = function (errors) {
    const err = errors[0];
    const errMessage = err.message;
    //
    // console.log(errMessage);

    return error._400(errMessage);
};

const postLoginSchema = GeneralSchemas.postLoginSchema;
const postLoginValidate = ajv.compile(postLoginSchema);

module.exports = {
    constructError: constructError,
    postLoginValidate: postLoginValidate
};