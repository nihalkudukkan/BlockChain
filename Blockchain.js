const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
    getHash() {
        return SHA256(this.from + this.to + this.amount).toString();
    }
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.from) {
            throw new Error("You cannot sign transaction for other wallet")
        }

        const hash = this.getHash();
        const sig = signingKey.sign(hash, 'base64');
        this.signature = sig.toDER('hex')
    }
    isValid() {
        if (this.from === null) {
            return true
        }
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature")
        }
        const key = ec.keyFromPublic(this.from, 'hex')
        return key.verify(this.getHash(), this.signature)
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
    isValidBlock() {
        for (const trans of this.transaction) {
            if (!trans.isValid()) {
                return false;
            }
        }
        return true;
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

    addTransaction(transaction) {
        if (!transaction.from || !transaction.to) {
            throw new Error("Transaction must include from and to address")
        }

        if (!transaction.isValid()) {
            throw new Error("Cannot add invalid transaction to the chain")
        }

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

            if (!current.isValidBlock()) {
                return false;
            }
            
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

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;