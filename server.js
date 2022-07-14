import { serve } from "bun";
import { Blockchain } from "./blockchain";
// Instantiate a new blockchain
const blockchain = new Blockchain();
// Create server Bun
serve({
  async fetch(request) {
    const { url, method } = request;
    const { pathname } = new URL(url);
    // Mine a new block
    if (pathname === "/mine_block" && method === "GET") {
      const previousBlock = blockchain.getpreviousBlock();
      const proof = blockchain.proofOfWork(previousBlock.proof);
      const previousHash = blockchain.hash(previousBlock);
      const block = blockchain.createBlock(proof, previousHash);
      return new Response(JSON.stringify(block), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    // Get the full blockchain 
    if (pathname === "/get_chain" && method === "GET") {
      return new Response(JSON.stringify(blockchain.chain), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    // Validate the blockchain
    if (pathname === "/is_valid" && method === "GET") {
      const isValid = blockchain.isChainValid(blockchain.chain);
      if (isValid) {
        return new Response(JSON.stringify({ "message": "This blockchain is valid." }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      return new Response(JSON.stringify({"message": "This blockchain is corrupt."}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
  port: 3000,
});

console.log("Server running on port 3000");
