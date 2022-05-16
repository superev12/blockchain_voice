import * as Graphology from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import {List, Set, Map} from "immutable";
import {v4 as uuid} from "uuid";

import {NodeUUID, BlockUUID} from "./utils";

const enum NodeType {Actor, Block}

export class Graph {
    
    private graph: Graphology.Graph;
    private renderer: Sigma;
    private layout: ForceSupervisor;

    public blockTruths: Map<BlockUUID, boolean>;

    constructor(actors) {
        console.log("initialised the graph");

        this.graph = new Graphology.Graph();

        const container = document.getElementById("graphDiv");

        this.renderer = new Sigma(this.graph, container, {});
        this.layout = new ForceSupervisor(this.graph);
        this.layout.start();

        this.blockTruths = Map();

        // add actors to graph
        actors.forEach((actor) => {
            this.addActor(actor.id, actor.displayName);
        });
    }

    // Top level instructions
    addLie(actorId: number) {
        // Generate new lie block
        const lieUUID = uuid();
        this.blockTruths = this.blockTruths.set(lieUUID, false);

        // Add to actor
        //this.graph.

    }

    addTruth(actorId: number, chainIndex) {
        // Generate new truth block
        const truthUUID = uuid();
        this.blockTruths = this.blockTruths.set(truthUUID, true);

        // Add new block
        this.addBlock(truthUUID);


    }
    communicate() {}

    // Access instructions
    getActorIds(): List<string> {
        return this.graph
            .filterNodes((_, attributes) => {
                return attributes.nodeType == NodeType.Actor
            });
    }

    getNumberOfActors(): number {
        return this.graph.filterNodes((_, attributes) => {
            return attributes.nodeType == NodeType.Actor
        }).length;
    }

    getNumberOfChains(actorId: number): number {
        // Is the number of blocks connected to it
        return this.graph
            .filterNeighbors(actorId, (_, attributes) => {
                return attributes.nodeType == NodeType.Block;
            })
            .length;
    }

    getChain(actorId: number, chainIndex: number): List<BlockUUID> {
        return List();
    }




    // Private instructions

    private addActor(actorId, displayName) {
        this.graph.addNode(actorId, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: 10,
            label: displayName,
            color: "grey",
            // custom attributes
            nodeType: NodeType.Actor,
            nodeUUID: uuid(),
        });
    }

    private addBlock(blockUUID) {
        // block truth must be predetermined
        if (this.blockTruths.get(blockUUID) === undefined) return;
        console.log("adding a new block!");

        const nodeUUID: NodeUUID = uuid();
        const isTrue: boolean = this.blockTruths[blockUUID];
        this.graph.addNode(nodeUUID, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: 8,
            label: isTrue ? "Truth" : "Lie",
            color: isTrue ? "green" : "red",
            // custom attributes
            nodeType: NodeType.Block,
            nodeUUID: nodeUUID,
        });
    }

    private addBlockToActorAtChain(actorId: number, chainIndex: number, blockUUID: BlockUUID) {

    }

}


