import {
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const getAirdrop = async (address: PublicKey, amount: number) => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const signx = await connection.requestAirdrop(
    address,
    amount * LAMPORTS_PER_SOL
  );

  console.log(`Airdrop of ${amount} SOL successful`);
};

export default getAirdrop;
