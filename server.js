const express = require("express");
const path = require("path");

const app = express();

const webpack = require("webpack");
const config = require("./config/webpack.config.js");
const compiler = webpack(config);

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname, "dist/index.html"));
    res.send("Yo yo, what's up?");
});

app.get("/submit", (req, res) => {
    // res.sendFile(path.join(__dirname, "dist/submit.html"));
    res.send("This is a request to /submit, nice")
});


//const server = app.listen(process.env.port);
const server = app.listen(8080)
const portNumber = server.address().port;

console.log("Server listening on", portNumber);

