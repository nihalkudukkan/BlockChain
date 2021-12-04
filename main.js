const { BlockChain, Transaction } = require("./Blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('a2050e7aedead674327512895935728fd881a073f010253371345ecd1c20bdab');
const myWalletAddress = myKey.getPublic('hex')

let box = new BlockChain();

const tx1 = new Transaction(myWalletAddress, 'person2', 50);
tx1.signTransaction(myKey);
box.addTransaction(tx1)

box.minePendingTransactions(myWalletAddress);

console.log(box.getBalance(myWalletAddress));

// console.log(box.chain[1].transaction[0].amount=1);

console.log(box.isChainValid());