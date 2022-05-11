const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
    {
        mode: "development",
        entry: "./src/view/view.ts",
        output: {
            filename: "./dist/view.bundle.js",
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-typescript"]
                        },
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "View",
                template: "./src/view/view.html",
                filename: "./dist/view.bundle.html",
            }),
        ],
        resolve: {
            fallback: {
                path: require.resolve("path-browserify"),
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/")
            }
        },
    },
    {
        mode: "development",
        entry: "./src/submit/submit.ts",
        output: {
            filename: "./dist/submit.bundle.js",
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-typescript"]
                        },
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Submit",
                template: "./src/submit/submit.html",
                filename: "./dist/submit.bundle.html",
            }),
        ],
        resolve: {
            fallback: {
                path: require.resolve("path-browserify"),
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/")
            }
        },
    },
];
