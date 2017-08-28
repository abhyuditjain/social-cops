/*jshint esversion: 6 */
'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const app = require('../app');
const auth = require("../utils/auth");

chai.use(require('chai-http'));

describe('General API Routes /api', function () {
    this.timeout(0);

    describe("Login tests", function () {
        // Success test
        it('should return an access token on success', function () {
            return chai.request(app)
                .post("/api/login")
                .send({
                    "username": "abhyudit",
                    "password": "tiduyhba"
                }).then((res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an("object");
                    expect(res.body.success).to.equal(true);
                    expect(res.body.data).to.be.an("object");
                });
        });

        // bad request - username is missing
        it('should send Bad Request (400) if username is missing', function () {
            return chai.request(app)
                .post("/api/login")
                .send({
                    "password": "tiduyhba"
                }).then((res) => {
                    throw new Error("Missing username");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - password is missing
        it('should send Bad Request (400) if password is missing', function () {
            return chai.request(app)
                .post("/api/login")
                .send({
                    "username": "abhyudit"
                }).then((res) => {
                    throw new Error("Missing password");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - empty object
        it('should send Bad Request (400) if both username and password are missing', function () {
            return chai.request(app)
                .post("/api/login")
                .send({})
                .then((res) => {
                    throw new Error("Missing username and password");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - username is not a string
        it('should send Bad Request (400) if username is not a string', function () {
            return chai.request(app)
                .post("/api/login")
                .send({
                    "username": {},
                    "password": "asdasdas"
                }).then((res) => {
                    throw new Error("username not a string");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - password is not a string
        it('should send Bad Request (400) if password is not a string', function () {
            return chai.request(app)
                .post("/api/login")
                .send({
                    "username": "asdasdas",
                    "password": []
                }).then((res) => {
                    throw new Error("password not a string");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });
    });
    describe("JSON patch tests", function () {
        let token = null;

        before(function () {
            return auth.authenticate("asd", "asd").then((at) => {
                token = at;
            });
        });
        // Success test
        it('should return a new document when correct data is sent', function () {
            return chai.request(app)
                .patch("/api/patch")
                .set("Authorization", token)
                .send({
                    "document": {},
                    "patches": [
                        {"op": "add", "path": "/test", "value": 123}
                    ]
                }).then((res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an("object");
                    expect(res.body.success).to.equal(true);
                    expect(res.body.data).to.be.an("object");
                    expect(res.body.data.test).to.equal(123);
                });
        });

        // bad request - patches is not an array
        it('should send Bad Request (400) if patches is not an array', function () {
            return chai.request(app)
                .patch("/api/patch")
                .set("Authorization", token)
                .send({
                    "document": {},
                    "patches": {"op": "add", "path": "/test", "value": 123}
                }).then((res) => {
                    throw new Error("Patches is not an array");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - patches don't contain valid operations
        it('should send Bad Request (400) if invalid patch operations are sent', function () {
            return chai.request(app)
                .patch("/api/patch")
                .set("Authorization", token)
                .send({
                    "document": {},
                    "patches": [
                        {"op": "replace", "path": "/test", "value": 123}
                    ]
                }).then((res) => {
                    throw new Error("invalid operations");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // Unauthorized - token not sent
        it('should send Unauthorized (401) if no token is sent', function () {
            return chai.request(app)
                .patch("/api/patch")
                // .set("Authorization", token)
                .send({
                    "document": {},
                    "patches": [
                        {"op": "add", "path": "/test", "value": 123}
                    ]
                }).then((res) => {
                    throw new Error("No token sent");
                }).catch((err) => {
                    expect(err).to.have.status(401);
                });
        });

        // Unauthorized - valid token not sent
        it('should send Unauthorized (401) if invalid token is sent', function () {
            return chai.request(app)
                .patch("/api/patch")
                .set("Authorization", "asd" + token)
                .send({
                    "document": {},
                    "patches": [
                        {"op": "add", "path": "/test", "value": 123}
                    ]
                }).then((res) => {
                    throw new Error("Invalid token sent");
                }).catch((err) => {
                    console.log("ASDASDASDAS");
                    console.log(err);
                    expect(err).to.have.status(401);
                });
        });
    });
    describe("Thumbnail tests", function () {
        let token = null;

        const validPNG = "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";
        const validJPG = "https://upload.wikimedia.org/wikipedia/commons/e/e0/JPEG_example_JPG_RIP_050.jpg";
        const tooLarge = "http://files.cadlink.fr/RandomControl/Arion/arion_12000x9000.jpg";
        const filetypeNotAllowed = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif";

        before(function () {
            return auth.authenticate("asd", "asd").then((at) => {
                token = at;
            });
        });

        // Success test PNG
        it('should return a thumbnail if url is a png', function () {
            this.timeout(0);
            return chai.request(app)
                .get("/api/thumbnail?imageUrl=" + validPNG)
                .set("Authorization", token)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.headers['content-type']).to.equal("image/png");
                });
        });

        // Success test JPG
        it('should return a thumbnail if url is a jpg', function () {
            this.timeout(0);
            return chai.request(app)
                .get("/api/thumbnail?imageUrl=" + validJPG)
                .set("Authorization", token)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.headers['content-type']).to.equal("image/jpeg");
                });
        });

        // bad request - no url is sent
        it('should send Bad Request (400) if no imageUrl is sent', function () {
            return chai.request(app)
                .get("/api/thumbnail")
                .set("Authorization", token)
                .then((res) => {
                    throw new Error("No imageUrl is sent");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - file too large
        it('should send Bad Request (400) if no image is larger than allowed size of 10mb', function () {
            return chai.request(app)
                .get("/api/thumbnail?imageUrl=" + tooLarge)
                .set("Authorization", token)
                .then((res) => {
                    throw new Error("image is too large");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // bad request - filetype not allowed
        it('should send Bad Request (400) if the filetype is not allowed', function () {
            this.timeout(0);
            return chai.request(app)
                .get("/api/thumbnail?imageUrl=" + filetypeNotAllowed)
                .set("Authorization", token)
                .then((res) => {
                    throw new Error("filetype not allowed");
                }).catch((err) => {
                    expect(err).to.have.status(400);
                });
        });

        // Unauthorized - token not sent
        it('should send Unauthorized (401) if token is not sent', function () {
            // this.timeout = 10000;
            return chai.request(app)
                .get("/api/thumbnail?imageUrl=" + validJPG)
                // .set("Authorization", token)
                .then((res) => {
                    throw new Error("token not sent");
                }).catch((err) => {
                    expect(err).to.have.status(401);
                });
        });

        // Unauthorized - valid token not sent
        it('should send Unauthorized (401) if valid token is not sent', function () {
            // this.timeout = 10000;
            return chai.request(app)
                .get("/api/thumbnail?imageUrl=" + validJPG)
                .set("Authorization", "asdasdas" + token)
                .then((res) => {
                    throw new Error("valid token not sent");
                }).catch((err) => {
                    expect(err).to.have.status(401);
                });
        });
    });
});