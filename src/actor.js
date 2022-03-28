
export default class Actor {
    constructor(name) {
        this.currentChains = [[]];
        this.name = name;
    }

    addBlock(index, content) {
        if (index < 0 || index >= this.currentChains.length) return;

        this.currentChains[index].push(content);

        return true;
    }

    addBlockchain(chain) {
        if (chain.length < this.currentChains[0]?.length) {
            return "nothing";
        }

        if (chain.length === this.currentChains[0]?.length) {
            this.currentChains = this.currentChains.push(chain);
            return "appended";
        }

        this.currentChains = [chain];
        return "replaced";
    }
}
