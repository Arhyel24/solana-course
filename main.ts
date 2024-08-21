import getKeypair from "./get-keypair";
import getAirdrop from "./getAirdrop";
import getWalletBalance from "./lesson1";
import transferSol from "./transferSol";
import { Keypair } from "@solana/web3.js";

//Get keypairs
const ownerkeypair = getKeypair("test-wallet.json");
const secondKeypair = getKeypair("test2wallet.json");

// const key1 = Keypair.generate();
// console.log(key1.secretKey.toString());

// const key2 = Keypair.generate();
// console.log(key2.secretKey.toString());

function main() {
  // transferSol(ownerkeypair, secondKeypair.publicKey, 1.62);
  // getAirdrop(ownerkeypair.publicKey, 3.2);
  // getAirdrop(secondKeypair.publicKey, 2.4);
  // getWalletBalance(ownerkeypair.publicKey);
  // getWalletBalance(secondKeypair.publicKey);
}

main();
