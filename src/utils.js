import * as Random from "random-js";

// Setup random
const randomEngine = Random.MersenneTwister19937.seed(42);

export function getBlockNodeName(actorName, blockchainIndex, blockIndex) {
    return `${actorName}.${blockchainIndex}.${blockIndex}`;
}

/*
export function getRandomInt(min, max) {
    min = Math.ceil(min);                                                       
    max = Math.floor(max);                                                      
    return Math.floor(Math.random() * (max - min + 1)) + min;                   
}
*/

export function getRandomInt(min, max) {
    return Random.integer(min, max)(randomEngine);
}

export function getColourFromBlockContent(content) {
    if (content === "truth") {
        return "blue";
    }
    return "red";
}

export function weightedRandom(items, weights) {
    if (items.length !== weights.length) return false;

    const summedWeight = weights.reduce((a, b) => a+b);
    const randomInRange = Random.real(0, summedWeight)(randomEngine);
    let cumulativeWeights = 0;
    for (let i = 0; i < items.length; i++) {
        cumulativeWeights += weights[i];
        if (randomInRange <= cumulativeWeights) {
            return items[i];
        }
    }
    return items[items.length];
}

