import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankApp } from "../target/types/bank_app";
import { StakingApp } from "../target/types/staking_app";
import { TokenStakingApp } from "../target/types/token_staking_app";
import { PublicKey, StakeProgram, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { BN } from "bn.js";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import { use } from "chai";
import { base64 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

describe("bank-app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  //console.log(provider);
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.BankApp as Program<BankApp>;
  const staking = anchor.workspace.StakingApp as Program<StakingApp>;
  const token_staking = anchor.workspace.TokenStakingApp as Program<TokenStakingApp>;

  let tokenMint = new PublicKey("3nLVs2g8RsQm8pyhwurZeJUQFW6LZSydJ17EQt1FSgzJ")

  const BANK_APP_ACCOUNTS = {
    bankInfo: PublicKey.findProgramAddressSync(
      [Buffer.from("BANK_INFO_SEED")],
      program.programId,
    )[0],
    bankVault: PublicKey.findProgramAddressSync(
      [Buffer.from("BANK_VAULT_SEED")],
      program.programId,
    )[0],
    stakingVault: PublicKey.findProgramAddressSync(
      [Buffer.from("STAKING_VAULT")],
      staking.programId,
    )[0],
    tokenStakingVault: PublicKey.findProgramAddressSync(
      [Buffer.from("BANK_VAULT")],
      token_staking.programId,
    )[0],
    userReserve: (pubkey: PublicKey, tokenMint?: PublicKey) => {
      let SEEDS = [
        Buffer.from("USER_RESERVE_SEED"),
        pubkey.toBuffer(),
      ]

      if (tokenMint != undefined) {
        SEEDS.push(tokenMint.toBuffer())
      }

      return PublicKey.findProgramAddressSync(
        SEEDS,
        program.programId
      )[0]
    },

    userInfo: (pubkey: PublicKey) => {
      let SEEDS = [
        Buffer.from("USER_INFO"),
        pubkey.toBuffer(),
      ]

      return PublicKey.findProgramAddressSync(
        SEEDS,
        staking.programId
      )[0];
    },

    userTokenInfo: (pubkey: PublicKey) => {
      let SEEDS = [
        Buffer.from("USER_INFO"),
        pubkey.toBuffer(),
        tokenMint.toBuffer(),
      ]

      return PublicKey.findProgramAddressSync(
        SEEDS,
        token_staking.programId,
      )[0];
    }
  }

  // it("Is initialized!", async () => {
  //   try {
  //     const bankInfo = await program.account.bankInfo.fetch(BANK_APP_ACCOUNTS.bankInfo)
  //     console.log("Bank info: ", bankInfo)
  //   } catch {
  //     const tx = await program.methods.initialize()
  //       .accounts({
  //         //bankInfo: BANK_APP_ACCOUNTS.bankInfo,
  //         //bankVault: BANK_APP_ACCOUNTS.bankVault,
  //         authority: provider.publicKey,
  //         //systemProgram: SystemProgram.programId
  //       }).rpc();
  //     console.log("Initialize signature: ", tx);
  //   }
  // });

  it("Is deposited!", async () => {
  //   const tx = await program.methods.deposit(new BN(1_000))
  //     .accounts({
  //       //bankInfo: BANK_APP_ACCOUNTS.bankInfo,
  //       //bankVault: BANK_APP_ACCOUNTS.bankVault,
  //       //userReserve: BANK_APP_ACCOUNTS.userReserve(provider.publicKey),
  //       user: provider.publicKey,
  //       //systemProgram: SystemProgram.programId
  //     }).rpc();
  
    // const userReserve = await program.account.userReserve.fetch(BANK_APP_ACCOUNTS.userReserve(provider.publicKey))
    // console.log("User SOL reserve: ", userReserve.depositedAmount.toString())
  });
   //you should put your token mint here
  it("Is deposited token!", async () => {
  //   
  //   console.log("program id: " + program.programId);
  //   let userAta = getAssociatedTokenAddressSync(tokenMint, provider.publicKey)
  //   let bankAta = getAssociatedTokenAddressSync(tokenMint, BANK_APP_ACCOUNTS.bankVault, true)
  //   console.log("token program: " + TOKEN_PROGRAM_ID);
  //   console.log("associated token program: " + ASSOCIATED_TOKEN_PROGRAM_ID);
  //   console.log("Bank app account: " + BANK_APP_ACCOUNTS.bankVault);
  //   console.log("Bank ata: " + bankAta);   
    
  //   const info = await provider.connection.getAccountInfo(userAta);
  //   console.log(info);
  //   console.log("RPC Endpoint:", provider.connection.rpcEndpoint);
  //   let preInstructions: TransactionInstruction[] = []
  //   if (await provider.connection.getAccountInfo(bankAta) == null) {
  //     preInstructions.push(createAssociatedTokenAccountInstruction(
  //       provider.publicKey,
  //       bankAta,
  //       BANK_APP_ACCOUNTS.bankVault,
  //       tokenMint,
  //     ))
  //   }
    
  //   const tx = await program.methods.depositToken(new BN(1_000))
  //     .accounts({
  //       tokenMint,
  //       user: provider.publicKey,
  //     }).preInstructions(preInstructions).rpc();
  //   console.log("Deposit token signature: ", tx);

    // const userReserve = await program.account.userReserve.fetch(BANK_APP_ACCOUNTS.userReserve(provider.publicKey, tokenMint))
    // console.log("User Token reserve: ", userReserve.depositedAmount.toString())
  });

  it("Is withdrawed token!", async () => {
    // await program.methods.withdrawToken(new BN(500))
    // .accounts({
    //   tokenMint,
    //   user: provider.publicKey,
    // }).rpc();

    // const userReverse = await program.account.userReserve.fetch(BANK_APP_ACCOUNTS.userReserve(provider.publicKey, tokenMint))
    // console.log("User token reverse: " + userReverse.depositedAmount);
  });

  it("Is staked into app!", async() => {

    // const lamports = await connection.getBalance(BANK_APP_ACCOUNTS.bankInfo);
    // console.log("Bank vault lamport: " + lamports); 
    // console.log("1111");
    // console.log("Staking vault: " + BANK_APP_ACCOUNTS.stakingVault);
    // console.log("22222");
    // console.log("Stakin info: " + BANK_APP_ACCOUNTS.userInfo(BANK_APP_ACCOUNTS.bankVault));


    // const tx = await program.methods.invest(new BN(100), true)
    // .accounts({
    //   stakingVault: BANK_APP_ACCOUNTS.stakingVault,
    //   stakingInfo: BANK_APP_ACCOUNTS.userInfo(BANK_APP_ACCOUNTS.bankVault),
    //   //stakingPrgram: StakeProgram.programId,
    //   authority: provider.publicKey,
    // }).rpc();

     const userInfo = await staking.account.userInfo.fetch(BANK_APP_ACCOUNTS.userInfo(BANK_APP_ACCOUNTS.bankVault));
     console.log("Invested amount: " + userInfo.amount);
  })

  it("Is withdraw from app!", async() => {
    // const tx = await program.methods.invest(new BN(100), false)
    // .accounts({
    //   stakingVault: BANK_APP_ACCOUNTS.stakingVault,
    //   stakingInfo: BANK_APP_ACCOUNTS.userInfo(BANK_APP_ACCOUNTS.bankVault),
    //   //stakingPrgram: StakeProgram.programId,
    //   authority: provider.publicKey,
    // }).rpc();

    // const userInfo = await staking.account.userInfo.fetch(BANK_APP_ACCOUNTS.userInfo(BANK_APP_ACCOUNTS.bankVault));
    // console.log("Invested amount: " + userInfo.amount);

    
    // const lamports = await connection.getBalance(BANK_APP_ACCOUNTS.bankInfo);
    // console.log("Bank vault lamport: " + lamports); 
  })

  it("Is stake into token staking vault", async() => {
    let bankAta = getAssociatedTokenAddressSync(tokenMint, BANK_APP_ACCOUNTS.bankVault, true);
    let stakingAta = getAssociatedTokenAddressSync(tokenMint, BANK_APP_ACCOUNTS.tokenStakingVault, true);
    let preInstructions: TransactionInstruction[] = [];
    console.log("Name: ")
    //console.log(BANK_APP_ACCOUNTS.tokenStakingVault);
    const bankAtaAccount = await getAccount(connection, bankAta);
    console.log("Bank Token Balance: " + bankAtaAccount.amount.toString());
    console.log(stakingAta);
    
    if (await provider.connection.getAccountInfo(stakingAta) == null) {
      preInstructions.push(createAssociatedTokenAccountInstruction(
        provider.publicKey,
        stakingAta,
        BANK_APP_ACCOUNTS.tokenStakingVault,
        tokenMint,
      ));
    }

    /*const tx = await program.methods.investToken(new BN(100), true)
    .accounts({
      stakingVault: BANK_APP_ACCOUNTS.tokenStakingVault,
      tokenMint: tokenMint,
      stakingInfo: BANK_APP_ACCOUNTS.userTokenInfo(BANK_APP_ACCOUNTS.bankVault),
      authority: provider.publicKey,
    }).preInstructions(preInstructions).rpc();*/

    const userTokenInfo = await token_staking.account.userInfo.fetch(BANK_APP_ACCOUNTS.userTokenInfo(BANK_APP_ACCOUNTS.bankVault));
    console.log("Invest amount: " + userTokenInfo.amount);
  })

  it("Is withdraw from staking vault", async() => {
    /*const tx = await program.methods.investToken(new BN(50), false)
    .accounts({
      stakingVault: BANK_APP_ACCOUNTS.tokenStakingVault,
      tokenMint: tokenMint,
      stakingInfo: BANK_APP_ACCOUNTS.userTokenInfo(BANK_APP_ACCOUNTS.bankVault),
      authority: provider.publicKey,
    }).rpc();*/

    const userTokenInfo = await token_staking.account.userInfo.fetch(BANK_APP_ACCOUNTS.userTokenInfo(BANK_APP_ACCOUNTS.bankVault));
    console.log("Invest amount: " + userTokenInfo.amount);
  })

  
});

// Mint address: 3nLVs2g8RsQm8pyhwurZeJUQFW6LZSydJ17EQt1FSgzJ
// provider ata: 3ZLoQor1dZ7cAdV4B3yJSEVm8MHuoUNFQySLtXNuu6oq
// bank vault: GHjpEt9FiKw3Mvah6PRRajjeoh3pwE5YEzdamvDZMQwJ
// Bank ata: FAR9uFfAsY7ZVdMeAqgiyqkUqdNiMmP8d6daPuabG4xg