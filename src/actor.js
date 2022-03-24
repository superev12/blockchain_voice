
export default class Actor {
    constructor(name) {
        this.currentChains = [[]];
        this.name = name;
    }

    addBlock(content) {
        const oldChains = this.currentChains;

        const firstChain = this.currentChains[0];
        const newChain = firstChain.concat(content);
        this.currentChains = [newChain];

        return {removed: oldChains, added: newChain}
    }

    addBlockChain(chain) {
        if (chain.length < this.currentChains[0].length) return;

        if (chain.length === this.currentChains[0].length) {
            this.currentChains = this.currentChains.push(chain);
            return;
        }

        this.currentChains = [chain];
    }
}
