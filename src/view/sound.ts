import * as Tone from "tone";

export class Sound {
    private sounds;
    private players;

    constructor(actorSounds, onLoad) {
        this.sounds = {}
        Object.keys(actorSounds).forEach((id) => {
            this.sounds[`${id}_true`] = actorSounds[id].truthSoundFilename;
            this.sounds[`${id}_lie`] = actorSounds[id].lieSoundFilename;
            this.sounds[`${id}_communicate`] = actorSounds[id].communicateSoundFilename;
        });
        this.players = new Tone.Players(this.sounds, onLoad).toDestination();
    }

    playTruth(actorId) {
        this.players.player(`${actorId}_true`).start();
    }
    playLie(actorId) {
        this.players.player(`${actorId}_lie`).start();
    }
    playCommunicate(actorId) {
        this.players.player(`${actorId}_communicate`).start();
    }


}
