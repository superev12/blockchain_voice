import * as Path from "path";
import * as Tone from "tone";


export default class Sound {

    constructor(digest, onload) {

        this.sounds = {};

        for (let key of Object.keys(digest)) {
            this.sounds[`${key}_true`] = Path.join("sounds", digest[key].truthSoundFilename);
            this.sounds[`${key}_lie`] = Path.join("sounds", digest[key].lieSoundFilename);
            this.sounds[`${key}_communicate`] = Path.join("sounds", digest[key].communicateSoundFilename);
        }

        this.players = new Tone.Players(this.sounds, () => {
            console.log("we're loaded boys")
            onload();
        }).toDestination();
    }

    playSound(name) {
        console.log("playing sound for", name);
        //this.players.stopAll();
        this.players.player(name).start();
    }
}
