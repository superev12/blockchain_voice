const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        server: "./src/server/server.js",
    },
    output: {
        path: path.join(__dirname, "../dist"),
    },
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                },
            },
        ],
    }
}
