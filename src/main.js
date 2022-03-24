import "path";

import Actor from "./actor";
import Graph from "./graph";


const testActor = new Actor("Marley");
testActor.currentChains = [["a", "a", "b", "a"], ["a", "a", "a", "a"]];
const actors = [new Actor("Jeff"), new Actor("Harry"), new Actor("Eunice"), testActor];
const graph = new Graph();
console.log(graph);

registerActors(actors);

setInterval(() => actionLoop(actors), 5000);

// Add all actors to the graph as nodes
function registerActors(actors) {
    for (let actor of actors) {
        graph.addNode(actor.name);
        //graph.markNode(actor.name);

        const actorChains = actor.currentChains;
        for (let i = 0; i < actorChains.length; i++) {
            const actorChain = actorChains[i];

            // Create nodes
            for (let j = 0; j < actorChain.length; j++) {
                const blockName = actorChain[j];
                const fullBlockName = getBlockNodeName(actor.name,i,j);
                graph.addNode(fullBlockName);
            }
            // Link nodes
            for (let j = 0; j < actorChain.length - 1; j++) {
                const currentBlockName = getBlockNodeName(actor.name,i,j);
                const nextBlockName = getBlockNodeName(actor.name,i,j+1);
                graph.linkNodes(currentBlockName, nextBlockName);
            }
            // Link first Node
            if (actorChain.length >= 1) {
                const nextBlockName = getBlockNodeName(actor.name, i, 0);
                graph.linkNodes(actor.name, nextBlockName);
            }
        }
    }
}


// Define action loop
function actionLoop(actors) {
    // Add truth to an actor
    console.log(actors)
    const actorIndex = getRandomInt(0, actors.length-1);
    console.log(actorIndex)
    const {removed, added} = actors[actorIndex].addBlock("a");

    const removedNames = [];
    for (let i = 0; i < removed.length; i++) {
        for (let j = 0; j < removed[i].length; j++) {
            removedNames.push(getBlockNodeName(actors[actorIndex].name, i, j));
        }
    }
    console.log("removed names is", removedNames);
    for (let removedName in removedNames) {
        graph.removeNode(removedName);
    }

    const addedNames = [];
    for (let i = 0; i < added.length; i++) {
        for (let j = 0; j < added[i].length; j++) {
            addedNames.push(getBlockNodeName(actors[actorIndex].name, i, j));
        }
    }
    console.log("added names is", addedNames);
    for (let addedName in addedNames) {
        graph.addNode(addedName);
    }
    for (let addedName in addedNames) {
        linkNodeToGraph(addedName);
    }

    // Add lie to an actor
    // Communicate from actor to another
}

function linkNodeToGraph(name) {
    const nodeNames = name.split('.');
    const [actorName, blockchainIndex, blockIndex] = nodeNames;

    if (blockIndex === 0) {
        graph.linkNodes(actor.name, name);
        return
    }

    graph.linkNodes(getBlockNodeName(actorName, blockchainIndex, blockIndex-1), name);
}

function getBlockNodeName(actorName, blockchainIndex, blockIndex) {
    return `${actorName}.${blockchainIndex}.${blockIndex}`;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
