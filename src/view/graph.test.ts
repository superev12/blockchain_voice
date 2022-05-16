import {Graph, NodeType} from "./graph"

test("it adds actors", () => {
    // arrange
    const graph = new Graph([]);
    // act
    graph.addActor("id", "name");
    // assert
    expect(graph.graph.hasNode("id"))
    expect(graph.graph.getNodeAttributes("id", "nodeType")).toBe(NodeType.Actor);
})
