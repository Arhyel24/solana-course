import fs from "fs";
import { Keypair } from "@solana/web3.js";

const getKeypair = (path: string): Keypair => {
  const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(path, "utf-8")));
  return Keypair.fromSecretKey(secretKey);
};

export default getKeypair;
