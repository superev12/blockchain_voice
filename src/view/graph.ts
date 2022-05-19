import * as Graphology from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import {List, Set, Map} from "immutable";
import {v4 as uuid} from "uuid";

import {NodeUUID, BlockUUID, ActorID} from "./utils";



const enum NodeType {Actor, Block}

type BlockTruth = {
    isTrue: boolean,
    creator: ActorID,
}

export class Graph {
    
    private graph: Graphology.Graph;
    private renderer: Sigma;
    private layout: ForceSupervisor;

    public blockTruths: Map<BlockUUID, BlockTruth>;

    constructor(actors) {
        this.graph = new Graphology.Graph();

        const container = document.getElementById("graphDiv");

        this.renderer = new Sigma(this.graph, container, {});
        this.layout = new ForceSupervisor(this.graph, {
            settings: {gravity: 0, inertia: 0}
        });
        this.layout.start();

        this.blockTruths = Map();

        // add actors to graph
        actors.forEach((actor) => {
            this.addActor(actor.id, actor.displayName);
        });
    }

    // Top level instructions

    addLie(actorId: ActorID, chainIndex: number) {
        this.forceAddLie(actorId, chainIndex);

        this.deleteShortChains(actorId);
        this.deleteForeignLies(actorId);
    }

    addTruth(actorId: ActorID, chainIndex: number) {
        this.forceAddTruth(actorId, chainIndex);

        this.deleteShortChains(actorId);
        this.deleteForeignLies(actorId);
    }


    communicate(fromActorId: ActorID, toActorId: ActorID) {
        if (toActorId === fromActorId) return;

        // Append new chains in fromActor to toActor

        const chainsNodeIdsToBlockIds = (chains) => {
            return chains.map((chain) => {
                return chain.map((nodeId) => {
                    return this.getBlockUUID(nodeId);
                });
            })
        };

        const fromChainsBlockIds = chainsNodeIdsToBlockIds(
            this.getChains(fromActorId)
        );
        const toChainsBlockIds = chainsNodeIdsToBlockIds(
            this.getChains(toActorId)
        );

        const chainsToSend = fromChainsBlockIds
            .filter((chain) => !toChainsBlockIds.contains(chain));

        console.log("preparing to send chains", chainsToSend.toString());
        chainsToSend.forEach((chain) => this.appendChainToActor(chain, toActorId));

        // Validate
        this.deleteForeignLies(toActorId);
        this.deleteShortChains(toActorId);
    }

    // Access instructions
    getActorIds(): List<ActorID> {
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

    getNumberOfChains(actorId: ActorID): number {
        // Is the number of blocks connected to it
        return this.graph
            .filterNeighbors(actorId, (_, attributes) => {
                return attributes.nodeType === NodeType.Block;
            })
            .length;
    }

    getBlockUUID(nodeId: NodeUUID): BlockUUID {
        return this.graph.getNodeAttribute(nodeId, "blockUUID");
    }

    getChains(actorId: ActorID): List<List<NodeUUID>> {
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
            
            return addChainTail(chain.push(nextChain.get(0)));
        };



        const nodeIds: List<List<NodeUUID>> = rootBlockNodeIds.map((id: NodeUUID) => {
            return addChainTail(List([id]));
        });

        const blockIds: List<List<BlockUUID>> = nodeIds.map((chain: List<NodeUUID>) => {
            return chain.map((nodeId: NodeUUID) => {
                return this.getBlockUUID(nodeId);
            });
        });

        // Sort nodeIds based on block ids

        const nodeIdsAndBlockIds: List<List<[NodeUUID, BlockUUID]>> = nodeIds.map((chainNodeIds, index) => {
            const chainBlockIds = blockIds.get(index);
            return chainNodeIds.zip(chainBlockIds);
        });

        const sortedNodeIdsAndBlockId: List<List<[NodeUUID, BlockUUID]>> = nodeIdsAndBlockIds.sort((chainA, chainB) => {
            const getBlockIdString = (chain) => {
                return chain.reduce((r, v): string => r + v, "");
            };
            const chainAString: string = getBlockIdString(chainA);
            const chainBString: string = getBlockIdString(chainB);

            return chainAString.localeCompare(chainBString);
        })

        const sortedNodeIds: List<List<NodeUUID>> = sortedNodeIdsAndBlockId.map((chain) => {
            return chain.map((pair)=> {
                return pair[0];
            });
        })

        return sortedNodeIds;
    }

