import * as Random from "random-js";

export type NodeUUID = string;
export type BlockUUID = string;
export type ActorID = string;

// Setup random
const randomEngine = Random.MersenneTwister19937.seed(42);

export function getRandomInt(min: number, max: number): number {
    return Random.integer(min, max)(randomEngine);
}

export function weightedRandom<T>(items: Array<T>, weights: Array<number>): T {
    if (items.length !== weights.length) return items[0];

    const summedWeight = weights.reduce((a, b) => a+b);
    const randomInRange = Random.real(0, summedWeight)(randomEngine);
    let cumulativeWeights = 0;
    for (let i = 0; i < items.length; i++) {
        cumulativeWeights += weights[i];
        if (randomInRange <= cumulativeWeights) {
            return items[i];
        }
    }
    return items[items.length];
}

