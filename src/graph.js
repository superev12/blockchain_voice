import * as Graphology from "graphology"
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";

import {getBlockNodeName, getColourFromBlockContent} from "./utils";

export default class Graph {
    constructor() {
        
        this.graph = new Graphology.Graph();

        const container = document.getElementById("graphDiv");

        this.renderer = new Sigma(this.graph, container, {});
        this.layout = new ForceSupervisor(this.graph);
        this.layout.start();
    }

    addActor(name) {
        this.graph.addNode(name, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: 10,
            label: name,
            color: "grey",
        });
    }

    addBlock(content, targetActorName, targetChainIndex, targetBlockIndex) {
        const blockName = getBlockNodeName(targetActorName, targetChainIndex, targetBlockIndex);

        this.graph.addNode(blockName, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: 5,
            label: content.label,
            color: getColourFromBlockContent(content.label),
        });

        this.linkBlockToParent(blockName);
    }

    removeBlock(targetActorName, targetChainIndex, targetBlockIndex) {
        const blockName = getBlockNodeName(targetActorName, targetChainIndex, targetBlockIndex);
        this.graph.dropNode(blockName);
    }

    removeChainsFromParent(parentName) {
        for (let nodeKey of this.graph.nodes()) {
            const nodeComponents = nodeKey.split(".");
            if (nodeComponents.length > 1 && nodeComponents[0] === parentName) {
                this.removeBlock(...nodeComponents);
            }
        }
    }

    addChainsToActor(actorName, chains) {
        const startIndex = this.getActorNextFreeChainIndex(actorName);
        console.log("the chain index to add at is", startIndex)

        for (let sourceChainIndex = 0; sourceChainIndex < chains.length; sourceChainIndex++) {
            const targetChainIndex = startIndex + sourceChainIndex;
            this.addChainToActorAtChainIndex(actorName, targetChainIndex, chains[sourceChainIndex]);
        }

    }

    addChainToActorAtChainIndex(actorName, chainIndex, chain) {
        for (let blockIndex = 0; blockIndex < chain.length; blockIndex++) {
            this.addBlock(
                chain[blockIndex],
                actorName,
                chainIndex,
                blockIndex
            )
        }
    }

    linkBlockToParent(blockName) {
        const blockComponents = blockName.split(".");
        if (parseInt(blockComponents[2]) === 0) {
            // Is first in chain, connect to actor
            this.graph.addEdge(blockName, blockComponents[0]);
        } else {
            this.graph.addEdge(
                blockName,
                getBlockNodeName(blockComponents[0], blockComponents[1], blockComponents[2] - 1)
            );
        }


    }

    getActorNextFreeChainIndex(actorName) {
        let i = 0;
        console.log("check actor named", getBlockNodeName(actorName, i, 0))
        console.log("from name", actorName)
        while (this.graph.hasNode(getBlockNodeName(actorName, i, 0))) {
            i++;
        };
        return i;
    }

    addCommunicationEdge(fromActorName, toActorName) {
        this.graph.addEdge(fromActorName, toActorName, {
            type: "arrow",
            label: "talk",
            size: 5,
            color: "green",
        })
    }

    clearCommunicationEdges() {
        const communicationEdges = this.graph.filterEdges((edge) => {
            return this.graph.getEdgeAttributes(edge).label === "talk";
        });
        if (communicationEdges?.length > 0) {
            this.graph.dropEdge(communicationEdges[0]);
        }
        
    }

}

