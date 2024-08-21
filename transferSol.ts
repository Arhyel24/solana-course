import {
  SystemProgram,
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

//Transfer some SOL
const transferSol = async (
  sender: Keypair,
  receiver: PublicKey,
  amount: number
) => {
  const connection = new Connection(clusterApiUrl("devnet"));

  const transaction = new Transaction();

  const tnxinstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  transaction.add(tnxinstruction);
  const singx = sendAndConfirmTransaction(connection, transaction, [sender]);

  console.log(`Tranfer of ${amount} SOL to ${receiver} was successful`);
};

export default transferSol;
