/*jshint esversion: 6 */
'use strict';

module.exports = function () {
    return {
        APP: {
            PORT: process.env.PORT || 8080,
        },
        JWT: {
            SECRET: process.env.JWT_SECRET || "secret",
            ALGORITHM: "HS512",
            ISSUER: "SocialCops"
        }
    };
};