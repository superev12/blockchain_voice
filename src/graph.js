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
            label: content,
            color: getColourFromBlockContent(content),
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
                console.log("removing", nodeComponents);
                this.removeBlock(...nodeComponents);
            }
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

}

