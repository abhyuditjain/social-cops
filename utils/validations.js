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
    console.log(err);
    const dataPath = err.dataPath;

    const errMessage = dataPath.replace(".", "") + " " + err.message;
    //
    // console.log(errMessage);

    return error._400(errMessage);
};

// Schemas
const postLoginSchema = GeneralSchemas.postLoginSchema;
const patchSchema = GeneralSchemas.patchSchema;

// Validations from schemas
const postLoginValidate = ajv.compile(postLoginSchema);
const patchValidate = ajv.compile(patchSchema);

module.exports = {
    constructError: constructError,
    postLoginValidate: postLoginValidate,
    patchValidate: patchValidate
};