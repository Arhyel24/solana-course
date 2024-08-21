import {
  PublicKey,
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";

const getWalletBalance = async (address: PublicKey): Promise<void> => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const balance = await connection.getBalance(address);

  console.log(`Balance for ${address} : ${balance / LAMPORTS_PER_SOL} SOL`);
};

export default getWalletBalance;
