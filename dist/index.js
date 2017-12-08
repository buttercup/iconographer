"use strict";

/**
 * Iconographer library
 * @module Iconographer
 */

var Iconographer = require("./Iconographer.js");

var _require = require("./helpers.js"),
    getIconographerInstance = _require.getIconographerInstance,
    getIconForURL = _require.getIconForURL,
    setIconographerInstance = _require.setIconographerInstance;

var _require2 = require("./fetch.js"),
    setDataFetcher = _require2.setDataFetcher,
    setTextFetcher = _require2.setTextFetcher;

var StorageInterface = require("./StorageInterface.js");
var MemoryStorageInterface = require("./MemoryStorageInterface.js");

module.exports = {
    getIconographerInstance: getIconographerInstance,
    getIconForURL: getIconForURL,
    Iconographer: Iconographer,
    MemoryStorageInterface: MemoryStorageInterface,
    setDataFetcher: setDataFetcher,
    setIconographerInstance: setIconographerInstance,
    setTextFetcher: setTextFetcher,
    StorageInterface: StorageInterface
};