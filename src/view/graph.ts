import * as Graphology from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import {List, Set} from "immutable";
import {v4 as uuid} from "uuid";

import {NodeUUID, BlockUUID} from "./utils";

const enum NodeType {Actor, Block}

export class Graph {
    
    private graph: Graphology.Graph;
    private renderer: Sigma;
    private layout: ForceSupervisor;

    public blockTruths: Array<boolean> = [];

    constructor(actors) {
        console.log("initialised the graph");

        this.graph = new Graphology.Graph();

        const container = document.getElementById("graphDiv");

        this.renderer = new Sigma(this.graph, container, {});
        this.layout = new ForceSupervisor(this.graph);
        this.layout.start();

        // add actors to graph
        actors.forEach((actor) => {
            this.addActor(actor.id, actor.displayName);
        });
    }

    // Top level instructions
    addLie(actorId: number) {
        // Generate new lie block
        // Add to actor
    }

    addTruth(actorId: number, chainIndex) {
        // Generate 
    }
    communicate() {}

    // Access instructions
    getActorIds(): Array<string> {
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
        return 0;
    }

    getChain(actorId: number, chainIndex: number): Array<BlockUUID> {
        return <BlockUUID[]>[];
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

}


