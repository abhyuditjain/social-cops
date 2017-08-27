/*jshint esversion: 6 */
'use strict';

module.exports = function () {
    return {
        APP: {
            PORT: process.env.PORT,
        },
        JWT: {
            SECRET: process.env.JWT_SECRET,
            ALGORITHM: "HS512",
            ISSUER: "SocialCops"
        }
    };
};