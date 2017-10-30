/**
 * Iconographer library
 * @module Iconographer
 */

const Iconographer = require("./Iconographer.js");
const { getIconographerInstance, getIconForURL, setIconographerInstance } = require("./helpers.js");
const { setDataFetcher, setTextFetcher } = require("./fetch.js");
const StorageInterface = require("./StorageInterface.js");
const MemoryStorageInterface = require("./MemoryStorageInterface.js");

module.exports = {
    getIconographerInstance,
    getIconForURL,
    Iconographer,
    MemoryStorageInterface,
    setDataFetcher,
    setIconographerInstance,
    setTextFetcher,
    StorageInterface
};
