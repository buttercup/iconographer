"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isNode = require("is-node");
var icoJS = isNode ? require("icojs") : require("icojs/browser");

var ICO_FILE = /\.ico$/i;

function convertFetchedIconToImage(fetchedIconInfo) {
    var url = fetchedIconInfo.url,
        data = fetchedIconInfo.data;

    if (ICO_FILE.test(url)) {
        return icoJS.parse(data, "image/png").then(selectLargestIco).then(function (image) {
            return Object.assign({}, fetchedIconInfo, {
                data: image.buffer,
                size: image.width
            });
        });
    }
    return fetchedIconInfo;
}

function selectLargestIco(images) {
    var convertedImages = [].concat(_toConsumableArray(images));
    return convertedImages.sort(function (imageA, imageB) {
        if (imageA.width > imageB.width) {
            return -1;
        } else if (imageB.width > imageA.width) {
            return 1;
        }
        return 0;
    });
}

module.exports = {
    convertFetchedIconToImage: convertFetchedIconToImage
};