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

const patchSchema = {
    "type": "object",
    "properties": {
        "document": {
            "type": "object"
        },
        "patches": {
            "type": "array",
            "items": {
                "type": "object"
            },
            "minItems": 1
        }
    },
    "additionalProperties": false,
    "required": ["document", "patches"]
};

const postResizeSchema = {
    "type": "object",
    "properties": {
        "imageUrl": {
            "type": "string",
            "format": "uri"
        }
    },
    "additionalProperties": false,
    "required": ["imageUrl"]
};

module.exports = {
    postLoginSchema: postLoginSchema,
    patchSchema: patchSchema,
    postResizeSchema: postResizeSchema
};