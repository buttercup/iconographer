/**
 * Iconographer library
 * @module Iconographer
 */

const Iconographer = require("./Iconographer.js");
const { getIconForURL } = require("./helpers.js");
const { setDataFetcher, setTextFetcher } = require("./fetch.js");

module.exports = {
    getIconForURL,
    Iconographer,
    setDataFetcher,
    setTextFetcher
};
