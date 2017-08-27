/*jshint esversion: 6 */
'use strict';

const postLoginSchema = {
    "type" : "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 1,
            "maxLength": 300
        },
        "password": {
            "type": "string",
            "minLength": 1,
            "maxLength": 300
        }
    },
    "additionalProperties": false,
    "required": ["username", "password"]
};


module.exports = {
    postLoginSchema: postLoginSchema
};