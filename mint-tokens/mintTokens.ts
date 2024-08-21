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
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddress,
  getMintLen,
  getTokenMetadata,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";

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

  const mintSpace = getMintLen([ExtensionType.MetadataPointer]);

  const metadataspace = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintSpace + metadataspace
  );

  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintSpace,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initialiseMetadataPointerIx =
    createInitializeMetadataPointerInstruction(
      mint.publicKey,
      payer.publicKey,
      mint.publicKey,
      TOKEN_2022_PROGRAM_ID
    );

  const initialiseMintIx = createInitializeMintInstruction(
    mint.publicKey,
    4,
    payer.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID
  );

  const initialiseMetadataIx = createInitializeInstruction({
    mint: mint.publicKey,
    metadata: mint.publicKey,
    mintAuthority: payer.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: payer.publicKey,
  });

  // const associatedTokenAccount = await getAssociatedTokenAddress(
  //   mint.publicKey,
  //   payer.publicKey,
  //   false,
  //   TOKEN_2022_PROGRAM_ID
  // );

  // console.log(associatedTokenAccount.toBase58());

  const createAssociatedTokenAccountIx =
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      ta,
      payer.publicKey,
      mint.publicKey,
      TOKEN_2022_PROGRAM_ID
    );

  const mintAmount = 500 * 10 ** 4;

  const mintIx = createMintToInstruction(
    mint.publicKey,
    ta,
    payer.publicKey,
    mintAmount,
    [],
    TOKEN_2022_PROGRAM_ID
  );

  const updateMetadaField = metadata.additionalMetadata.map(([field, value]) =>
    createUpdateFieldInstruction({
      metadata: mint.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
      updateAuthority: payer.publicKey,
      field,
      value,
    })
  );

  const transaction = new Transaction().add(
    createAccountIx,
    initialiseMetadataPointerIx,
    initialiseMintIx,
    initialiseMetadataIx,
    // createAssociatedTokenAccountIx,
    // mintIx,
    ...updateMetadaField
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
