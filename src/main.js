import "path";

import Actor from "./actor";
import Data from "./data";
import {getRandomInt} from "./utils";

const testActor = new Actor("Marley");
testActor.currentChains = [["a", "a", "b", "a"], ["a", "a", "a", "a"]];
const data = new Data([new Actor("Jeff"), new Actor("Harry"), new Actor("Eunice"), new Actor("Macropede")]);

//setInterval(() => actionLoop(), 2000);

/*
actionLoop();
actionLoop();
actionLoop();
actionLoop();
actionLoop();
actionLoop();
actionLoop();
actionLoop();
actionLoop();
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
    const randomActionIndex = getRandomInt(0, 2);

    switch(randomActionIndex) {
        case 0:
            // Add truth to an actor
            actionTruth();
            break;
        case 1:
            // Add lie to an actor
            actionLie();
            break;
        case 2:
            // Communicate from actor to another
            actionCommunicate();
            break;
    }


}

function reproducableActions() {
    data.addBlock("truth", data.actors[actorIndex].name, 0);
}

function actionTruth() {
    const actorIndex = getRandomInt(0, data.actors.length-1);
    console.log("adding truth to", data.actors[actorIndex].name);
    data.addBlock("truth", data.actors[actorIndex].name, 0);
}

function actionLie() {
    const actorIndex = getRandomInt(0, data.actors.length-1);
    console.log("adding lie to", data.actors[actorIndex].name);
    data.addBlock("lie", data.actors[actorIndex].name, 0);
}

function actionCommunicate() {
    const fromActorIndex = getRandomInt(0, data.actors.length-1);
    const fromActorName = data.actors[fromActorIndex].name;
    let toActorIndex;
    while (toActorIndex === fromActorIndex || !toActorIndex) {
        toActorIndex = getRandomInt(0, data.actors.length-1);
    }
    const toActorName = data.actors[toActorIndex].name;
    console.log("communicating from", data.actors[fromActorIndex].name, "to", data.actors[toActorIndex].name);
    data.communicate(fromActorName, toActorName);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
