const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
    {
        mode: "development",
        experiments: {topLevelAwait: true},
        entry: "./src/view/view.ts",
        output: {
            filename: "./view.bundle.js",
            clean: true,
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
                filename: "./view.html",
            }),
        ],
        resolve: {
            extensions: ['', '.js', '.ts'],
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
        experiments: {topLevelAwait: true},
        entry: "./src/submit/submit.ts",
        output: {
            filename: "./submit.bundle.js",
            clean: true,
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
                filename: "./submit.html",
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
