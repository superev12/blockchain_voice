import 'path';
import * as Viva from 'vivagraphjs';
console.log('Hi yall')

const graph = Viva.Graph.graph();
graph.addNode(1);
graph.addNode(2);
graph.addLink(1, 2);

const renderer = Viva.Graph.View.renderer(graph, {
    container: document.getElementById("graphDiv"),
});
renderer.run();

console.log(graph);
