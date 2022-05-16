import "path";
import {List, Set} from "immutable";

import * as Networking from "./networking";
import {Graph} from "./graph";
import {getRandomInt, weightedRandom} from "./utils";

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

// Do action loop
const actionLoop = () => {
    console.log("doing the interval");
    // Pick an action
    enum Action {TRUE, LIE, COMMUNICATE}
    const weights = [3, 1, 10];
    //const nextAction: Action = weightedRandom(Object.values(Action), weights) as Action;
    const nextAction = Action.TRUE;

    // Trigger the action
    switch (nextAction) {
        case Action.TRUE:
            doTruth();
            break;
        case Action.LIE:
            doLie();
            break;
        case Action.COMMUNICATE:
            doCommunicate();
            break;
    }

}

setInterval(actionLoop, 5000);

function doTruth() {
    // Pick actor to add truth to
    const actorIndex = getRandomInt(0, graph.getNumberOfActors());
    const actorId = graph.getActorIds()[actorIndex];
    const chainIndex = getRandomInt(0, graph.getNumberOfChains(actorId));

    console.log(`picked ${actorIndex}, ${actorId}, ${chainIndex}`);

    graph.addTruth(actorId, chainIndex);



    // create truth
}
