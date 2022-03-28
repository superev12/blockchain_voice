
export function getBlockNodeName(actorName, blockchainIndex, blockIndex) {
    return `${actorName}.${blockchainIndex}.${blockIndex}`;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);                                                       
    max = Math.floor(max);                                                      
    return Math.floor(Math.random() * (max - min + 1)) + min;                   
}

export function getColourFromBlockContent(content) {
    if (content === "truth") {
        return "blue";
    }
    return "red";
}

