import * as Tone from "tone";


export default class Sound {

    constructor(digest, onload) {

        this.sounds = {};
        /*
        Object.keys(digest).forEach((personKey) => {
            this.sounds[personKey] = {
                // Update this to get files from the server
                truth: new Tone.Player("http://localhost:8080/sounds/evan_recording.wav")
                    .toDestination(),
                lie: new Tone.Player("http://localhost:8080/sounds/evan_recording.wav")
                    .toDestination(),
                communicate: new Tone.Player("http://localhost:8080/sounds/evan_recording.wav")
                    .toDestination(),
            };
        })
        */

        this.sounds["harry_truth"] = "sounds/evan_recording.wav";

        this.players = new Tone.Players(this.sounds, () => {
            console.log("we're loaded boys")
            onload();
        }).toDestination();
    }

    playSound(name) {
        console.log("playing sound for", name);
        this.players.stopAll();
        this.players.player(name).start();
    }
}
