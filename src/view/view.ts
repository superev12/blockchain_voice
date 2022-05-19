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

// setInterval(actionLoop, 5000);
// DEBUG
const actorId1 = graph.getActorIds()[0];
graph.addLie(actorId1, 0);
graph.addTruth(actorId1, 1);
graph.addTruth(actorId1, 1);
const actorId2 = graph.getActorIds()[0];
graph.addTruth(actorId2, 1);
graph.addLie(actorId2, 0);
graph.addLie(actorId2, 2);
//graph.communicate(actorId1, actorId2);


function doTruth() {
    // Pick actor to add truth to
    const actorIndex = getRandomInt(0, graph.getNumberOfActors());
    const actorId = graph.getActorIds()[actorIndex];
    const chainIndex = getRandomInt(0, graph.getNumberOfChains(actorId) -1);

    graph.addTruth(actorId, chainIndex);
}

function doLie() {
    // Pick actor to add lie to
    const actorIndex = getRandomInt(0, graph.getNumberOfActors());
    const actorId = graph.getActorIds()[actorIndex];
    const chainIndex = getRandomInt(0, graph.getNumberOfChains(actorId) -1);

    graph.addLie(actorId, chainIndex);
}

