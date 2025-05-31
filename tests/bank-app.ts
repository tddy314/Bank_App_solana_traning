import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankApp } from "../target/types/bank_app";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "bn.js";
import { use } from "chai";

describe("bank-app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.BankApp as Program<BankApp>;
  const user = Keypair.generate();
  console.log(user.publicKey);

  const BANK_APP_ACCOUNTS = {
    bankInfo: PublicKey.findProgramAddressSync(
      [Buffer.from("BANK_INFO_SEED")],
      program.programId
    )[0],
    userReserve: (pubkey: PublicKey) => PublicKey.findProgramAddressSync(
      [
        Buffer.from("USER_RESERVE_SEED"),
        pubkey.toBuffer()
      ],
      program.programId
    )[0],
  }

  it("Is initialized!", async () => {
    try {
      const bankInfo = await program.account.bankInfo.fetch(BANK_APP_ACCOUNTS.bankInfo)
      console.log("Bank info: ", bankInfo)
    } catch {
      const tx = await program.methods.initialize()
        .accounts({
          //bankInfo: BANK_APP_ACCOUNTS.bankInfo,
          authority: provider.publicKey,
          //systemProgram: SystemProgram.programId
        }).rpc();
      console.log("Initialize signature: ", tx);
    }
  });

  it("Is deposited!", async () => {

    // await program.methods.initialize()
    //     .accounts({
    //       //bankInfo: BANK_APP_ACCOUNTS.bankInfo,
    //       authority: provider.publicKey,
    //       //systemProgram: SystemProgram.programId
    //     }).rpc();
    const tx = await program.methods.deposit(new BN(1_000_000))
      .accounts({
        //bankInfo: BANK_APP_ACCOUNTS.bankInfo,
        //userReserve: BANK_APP_ACCOUNTS.userReserve(provider.publicKey),
        user: provider.publicKey,
        //systemProgram: SystemProgram.programId
      }).rpc();
    console.log("Deposit signature: ", tx);

    const userReserve = await program.account.userReserve.fetch(BANK_APP_ACCOUNTS.userReserve(provider.publicKey))
    console.log("User reserve: ", userReserve.depositedAmount.toString())
  });


  it("Is withdrawd!", async () => {
    const tx = await program.methods.withdraw(new BN(100_000))
    .accounts({
      user: provider.publicKey,
    }).rpc();
  
    const userReserve = await program.account.userReserve.fetch(BANK_APP_ACCOUNTS.userReserve(provider.publicKey))
    console.log("User reserve: ", userReserve.depositedAmount.toString())

  });

  it("Test Pause/UnPause", async () => {
    await program.methods.pause()
    .accounts({
      user: provider.publicKey,
    }).rpc();
    let bank_status = (await program.account.bankInfo.fetch(BANK_APP_ACCOUNTS.bankInfo)).isPaused;
    console.log("App status: " + bank_status);
    // Test deposit / withdraw
    try{
      await program.methods.deposit(new BN(1_000))
      .accounts({
        user: provider.publicKey,
      }).rpc();
    } catch(error) {
      console.log(error.message);
    }

    try {
      await program.methods.withdraw(new BN(1_000))
      .accounts({
        user: provider.publicKey,
      }).rpc();
    } catch (error) {
      console.log(error.message);
    }
  
    // Test Unpause 
    await program.methods.unpause()
    .accounts({
      user: provider.publicKey,
    }).rpc();

    bank_status = (await program.account.bankInfo.fetch(BANK_APP_ACCOUNTS.bankInfo)).isPaused;
    console.log("App status: " + bank_status);
  })

  it("Check authority!", async() => {
    //test pause
    try {
      await program.methods.pause()
      .accounts({
        user: user.publicKey,
      }).rpc();
    } catch(error) {
      console.log(error.message);
    }     
    let bank_status = (await program.account.bankInfo.fetch(BANK_APP_ACCOUNTS.bankInfo)).isPaused;
    console.log("App status: " + bank_status);

    await program.methods.pause()
    .accounts({
      user: provider.publicKey,
    }).rpc();


    //test unpause
    try {
      await program.methods.unpause()
      .accounts({
        user: user.publicKey,
      }).rpc();
    } catch(error) {
      console.log(error.message);
    }

    bank_status = (await program.account.bankInfo.fetch(BANK_APP_ACCOUNTS.bankInfo)).isPaused;
    console.log("App status: " + bank_status);
  })
});
