import * as Viva from 'vivagraphjs';

export default class Graph {
    constructor() {
        
        this.graph = Viva.Graph.graph();

        this.graphics = Viva.Graph.View.webglGraphics();

        this.graphics.node = (node) => {
            return Viva.Graph.View.webglSquare(
                10,
                this.getNodeColour(node)
            );
        }

        this.renderer = Viva.Graph.View.renderer(this.graph, {
            container: document.getElementById("graphDiv"),
            graphics: this.graphics,
            renderLinks: true,
            prerender: true,
        });
        this.renderer.run();
    }

    addNode(name) {
        //console.log("adding name", name);
        this.graph.addNode(name);
    }

    linkNodes(name1, name2) {
        this.graph.addLink(name1, name2);
    }

    getNodeColour(node) {
        const nodeNames = node.id.split('.');
        console.log(nodeNames);

        // Node is an actor
        if (nodeNames.length === 1) {
            return 0x00FF00;
        }

        return 0x008ED2;
    }
}

