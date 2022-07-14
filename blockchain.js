import { SHA256 } from "bun";
// Create timestamp in format ISO 8601 yyyy-mm-ddThh:mm:ss.sssZ
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}
// Create a blockchain class
class Blockchain {
  constructor() {
    // Set genesis block
    this.chain = [];
    this.createBlock(1, "0");
  }
  // Create a new block
  createBlock(proof, previousHash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: getCurrentDate(),
      proof: proof,
      previousHash: previousHash,
    };
    // Add the block to the chain
    this.chain.push(block);
    return block;
  }
  // Get the last block
  getpreviousBlock() {
    return this.chain[this.chain.length - 1];
  }
  // Proof of work for the blockchain
  proofOfWork(previousProof) {
    let newProof = 1;
    let checkProof = false;
    while (!checkProof) {
      // Create a hash of the previous proof and the new proof
      const hash = SHA256.hash(
        String(newProof ** 2 - previousProof ** 2),
        "hex"
      );
      if (hash.substring(0, 4) === "0000") {
        checkProof = true;
      } else {
        newProof++;
      }
    }
    return newProof;
  }
  // Calculate hash of a block
  hash(block) {
    const blockString = JSON.stringify(block);
    return SHA256.hash(blockString, "hex");
  }
  // Validate the blockchain
  isChainValid(chain) {
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
      const hash = this.hash(previousBlock);
      if (hash !== currentBlock.previousHash) {
        return false;
      }
      if (currentBlock.proof !== this.proofOfWork(previousBlock.proof)) {
        return false;
      }
    }
    return true;
  }
}
// Export the Blockchain class
export { Blockchain };
