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
        console.log(this.graph);
    }

    addNode(name) {
        this.graph.addNode(name);
    }

    removeNode(name) {
        this.graph.removeNode(name);
    }

    linkNodes(name1, name2) {
        this.graph.addLink(name1, name2);
    }

    removeLink(name1, name2) {
        const linkId = this.graph.getLink(name1, name2);
        this.graph.removeLink(linkId);
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

