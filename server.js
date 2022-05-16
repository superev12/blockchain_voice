const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const uuid = require("uuid");
const exec = require("child_process").exec;

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

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// Process application/json
app.use(bodyParser.json());

app.post("/registeractor", (req, res) => {
    console.log("Server recieved data at /registeractor");
    //console.log(req.body);
    addNewActor(req.body.displayName, req.body.sourceAudio);
});

app.use(express.static("public"));
app.use(express.static("dist"));


//const server = app.listen(process.env.port);
const server = app.listen(8080)
const portNumber = server.address().port;

console.log("Server listening on", portNumber);

function addNewActor(displayName, sourceAudioString) {
    // Save audio source

    sourceAudioUUID = uuid.v4();
    const sourceAudioFilePath = path.join(
        __dirname,
        "public/sounds/",
        `${sourceAudioUUID}_source.ogx`
    );
    const sourceAudioBuffer = Buffer.from(sourceAudioString);
    fs.writeFileSync(sourceAudioFilePath, sourceAudioBuffer, "binary");

    // Generate encoding and audio

    const script = exec(`sh scripts/do_machine_learning.sh ${sourceAudioUUID}`);
    script.stdout.on("data", (data) => {
        console.log(data);
    });

    // Write new entry to json

    script.on("exit", () => {
        const digestFilePath = path.join(__dirname, "public/digest.json");
        fs.readFile(digestFilePath, "utf8", (err, jsonString) => {
            if (err) return;

            const digest = JSON.parse(jsonString);
            digest[sourceAudioUUID] = {
                "displayName": displayName,
                "vocalEncodingFilename": `${sourceAudioUUID}.enc`,
                "truthSoundFilename": `${sourceAudioUUID}_true.wav`,
                "lieSoundFilename": `${sourceAudioUUID}_lie.wav`,
                "communicateSoundFilename": `${sourceAudioUUID}_communicate.wav`
            }

            console.log("writing", digest[sourceAudioUUID]);

            fs.writeFileSync(digestFilePath, JSON.stringify(digest, null, 2));
        })
    });
}
