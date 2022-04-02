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
        this.graph.clearCommunicationEdges();
        const targetActorIndex = this.getActorIndexFromName(targetActorName);

        let targetBlockIndex;

        const targetChain = this.actors[targetActorIndex].currentChains[targetChainIndex] 
        const purgeExistingGraph = targetChain.length > 1;

        console.log("the target chain is", targetChain);

        if (targetChain === undefined || targetChain.length === 0) {
            targetBlockIndex = 0
        } else {
            targetBlockIndex = targetChain.length;
        }

        console.log("The target block index is", targetBlockIndex)

        // Update data
        {
            this.actors[targetActorIndex].addBlock(targetChainIndex, newBlock);
        }

        // Update graph
        {
            if (purgeExistingGraph) {
                this.graph.removeChainsFromParent(targetActorName);
                this.graph.addChainsToActor(targetActorName, this.actors[targetActorIndex].currentChains);
            } else {
                this.graph.addBlock(newBlock, targetActorName, targetChainIndex, targetBlockIndex);
            }
        }
    }

    communicate(fromActorName, toActorName) {
        this.graph.clearCommunicationEdges();
        this.graph.addCommunicationEdge(fromActorName, toActorName);

        const fromActorIndex = this.getActorIndexFromName(fromActorName);
        const toActorIndex = this.getActorIndexFromName(toActorName);

        // Update data
        const fromActorBlockchains = this.actors[fromActorIndex].currentChains;

        const isNonEmpty = (chain) => chain.length !== 0;

        const isUnique = (chain) => {
            return !this.actors[toActorIndex].currentChains.includes(chain);
        }

        const isTruthful = (chain) => {
            return !chain
                .map((block) => block.label)
                .includes("lie");
        }

        console.log("before filter", fromActorBlockchains)
        const filteredBlockchains = fromActorBlockchains
            .filter(isNonEmpty)
            .filter(isUnique)
            .filter(isTruthful);
        console.log("after filter", filteredBlockchains)

        let addBlockchainOutput;
        for (let blockchain of filteredBlockchains) {
            addBlockchainOutput = this.actors[toActorIndex].addBlockchain(blockchain)
        }

        // Shared data
        const numberOfSharedBlockchains = filteredBlockchains.length;
        const operation = addBlockchainOutput;

        console.log("filtered blocks for communication were", filteredBlockchains)

        // Update graph
        if (operation === "nothing") return;
        if (operation === "replaced") {
            // remove existing nodes
            this.graph.removeChainsFromParent(toActorName);

            // add new chains
            this.graph.addChainsToActor(toActorName, filteredBlockchains)
        }
        if (operation === "appended") {
            this.graph.addChainsToActor(toActorName, filteredBlockchains)
        }

    }

    /*
    verifyBlockchainsForAllActors() {
        // Update Data
        const affectedActorsIndeces = [];
        for (let actorIndex in this.actors) {
            const chainsPurged = this.actors[actorIndex].verifyBlockchains();
            const wasActorAffected = chainsPurged.size > 0;
            if (wasActorAffected) {
                affectedActorsIndeces.push(actorIndex);
            }
        }

        const gullibleActorsNames = affectedActorsIndeces.map((index) => this.actors[index].name);
        const gullibleActors = affectedActorsIndeces.map((index) => this.actors[index]);
        if (gullibleActors.length > 0) {
            console.log("the following actors have identified lies", gullibleActors);
        }

        // Update Graph
        
        console.log("affectedActors from verifcation were", affectedActorsIndeces)
        for (let actorIndex of affectedActorsIndeces) {
            const actorName = this.actors[actorIndex].name;
            this.graph.removeChainsFromParent(actorName);

            // add new chains
            for (let chainIndex = 0; chainIndex < this.actors[actorIndex].currentChains.length; chainIndex++) {
                for (let blockIndex = 0; blockIndex < this.actors[actorIndex].currentChains[chainIndex].length; blockIndex ++) {
                    this.graph.addBlock(
                        this.actors[actorIndex].currentChains[chainIndex][blockIndex],
                        actorName,
                        chainIndex,
                        blockIndex
                    );
                }
            }
        }

    }
    */

    getActorIndexFromName(actorName) {
        for (let i = 0; i < this.actors.length; i ++) {
            if (this.actors[i].name === actorName) {
                return i;
            }
        }
        return false;
    }
}

