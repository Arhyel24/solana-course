import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  createAssociatedTokenAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const main = async () => {
  const payer = await getKeypairFromFile(
    "7wQzf1Zjog8NYsR9jnWAc3qTu4sm2wUL1Fy3kfwwnYgq.json"
  );
  console.log(`Payer: ${payer.publicKey.toString()}`);
  const mint = await getKeypairFromFile(
    "x4CHwD3LNXpHaan6dXb9EtF6y8B3ACKoQJZqPxgNjhg.json"
  );
  console.log(`Mint: ${mint.publicKey.toString()}`);

  const ata = await createAssociatedTokenAccount(
    connection,
    payer,
    mint.publicKey,
    payer.publicKey
  );

  console.log(ata.toString());

  const mintIx = mintTo(
    connection,
    payer,
    mint.publicKey,
    ata,
    payer.publicKey,
    5620000,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(`Token supply updated with sig: ${mintIx}`);
};

main();
