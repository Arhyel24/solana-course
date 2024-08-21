import * as web3 from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

/**
 * Create new wallet on solana blockchain
 * @return New solana wallet keypair
 */

export async function createWallet(): Promise<void> {
  // Generate a new keypair
  const keypair = web3.Keypair.generate();

  const publicKeyBase58 = keypair.publicKey.toBase58();
  const secretKey = Array.from(keypair.secretKey);

  // Define the filename using the public key
  const filename = path.join(process.cwd(), `${publicKeyBase58}.json`);

  // Write the secret key to the JSON file
  fs.writeFileSync(filename, JSON.stringify(secretKey));

  console.log(`Wallet saved to ${filename}`);
}
