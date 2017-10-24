const isNode = require("is-node");
const icoJS = isNode ? require("icojs") : require("icojs/browser");

const ICO_FILE = /\.ico$/i;

function convertFetchedIconToImage(fetchedIconInfo) {
    const { url, data } = fetchedIconInfo;
    if (ICO_FILE.test(url)) {
        return icoJS
            .parse(data, "image/png")
            .then(selectLargestIco)
            .then(image =>
                Object.assign({}, fetchedIconInfo, {
                    data: image.buffer,
                    size: image.width
                })
            );
    }
    return fetchedIconInfo;
}

function selectLargestIco(images) {
    const convertedImages = [...images];
    return convertedImages.sort((imageA, imageB) => {
        if (imageA.width > imageB.width) {
            return -1;
        } else if (imageB.width > imageA.width) {
            return 1;
        }
        return 0;
    });
}

module.exports = {
    convertFetchedIconToImage
};
