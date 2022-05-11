const express = require("express");
const path = require("path");

const app = express();

const webpack = require("webpack");
const configs = require("./config/webpack.config.js");

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const compiler = webpack(configs);

app.use(webpackDevMiddleware(compiler, {
    publicPath: "/",
    writeToDisk: true,
}));
app.use(webpackHotMiddleware(compiler));



app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname, "dist/index.html"));
    //res.send("Yo yo, what's up?");
});

app.get("/view", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/view.html"));
//    res.send("This is the view");
});

app.get("/submit", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/submit.html"));
    //res.send("This is a request to /submit, nice")
});

app.get("/manifest", (req, res) => {
    res.send()
})

app.use(express.static("public"));


//const server = app.listen(process.env.port);
const server = app.listen(8080)
const portNumber = server.address().port;

console.log("Server listening on", portNumber);

