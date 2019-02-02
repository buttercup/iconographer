const icoJS = require("icojs");
const svgToPng = require("svg2png");
const gifFrames = require("gif-frames");
const streamToBuffer = require("stream-to-buffer");
const Jimp = require("jimp");

const SIZE = 256;

function convertFetchedIconToPNG(fetchedIconInfo) {
    const { data, ext } = fetchedIconInfo;
    console.log("FETCHED", fetchedIconInfo);
    if (ext === "ico") {
        return icoJS
            .parse(data, "image/png")
            .then(selectLargestIco)
            .then(image =>
                Object.assign({}, fetchedIconInfo, {
                    data: image.buffer,
                    size: image.width,
                    ext: "png",
                    mime: "image/png"
                })
            )
            .then(fetchedIcon => convertFetchedIconToPNG(fetchedIcon));
    } else if (ext === "svg") {
        const svgData = data.toString("utf8");
        return svg2png(svgData, { width: SIZE, height: SIZE })
            .then(buff =>
                Object.assign({}, fetchedIconInfo, {
                    data: buff,
                    size: SIZE,
                    ext: "png",
                    mime: "image/png"
                })
            )
            .then(fetchedIcon => convertFetchedIconToPNG(fetchedIcon));
    } else if (ext === "gif") {
        return gifFrames({ url: data, frames: 1, outputType: "png" })
            .then(frameData => frameData.getImage())
            .then(dataStream => new Promise((resolve, reject) => {
                streamToBuffer(dataStream, (err, buff) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(buff);
                });
            }))
            .then(buff => Object.assign({}, fetchedIconInfo, {
                data: buff,
                ext: "png",
                mime: "image/png"
            }))
            .then(fetchedIcon => convertFetchedIconToPNG(fetchedIcon));
    }
    return Jimp
        .read(data)
        .then(jimp => {
            jimp
                .resize(SIZE, SIZE)
                .greyscale();
            return jimp.getBufferAsync("image/png").then(buff =>
                Object.assign({}, fetchedIconInfo, {
                    data: buff,
                    size: SIZE,
                    ext: "png",
                    mime: "image/png"
                })
            );
        });
}

function selectLargestIco(images) {
    const convertedImages = [...images];
    convertedImages.sort((imageA, imageB) => {
        if (imageA.width > imageB.width) {
            return -1;
        } else if (imageB.width > imageA.width) {
            return 1;
        }
        return 0;
    });
    return convertedImages[0];
}

module.exports = {
    convertFetchedIconToPNG
};
