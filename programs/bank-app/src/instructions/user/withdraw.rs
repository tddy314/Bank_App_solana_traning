use anchor_lang::{prelude::*, system_program};

use crate::{
    constant::{BANK_INFO_SEED, USER_RESERVE_SEED, BANK_VAULT_SEED},
    error::BankAppError,
    state::{BankInfo, UserReserve},
    transfer_helper::sol_transfer_from_pda,
};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [BANK_INFO_SEED],
        bump
    )]
    pub bank_info: Box<Account<'info, BankInfo>>,
    
    /// CHECK: 
    #[account(
        mut,
        seeds = [BANK_VAULT_SEED],
        bump,
        owner = system_program::ID
    )]
    pub bank_vault: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [USER_RESERVE_SEED, user.key().as_ref()],
        bump,
    )]
    pub user_reserve: Box<Account<'info, UserReserve>>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    pub fn process(ctx: Context<Withdraw>, withdraw_amount: u64) -> Result<()> {
        if ctx.accounts.bank_info.is_paused {
            return Err(BankAppError::BankAppPaused.into());
        }

        let pda_seeds: &[&[&[u8]]] = &[&[BANK_VAULT_SEED, &[ctx.accounts.bank_info.bump]]];
        // Your code here
        let user_reserve = &mut ctx.accounts.user_reserve;
        if user_reserve.deposited_amount < withdraw_amount {
            return Err(BankAppError::NotEnoughBalance.into());
        }
        user_reserve.deposited_amount -= withdraw_amount;

        sol_transfer_from_pda(
            ctx.accounts.bank_vault.to_account_info(),
            ctx.accounts.user.to_account_info(),
            &ctx.accounts.system_program,
            pda_seeds,
            withdraw_amount,
        )?;

        Ok(())
    }
}