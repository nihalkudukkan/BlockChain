const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(data, previousHash) {
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.getHash();
        this.nonce = 0;
    }
    getHash() {
        return SHA256(this.previousHash + JSON.stringify(this.data) + this.nonce).toString()
    }
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join("0")) {
            this.nonce++;
            this.hash = this.getHash();
        }
        console.log("Block Mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.firstBlock()];
        this.difficulty = 3;
    }

    firstBlock() {
        return new Block({dummy: "Dummy"}, 0)
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.mineBlock(this.difficulty)
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

console.log("mining started....");
box.addBlock(new Block({coin : 28}))
box.addBlock(new Block({coin : 50}))

// box.chain[1].data = {coin: 1}

console.log(box.isChainValid());