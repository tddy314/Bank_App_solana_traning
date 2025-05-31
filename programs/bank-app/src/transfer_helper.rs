use anchor_lang::{
    prelude::*,
    solana_program::{
        program::{invoke, invoke_signed},
        system_instruction::transfer,
    },
};

//  transfer SOL from user
pub fn sol_transfer_from_user<'info>(
    signer: &Signer<'info>,
    destination: AccountInfo<'info>,
    system_program: &Program<'info, System>,
    amount: u64,
) -> Result<()> {
    let ix = transfer(signer.key, destination.key, amount);
    invoke(
        &ix,
        &[
            signer.to_account_info(),
            destination,
            system_program.to_account_info(),
        ],
    )?;
    Ok(())
}

// transfer sol from PDA
pub fn sol_transfer_from_pda<'info>(
    source: AccountInfo<'info>,
    destination: AccountInfo<'info>,
    system_program: &Program<'info, System>,
    signers_seeds: &[&[&[u8]]],
    amount: u64,
) -> Result<()> {
    //Your code here
    /*let ix = transfer(source.key, destination.key, amount);
    invoke_signed(
        &ix,
        &[
            source,
            destination,
            system_program.to_account_info(),
        ],
        signers_seeds,
    )?;*/
    let source_info = source.to_account_info();
    let dest_info = destination.to_account_info();

    let mut from_lamports = source_info.try_borrow_mut_lamports()?;
    let mut to_lamports = dest_info.try_borrow_mut_lamports()?;

    //require!(**from_lamports >= amount, "");

    **from_lamports -= amount;
    **to_lamports += amount;

    Ok(())
}
