
export default class Actor {
    constructor(name, id) {
        this.currentChains = [[]];
        this.name = name;
        this.id = id;
    }

    addBlock(index, content) {
        if (index < 0 || index >= this.currentChains.length) return;

        console.log("current chains before adding block", JSON.stringify(this.currentChains));
        console.log("block to be added to chain at chainIndex", index)

        this.currentChains[index] = this.currentChains[index].concat([content])
        //this.currentChains[index].push(content);

        console.log("current chains after adding block", JSON.stringify(this.currentChains));

        return true;
    }

    addBlockchain(chain) {
        const chainCopy = new Array(...chain);
        if (chain.length < this.currentChains[0]?.length) {
            return "nothing";
        }

        if (chain.length === this.currentChains[0]?.length) {
            this.currentChains = this.currentChains.concat([chainCopy]);
            return "appended";
        }

        this.currentChains = [chainCopy];
        return "replaced";
    }

    verifyBlockchains() {
        // Checks all blockchains for lies that were not generated by self
        // If a lie is found in a blockchain, the chain is removed from the list of current chains
        // an array of the indeces of removed chains is returned

        const chainsToPurge = new Set();
        for (let chainIndex in this.currentChains) {
            for (let blockIndex in this.currentChains[chainIndex]) {
                if (
                    this.currentChains[chainIndex][blockIndex].label === "lie"
                    &&
                    this.currentChains[chainIndex][blockIndex].creator !== this.name
                ) {
                    chainsToPurge.add(parseInt(chainIndex));
                }
            }
        }

        /*
        if (chainsToPurge.length > 0) {
            console.log(this.name, "identified a foreign lie in blockchains", chainsToPurge);
            console.log(this.currentChains);
        }
        */

        this.currentChains = this.currentChains.filter((_, index) => !chainsToPurge.has(index));
        if (this.currentChains.length === 0) this.currentChains = [[]];

        return chainsToPurge;
    }
}
