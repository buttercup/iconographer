/**
 * Iconographer library
 * @module Iconographer
 */

const Iconographer = require("./Iconographer.js");
const { getIconographerInstance, getIconForURL, setIconographerInstance } = require("./helpers.js");
const { setDataFetcher, setTextFetcher } = require("./fetch.js");

module.exports = {
    getIconographerInstance,
    getIconForURL,
    Iconographer,
    setDataFetcher,
    setIconographerInstance,
    setTextFetcher
};
