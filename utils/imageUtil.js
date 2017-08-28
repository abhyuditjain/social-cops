/*jshint esversion: 6 */
"use strict";

const Bluebird = require("bluebird");
const crypto = require("crypto");
const error = require("../utils/error");
const fileType = require("file-type");
const requestAsync = require("request-promise");
const fs = Bluebird.promisifyAll(require("fs"));
const sharp = require("sharp");
const mime = require("mime-types");

const generateName = function () {
    return crypto.randomBytes(10).toString("hex");
};

const getFileType = function (buffer) {
    const type = fileType(buffer).ext;

    // right now allowing only png and jpg, sharp however allows svg also
    return ((type === "jpg" || type === "png") ? type : null);
};

const resizeImage = function (imageUrl, width = 50, height = 50) {
    return Bluebird.try(() => {
        //Generate random filename
        let filename = generateName();
        let outfilename = filename + "50x50";
        let filepath = "./pics/";
        let outfilepath = "./pics/thumbnails/";

        const options = {
            method: "GET",
            uri: imageUrl,
            encoding: null
        };

        return Bluebird.try(() => {
            return requestAsync(options);
        }).then((buffer) => {
            // get filetype to match against allowed types.
            const type = getFileType(buffer);

            if (!type) {
                throw error._400("Invalid file type");
            }

            filename += ("." + type);
            outfilename += ("." + type);

            console.log(filename);

            // writing file before resizing
            return fs.writeFileAsync(`${filepath}${filename}`, buffer);
        }).then(() => {
            // reading the file
            return fs.readFileAsync(`${filepath}${filename}`);
        }).then((buffer) => {
            // resizing and writing it to thumbnails
            return sharp(buffer).resize(width, height).toFile(`${outfilepath}${outfilename}`);
        }).then((data) => {
            const result = {};

            // returning file path
            result.filename = `${outfilepath}${outfilename}`;
            result.size = data.size;
            result.mime = mime.lookup(`${outfilepath}${outfilename}`);

            return result;
        });
    });
};

module.exports = {
    resizeImage: resizeImage
};