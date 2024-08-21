import {
  clusterApiUrl,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getKeypairFromFile,
  keypairToSecretKeyJSON,
} from "@solana-developers/helpers";
import {
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  getTokenMetadata,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

const connection = new Connection(clusterApiUrl("devnet"));

const main = async () => {
  const tokenAccountKeypair = Keypair.generate();
  const tokenAccount = keypairToSecretKeyJSON(tokenAccountKeypair);
  console.log(`Token account address: ${tokenAccountKeypair.publicKey}`);
  console.log(`Secret key:
        ===================================================================
        ${tokenAccount}
        ===================================================================
    `);
  const ta = tokenAccountKeypair.publicKey;

  const payer = await getKeypairFromFile(
    "7wQzf1Zjog8NYsR9jnWAc3qTu4sm2wUL1Fy3kfwwnYgq.json"
  );
  console.log(`Payer: ${payer.publicKey.toString()}`);

  const mint = Keypair.generate();
  console.log(`Mint: ${mint.publicKey.toString()}`);
  console.log(Array.from(mint.secretKey));

  const metadata: TokenMetadata = {
    mint: mint.publicKey,
    name: "Shadow",
    symbol: "SHD",
    uri: "https://arhyel24.github.io/solana-dev-course/mint-tokens/metadata.json",
    additionalMetadata: [
      ["Created by", "Enoch Philip Dibal"],
      ["Date", "19 Aug. 2024"],
      [
        "Description",
        "Tis was created as part of my attempt to learn token development on solana.",
      ],
    ],
  };

  const mintSpace = 82; // Space required for Mint account (typically 82 bytes)
  const metadataSpace = 272; // Adjust accordingly based on metadata requirements

  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintSpace + metadataSpace
  );

  const createMintAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintSpace,
    lamports,
    programId: TOKEN_PROGRAM_ID,
  });

  const initializeMintIx = createInitializeMintInstruction(
    mint.publicKey,
    9, // Decimal places
    payer.publicKey,
    payer.publicKey,
    TOKEN_PROGRAM_ID
  );

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    payer.publicKey,
    false,
    TOKEN_PROGRAM_ID
  );

  const createAssociatedTokenAccountIx =
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      associatedTokenAccount,
      payer.publicKey,
      mint.publicKey,
      TOKEN_PROGRAM_ID
    );

  const mintAmount = 500 * 10 ** 9; // Adjust based on decimals

  const mintToIx = createMintToInstruction(
    mint.publicKey,
    associatedTokenAccount,
    payer.publicKey,
    mintAmount,
    [],
    TOKEN_PROGRAM_ID
  );

  const initializeMetadataIx = createInitializeInstruction({
    mint: mint.publicKey,
    metadata: mint.publicKey,
    mintAuthority: payer.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    programId: TOKEN_PROGRAM_ID,
    updateAuthority: payer.publicKey,
  });

  const updateMetadataFields = metadata.additionalMetadata.map(
    ([field, value]) =>
      createUpdateFieldInstruction({
        metadata: mint.publicKey,
        programId: TOKEN_PROGRAM_ID,
        updateAuthority: payer.publicKey,
        field,
        value,
      })
  );

  const transaction = new Transaction().add(
    createMintAccountIx,
    initializeMintIx,
    createAssociatedTokenAccountIx,
    mintToIx,
    initializeMetadataIx,
    ...updateMetadataFields
  );

  const sig = await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mint,
  ]);

  console.log(`Mint created with signature: ${sig}`);

  const chainMetadata = await getTokenMetadata(connection, mint.publicKey);

  console.log(chainMetadata);
};

main();
