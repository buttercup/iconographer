"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StorageInterface = require("./StorageInterface.js");

/**
 * Icon storage interface for in-memory storage of icons
 * @see StorageInterface
 * @augments StorageInterface
 */

var MemoryStorageInterface = function (_StorageInterface) {
    _inherits(MemoryStorageInterface, _StorageInterface);

    function MemoryStorageInterface() {
        _classCallCheck(this, MemoryStorageInterface);

        var _this = _possibleConstructorReturn(this, (MemoryStorageInterface.__proto__ || Object.getPrototypeOf(MemoryStorageInterface)).call(this));

        _this._icons = {};
        return _this;
    }

    _createClass(MemoryStorageInterface, [{
        key: "deleteIcon",
        value: function deleteIcon(iconKey) {
            delete this.icons[iconKey];
            return Promise.resolve();
        }
    }, {
        key: "getIconKeys",
        value: function getIconKeys() {
            return Object.keys(this.icons);
        }
    }, {
        key: "retrieveIcon",
        value: function retrieveIcon(iconKey) {
            return Promise.resolve(this.icons[iconKey]);
        }
    }, {
        key: "storeIcon",
        value: function storeIcon(iconKey, iconData) {
            this.icons[iconKey] = iconData;
            return Promise.resolve();
        }
    }, {
        key: "icons",
        get: function get() {
            return this._icons;
        }
    }]);

    return MemoryStorageInterface;
}(StorageInterface);

module.exports = MemoryStorageInterface;