    getChain(actorId: ActorID, chainIndex: number): List<NodeUUID> {
        const chains = this.getChains(actorId)
        if (chainIndex >= chains.size) return List();
        return chains.get(chainIndex);
    }


    // Private instructions

    private deleteForeignLies(actorId: ActorID) {
        const chains = this.getChains(actorId);
        const chainsWithForeignLies = chains.filter((chain) => 
            chain.reduce((r: boolean, id: NodeUUID) => {
                const creator = this.blockTruths.get(
                    this.getBlockUUID(id)).creator;
                return r || creator !== actorId;
            }, false)
        );
        chainsWithForeignLies.forEach((chain) => 
            chain.forEach((id: NodeUUID) => {
                this.graph.dropNode(id);
            }
        ))
    }

    private deleteShortChains(actorId: ActorID) {
        const chains = this.getChains(actorId);
        const maxChainLength = chains
            .map((chain) => chain.size)
            .reduce((r: number, item: number) => Math.max(r, item));
        const shortChains = chains
            .filter((chain) => chain.size < maxChainLength);
        shortChains.forEach((chain) => 
            chain.forEach((id: NodeUUID) => {
                this.graph.dropNode(id);
            }
        ))
    }

    private addActor(actorId: ActorID, displayName: string) {
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
        const isTrue: boolean = this.blockTruths.get(blockUUID).isTrue;
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

    private appendChainToActor(chain: List<BlockUUID>, actorId: ActorID) {
        if (chain.size <= 0) return;

        console.log("adding blocks", chain.toString());
        const newBlockNodeIds = chain.map((blockId) => this.addBlock(blockId))
        this.graph.addEdge(actorId, newBlockNodeIds.get(0));

        const pairs = newBlockNodeIds.delete(-1)
            .zip(newBlockNodeIds.delete(0));

        pairs.forEach(([id1, id2]) => this.graph.addEdge(id1, id2));
    }

    private addBlockToActorAtChain(actorId: ActorID, chainIndex: number, blockUUID: BlockUUID) {

        // Add new block
        const nodeUUID = this.addBlock(blockUUID);

        // Link block to parent
        const existingChain = this.getChain(actorId, chainIndex);
        const parentUUID = existingChain.size === 0 ? actorId : existingChain.get(-1);

        this.graph.addEdge(nodeUUID as string, parentUUID as string);

    }

    forceAddLie(actorId: ActorID, chainIndex: number) {
        console.log(`Adding lie to actor ${actorId}, chain ${chainIndex}`)
        // Ignore references to nonexistant chains
        if (chainIndex > this.getNumberOfChains(actorId)) return;

        // Generate new lie block
        const lieUUID = uuid();
        this.blockTruths = this.blockTruths.set(lieUUID, {isTrue: false, creator: actorId});

        // Connect the block to the chain
        this.addBlockToActorAtChain(actorId, chainIndex, lieUUID);
    }

    forceAddTruth(actorId: ActorID, chainIndex: number) {
        console.log(`Adding truth to actor ${actorId}, chain ${chainIndex}`)
        // Ignore references to nonexistant chains
        console.log("Chain index:", chainIndex);
        console.log("number of chains:", this.getNumberOfChains(actorId));
        if (chainIndex > this.getNumberOfChains(actorId)) return;

        // Generate new truth block
        const truthUUID = uuid();
        this.blockTruths = this.blockTruths.set(truthUUID, {isTrue: true, creator: actorId});

        // Connect the block to the chain
        this.addBlockToActorAtChain(actorId, chainIndex, truthUUID);
    }

}


