const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(data, previousHash) {
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.getHash();
    }
    getHash() {
        return SHA256(this.previousHash + JSON.stringify(this.data)).toString()
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.firstBlock()]
    }

    firstBlock() {
        return new Block({dummy: "Dummy"}, 0)
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.getHash();
        this.chain.push(newBlock)
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i-1];
            
            if (current.previousHash !== previous.hash) {
                return false;
            }

            if (current.hash !== current.getHash()) {
                return false;
            }

            return true;
        }
    }
}

let box = new BlockChain();

box.addBlock(new Block({coin : 28}))
box.addBlock(new Block({coin : 50}))

console.log(box.chain);

console.log(box.isChainValid());