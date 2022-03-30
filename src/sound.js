import * as Tone from "tone";

export default class Sound {

    constructor() {
        this.player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();
    }

    playSound() {
        this.player.stop();
        this.player.start();
    }
}
