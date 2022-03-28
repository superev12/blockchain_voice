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

