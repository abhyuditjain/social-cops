/*jshint esversion: 6 */
'use strict';

class MyError extends Error {
    constructor(name, statusCode, message) {
        super(message);
        this.message = message;
        this.name = name;
        this.statusCode = statusCode;
    }
}

function _200(message = "Failure") {
    return new MyError("SuccessError", 200, message);
}

function _400(message = "Bad Request") {
    return new MyError("BadRequestError", 400, message);
}

function _401(message = "Unauthorized") {
    return new MyError("UnauthorizedError", 401, message);
}

function _402(message = "Payment Required") {
    return new MyError("PaymentRequiredError", 402, message);
}

function _403(message = "Forbidden") {
    return new MyError("ForbiddenError", 403, message);
}

function _404(message = "Not Found") {
    return new MyError("NotFoundError", 404, message);
}

function _409(message = "Conflict") {
    return new MyError("ConflictError", 409, message);
}

function _429(message = "Too Many Requests") {
    return new MyError("TooManyRequestsError", 429, message);
}

function _500(message = "Internal Server Error") {
    return new MyError("InternalServerError", 500, message);
}

module.exports = {
    _200: _200,
    _400: _400,
    _401: _401,
    _402: _402,
    _403: _403,
    _404: _404,
    _409: _409,
    _429: _429,
    _500: _500
};