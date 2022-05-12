import "path";
import {List, Set} from "immutable";

import * as Networking from "./networking.ts";
import {Graph} from "./graph.ts";

console.log("Hello from the view script!");

// Fetch digest from server
const digest = await Networking.fetchDigest();

// Initialise graph
const actors = Object.keys(digest).map((id) => {
    return {
        id: id,
        displayName: digest[id].displayName,
    };
});
console.log(actors);

const graph = new Graph(actors);

// Initialise sound
