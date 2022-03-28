import Actor from "./actor";
import Graph from "./graph";
import {getBlockNodeName} from "./utils";

export default class Data {
    constructor(actorList) {
        this.actors = [];
        this.graph = new Graph();

        for (let actor of actorList) {
            this.registerActor(actor);
        }
    }

    registerActor(actor) {
        console.log("registering", actor.name);

        // Update data
        this.actors.push(actor)

        // Update graph
        this.graph.addActor(actor.name);
    }

    addBlock(newBlock, targetActorName, targetChainIndex) {
        const targetActorIndex = this.getActorIndexFromName(targetActorName);

        let targetBlockIndex;
        const targetChain = this.actors[targetActorIndex].currentChains[targetChainIndex] 
        if (targetChain === undefined || targetChain.length === 0) {
            targetBlockIndex = 0
        } else {
            targetBlockIndex = targetChain.length;
        }

        // Update data
        {
            this.actors[targetActorIndex].addBlock(targetChainIndex, newBlock);
        }

        // Update graph
        {
            this.graph.addBlock(newBlock, targetActorName, targetChainIndex, targetBlockIndex);
        }
    }

    communicate(fromActorName, toActorName) {
        const fromActorIndex = this.getActorIndexFromName(fromActorName);
        const toActorIndex = this.getActorIndexFromName(toActorName);
        // Update data
        
        const fromActorBlockchains = this.actors[fromActorIndex].currentChains;
        console.log("Blockchains to be sent", fromActorBlockchains)
        let addBlockchainOutput;
        for (let blockchain of fromActorBlockchains) {
            addBlockchainOutput = this.actors[toActorIndex].addBlockchain(blockchain)
        }

        // Shared data
        const numberOfSharedBlockchains = fromActorBlockchains.length;
        const operation = addBlockchainOutput;
        console.log(numberOfSharedBlockchains)

        // Update graph
        if (operation === "nothing") return;
        if (operation === "replaced") {
            // remove existing nodes
            this.graph.removeChainsFromParent(toActorName);

            // add new chains
            for (let chainIndex = 0; chainIndex < numberOfSharedBlockchains; chainIndex++) {
                for (let blockIndex = 0; blockIndex < this.actors[fromActorIndex].currentChains[chainIndex].length; blockIndex ++) {
                console.log("adding new chains");
                    this.graph.addBlock(
                        this.actors[fromActorIndex].currentChains[chainIndex][blockIndex],
                        toActorName,
                        chainIndex,
                        blockIndex
                    );
                }
            }
        }
        if (operation === "appended") {
            const startIndex = this.actors[toActorIndex].currentChains.length - numberOfSharedBlockchains;
            // add new chains
            for (let chainIndex = 0; chainIndex < numberOfSharedBlockchains; chainIndex++) {
                for (let blockIndex = 0; blockIndex < this.actors[fromActorIndex].currentChains[chainIndex].length; blockIndex ++) {
                console.log("adding new chains");
                    this.graph.addBlock(
                        this.actors[fromActorIndex].currentChains[chainIndex][blockIndex],
                        toActorName,
                        chainIndex + startIndex,
                        blockIndex
                    );
                }
            }
        }

    }

    getActorIndexFromName(actorName) {
        for (let i = 0; i < this.actors.length; i ++) {
            if (this.actors[i].name === actorName) {
                return i;
            }
        }
        return false;
    }
}

