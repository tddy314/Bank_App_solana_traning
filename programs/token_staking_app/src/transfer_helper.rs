use anchor_lang::{
    prelude::*,
    solana_program::{
        program::{invoke, invoke_signed},
        system_instruction::transfer,
    },
};

use anchor_spl::token::{self, spl_token, Token};

pub fn token_transfer_from_user<'info>(
    from: AccountInfo<'info>,
    authority: &Signer<'info>,
    to: AccountInfo<'info>,
    token_program: &Program<'info, Token>,
    amount: u64,
) -> Result<()> {
    let cpi_ctx: CpiContext<_> = CpiContext::new(
        token_program.to_account_info(), 
        token::Transfer {
            from: from,
            to: to,
            authority: authority.to_account_info(),
        },
    );
    token::transfer(cpi_ctx, amount)?;
    Ok(())
}

pub fn token_transfer_from_pda<'info>(
    from: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    to: AccountInfo<'info>,
    token_program: &Program<'info, Token>,
    pda_seeds: &[&[&[u8]]],
    amount: u64,
) -> Result<()> {
    let cpi_ctx = CpiContext::new_with_signer(
        token_program.to_account_info(), 
        token::Transfer{
            from: from,
            to: to,
            authority: authority.to_account_info(),
        }, 
        pda_seeds,
    );
    token::transfer(cpi_ctx, amount)?;
    Ok(())
}