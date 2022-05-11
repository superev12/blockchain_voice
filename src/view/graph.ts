import * as Graphology from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import {List, Set} from "immutable";

export class Graph {
    
    graph: Graphology.Graph;
    renderer: Sigma;
    layout: ForceSupervisor;


    constructor(actorIds) {
        console.log("initialised the graph");
        console.log(actorIds);

        this.graph = new Graphology.Graph();

        const container = document.getElementById("graphDiv");

        this.renderer = new Sigma(this.graph, container, {});
        this.layout = new ForceSupervisor(this.graph);
        this.layout.start();
    }

}


