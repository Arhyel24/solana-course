import "dotenv/config";
import { getExplorerLink } from "@solana-developers/helpers";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const transferSplToken = async () => {
  try {
    const privateKey = process.env.SECRET_KEY;

    if (!privateKey) {
      throw new Error("Secret key not provided");
    }
    let secretKeyArray = JSON.parse(privateKey);

    const sender = await Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
    console.log(`Sending from: ${sender.publicKey.toBase58()}`);

    // Add the recipient public key here.
    // const recipient = new PublicKey("AJ8ie8RZYczr7L5g9trHvKhkSgyapTyVSLRWGDEEygjN");
    const recipient = new PublicKey(
      "FdDuxXHQgo58DQvytK2S89hTAqmMnS1d8HGHt9LTyq6r"
    );

    // Subtitute in your token mint account
    const tokenMintAccount = new PublicKey(
      "ArPqn2d4q1BepXfQmWLbELMBMtQjyUiFMcTvQjDFT22i"
    );

    // Our token has two decimal places
    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

    console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

    // Get or create the source and destination token accounts to store this token
    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      sender,
      tokenMintAccount,
      sender.publicKey
    );

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      sender,
      tokenMintAccount,
      recipient
    );

    // Transfer the tokens
    const signature = await transfer(
      connection,
      sender,
      sourceTokenAccount.address,
      destinationTokenAccount.address,
      sender,
      50000000 * MINOR_UNITS_PER_MAJOR_UNITS
    );

    const explorerLink = getExplorerLink("transaction", signature, "devnet");

    console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
  } catch (error) {
    console.log("Error: ", error);
  }
};

transferSplToken();
