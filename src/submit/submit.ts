import * as Tone from "tone";
//import * as Math from "math";

// Setup recording
const meter = new Tone.Meter();
const microphone = new Tone.UserMedia().connect(meter);

microphone.open().then(() => {
    console.log("mic open");
}).catch((e) => {
    console.log("mic not open");
})

const recorder = new Tone.Recorder();

// Create level meter
const meterComponent = document.createElement("div");
const mainComponent = document.getElementById("cats");
mainComponent.appendChild(meterComponent);
setTimeout(updateMeter, 100);

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
        const url = URL.createObjectURL(recording);
        const anchor = document.createElement("a");
        anchor.download = "recording.webm";
        anchor.href = url;
        anchor.click();
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

    const blobText = Array.from(
        new Uint8Array(
            await recording.arrayBuffer()
        )
    );

    // Post data to API
    const data = JSON.stringify({
        "displayName": displayName,
        "sourceAudio": blobText,
    })

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

function updateMeter() {
    meterComponent.innerHTML = gainToText(meter.getValue());
    //console.log(gainToText(meter.getValue()));
    setTimeout(updateMeter, 100);
}

function gainToText(gain: number): string {
    if (gain <= -50) {return ""}

    const numberOfThings = Math.floor((50 - Math.abs(gain))/10);
    console.log("EE", numberOfThings);
    return numberOfThings >= 1 ? "x".repeat(numberOfThings) : "";
}
