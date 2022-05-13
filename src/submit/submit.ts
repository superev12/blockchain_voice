console.log("Hello from the submission script");
import * as Tone from "tone";

// Setup recording
const meter = new Tone.Meter();
const microphone = new Tone.UserMedia().connect(meter);

microphone.open().then(() => {
    console.log("mic open");
}).catch((e) => {
    console.log("mic not open");
})

const recorder = new Tone.Recorder();

function getTextValue(): string {
    return document.getElementById("name_input").value;
}


// Record Button
let isRecording = false;
let recording: Blob;
const recordButton = document.getElementById("record_button");
recordButton.onclick = async () => {
    if (isRecording) {
        await recorder.stop();
        console.log("recording interupted");
    }

    console.log("starting recording");
    recorder.start();
    setTimeout(async () => {
        recording = await recorder.stop();
        console.log("done recording");
    }, 5000);
};

// Submit Button
const submitButton = document.getElementById("submit_button");
submitButton.onclick = async () => {
    console.log("you clicked the submit button");

    if (!recording) {
        console.log("no file has been recorded")
        return;
    };
    const displayName = getTextValue();
    if (!displayName) {
        console.log("no name has been given")
        return;
    };
    console.log(displayName);

    const blobText: string = await recording.text();

    // Post data to API
    const data = JSON.stringify({
        "displayName": displayName,
        "sourceAudio": blobText,
    })
    const http = new XMLHttpRequest();
    // URL IS HARDCODED FOR DEV ENVIRONMENT

    await fetch("/registeractor", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: data,
    });
    console.log("Client sent data to /registeractor")
};

