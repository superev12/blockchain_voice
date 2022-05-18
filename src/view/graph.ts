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

    addTruth(actorId: number, chainIndex: number) {
        if (chainIndex < this.getNumberOfChains(actorId) - 1) return;

        // Generate new truth block
        const truthUUID = uuid();
        this.blockTruths = this.blockTruths.set(truthUUID, true);


        // Connect the block to the chain
        this.addBlockToActorAtChain(actorId, chainIndex, truthUUID);


    }
    communicate() {}

    // Access instructions
    getActorIds(): List<string> {
        return this.graph
            .filterNodes((_, attributes) => {
                return attributes.nodeType === NodeType.Actor
            }
        );
    }

    getNumberOfActors(): number {
        return this.graph.filterNodes((_, attributes) => {
            return attributes.nodeType === NodeType.Actor
        }).length;
    }

    getNumberOfChains(actorId: number): number {
        // Is the number of blocks connected to it
        return this.graph
            .filterNeighbors(actorId, (_, attributes) => {
                return attributes.nodeType === NodeType.Block;
            })
            .length;
    }

    getChains(actorId: number): List<List<NodeUUID>> {
        // Add every block connected to the actor
        const rootBlockNodeIds = List(this.graph
            .filterNeighbors(actorId, (_, attributes) => {
                return attributes.nodeType == NodeType.Block;
            })
        );

        const addChainTail = (chain: List<NodeUUID>): List<NodeUUID> => {
            const nodeIsUnvisitedBlock = (id, attributes) => {
                const nodeIsBlock = attributes.nodeType === NodeType.Block;
                const nodeIsUnvisited = !(chain.includes(id));
                return nodeIsBlock && nodeIsUnvisited;
            }

            const nextChain: List<NodeUUID>= List(this.graph
                .filterNeighbors(chain.get(-1), nodeIsUnvisitedBlock)
            );
            
            if (nextChain.size === 0) return chain;
            
            console.log("about to return the recursive case");
            return addChainTail(chain.push(nextChain.get(0)));
        };



        const nodeIds: List<List<NodeUUID>> = rootBlockNodeIds.map((id: NodeUUID) => {
            return addChainTail(List([id]));
        });

        console.log("the chains got were", nodeIds.toString());

        const blockIds: List<List<BlockUUID>> = nodeIds.map((chain: List<NodeUUID>) => {
            return chain.map((nodeId: NodeUUID) => {
                return this.graph.getNodeAttribute(nodeId, "blockUUID");
            });
        });

        // Sort nodeIds based on block ids

        const nodeIdsAndBlockIds: List<List<[NodeUUID, BlockUUID]>> = nodeIds.map((chainNodeIds, index) => {
            const chainBlockIds = blockIds.get(index);
            return chainNodeIds.zip(chainBlockIds);
        });

        const sortedNodeIdsAndBlockId: List<List<[NodeUUID, BlockUUID]>> = nodeIdsAndBlockIds.sort((chainA, chainB) => {
            const getBlockIdString = (chain) => {
                return chain.reduce((reduction, value) => `${reduction}${value}`)
            };
            const chainAString = getBlockIdString(chainA);
            const chainBString = getBlockIdString(chainB);

            return chainAString.localeCompare(chainBString);
        })

        const sortedNodeIds: List<List<NodeUUID>> = sortedNodeIdsAndBlockId.map((chain) => {
            return chain.map((pair)=> {
                return pair[0];
            });
        })

        return sortedNodeIds

    }

    getChain(actorId: number, chainIndex: number): List<BlockUUID> {
        const chains = this.getChains(actorId)
        if (chainIndex >= chains.size) return List();
        return chains.get(chainIndex);
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

    private addBlock(blockUUID: BlockUUID): NodeUUID {
        // block truth must be predetermined
        if (this.blockTruths.get(blockUUID) === undefined) return;

        const nodeUUID: NodeUUID = uuid();
        const isTrue: boolean = this.blockTruths.get(blockUUID);
        this.graph.addNode(nodeUUID, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: 8,
            label: isTrue ? "Truth" : "Lie",
            color: isTrue ? "green" : "red",
            // custom attributes
            nodeType: NodeType.Block,
            nodeUUID: nodeUUID,
            blockUUID: blockUUID,
        });

        return nodeUUID;
    }

    private addBlockToActorAtChain(actorId: number, chainIndex: number, blockUUID: BlockUUID) {
        console.log("##")

        console.log("adding new block to actor", actorId, "on chain", chainIndex);
        // Add new block
        const nodeUUID = this.addBlock(blockUUID);
        console.log("id of the new node is", nodeUUID)

        // Link block to parent
        const existingChain = this.getChain(actorId, chainIndex);
        console.log("chain is", existingChain.toString());
        const parentUUID = existingChain.size === 0 ? actorId : existingChain.get(-1);
        console.log("parent is", parentUUID);

        this.graph.addEdge(nodeUUID as string, parentUUID as string);

    }

}


