import "path";
import {List, Set} from "immutable";

import * as Networking from "./networking.ts";
import {Graph} from "./graph.ts";

console.log("Hello from the view script!");

// Fetch digest from server
const digest = await Networking.fetchDigest();

// Initialise graph
const actorIds : Array<String> = Object.keys(digest);
const graph = new Graph(actorIds);

// Initialise sound
