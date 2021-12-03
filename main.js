const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Block {
    constructor(timeStamp, transaction, previousHash) {
        this.timeStamp = timeStamp;
        this.transaction = transaction;
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
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 5;
    }

    firstBlock() {
        return new Block(Date.now(), [], 0)
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLastBlock().hash;
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock)
    // }

    minePendingTransactions(rewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLastBlock().hash);
        block.mineBlock(this.difficulty)
        console.log("Block mined successfully");

        this.chain.push(block);

        this.pendingTransactions = [new Transaction(null, rewardAddress, this.miningReward)]
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    getBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transaction) {
                if (trans.from === address) {
                    balance -= trans.amount;
                }
                if (trans.to === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

box.createTransaction(new Transaction('nihal', 'sahal', 15))
box.createTransaction(new Transaction('sahal', 'fasal', 5))

box.minePendingTransactions('ghost');
console.log(box.isChainValid());

// console.log(JSON.stringify(box.chain, null, 4));

console.log(box.getBalance('fasal'));