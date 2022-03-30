import "path";

import Actor from "./actor";
import Data from "./data";
import Sound from "./sound";
import {getRandomInt, weightedRandom} from "./utils";

const stepTimeMs = 800;
const actionWeights = {
    truth: 2,
    lie: 1,
    communicate: 10,
}

const digest = require("../digest.json");
console.log("digest has", digest);


const actors = Object.keys(digest).map((id) => new Actor(digest[id].displayName, id));
//const data = new Data([new Actor("Jeff"), new Actor("Harry"), new Actor("Eunice"), new Actor("Macropede")]);
const data = new Data(actors);

const repeatActionLoop = () => {
    console.log("we're repeating the action loop");
    setInterval(() => {
        actionLoop()
        //sleep(stepTimeMs).then(() => {
        //    actionVerify();
        //});

    }, stepTimeMs);
}

const sound = new Sound(digest, repeatActionLoop);

/*
Array.from(Array(7)).forEach((_, i) => {
    console.log(i, "#####");
    actionLoop();
    actionVerify();
});
*/



// Add all actors to the graph as nodes
function registerActors(actors) {
    for (let actor of actors) {
        graph.addActor(actor.name);

        const actorChains = actor.currentChains;
        for (let i = 0; i < actorChains.length; i++) {
            const actorChain = actorChains[i];

            // Create nodes
            for (let j = 0; j < actorChain.length; j++) {
                const blockName = actorChain[j];
                const fullBlockName = getBlockNodeName(actor.name,i,j);
                //graph.addNode(fullBlockName);
            }
            // Link nodes
            for (let j = 0; j < actorChain.length - 1; j++) {
                const currentBlockName = getBlockNodeName(actor.name,i,j);
                const nextBlockName = getBlockNodeName(actor.name,i,j+1);
                //graph.linkNodes(currentBlockName, nextBlockName);
            }
            // Link first Node
            if (actorChain.length >= 1) {
                const nextBlockName = getBlockNodeName(actor.name, i, 0);
                //graph.linkNodes(actor.name, nextBlockName);
            }
        }
    }
}


// Define action loop
function actionLoop() {
    const randomAction = weightedRandom(Object.keys(actionWeights), Object.values(actionWeights));

    console.log("performing action", randomAction)

    switch(randomAction) {
        case "truth":
            // Add truth to an actor
            actionTruth();
            break;
        case "lie":
            // Add lie to an actor
            actionLie();
            break;
        case "communicate":
            // Communicate from actor to another
            actionCommunicate();
            break;
    }
}

function actionTruth() {
    // A node mines the next block in the blockchain
    const actorIndex = getRandomInt(0, data.actors.length-1);
    console.log("adding truth to", data.actors[actorIndex].name);
    sound.playSound(`${data.actors[actorIndex].id}_true`);
    data.addBlock(
        {
            label: "truth",
            creator: data.actors[actorIndex].name,
        },
        data.actors[actorIndex].name,
        0
    );
}

function actionLie() {
    // A node adds a false block to one of their blockchains
    const actorIndex = getRandomInt(0, data.actors.length-1);
    console.log("adding lie to", data.actors[actorIndex].name);
    sound.playSound(`${data.actors[actorIndex].id}_lie`);
    data.addBlock(
        {
            label: "lie",
            creator: data.actors[actorIndex].name,
        },
        data.actors[actorIndex].name,
        0
    );
}

function actionCommunicate() {
    // A node shares their blockchains with another node
    const fromActorIndex = getRandomInt(0, data.actors.length-1);
    const fromActorName = data.actors[fromActorIndex].name;
    let toActorIndex;
    let tries = 0;
    while (toActorIndex === fromActorIndex || !toActorIndex) {
        toActorIndex = getRandomInt(0, data.actors.length-1);
        tries++;
        if (tries > 32) return;
    }
    const toActorName = data.actors[toActorIndex].name;
    console.log("communicating from", data.actors[fromActorIndex].name, "to", data.actors[toActorIndex].name);
    sound.playSound(`${data.actors[fromActorIndex].id}_communicate`);
    data.communicate(fromActorName, toActorName);
}

function actionVerify() {
    // All nodes check their blockchains for inconsistencies
    console.log("verifying transactions");
    data.verifyBlockchainsForAllActors();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
