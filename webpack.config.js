const path = require("path");
const { DefinePlugin } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const DIST = path.resolve(__dirname, "./dist");

module.exports = {
    entry: path.resolve(__dirname, "./source/index.js"),

    node: {
        fs: "empty"
    },

    output: {
        filename: "iconographer.js",
        path: DIST,
        libraryTarget: "commonjs2"
    },

    plugins: [
        new DefinePlugin({
            WP_ENV: true
        }),
        new CopyPlugin([
            { from: "resources/images/*", to: path.join(DIST, "images"), flatten: true }
        ])
    ]
};
