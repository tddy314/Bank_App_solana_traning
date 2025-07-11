use anchor_lang::{prelude::*, system_program};
use anchor_spl::{
    token::Token,
    token_interface::{Mint, TokenAccount},
};

use crate::{
    constant::{BANK_INFO_SEED, BANK_VAULT_SEED, USER_RESERVE_SEED},
    error::BankAppError,
    state::{BankInfo, UserReserve},
    transfer_helper::token_transfer_from_pda,
};

#[derive(Accounts)]
pub struct WithdrawToken<'info> {
    #[account(
        seeds = [BANK_INFO_SEED],
        bump,
    )]
    pub bank_info: Box<Account<'info, BankInfo>>,

    /// CHECK:
    #[account(
        mut,
        seeds = [BANK_VAULT_SEED],
        bump,
        owner = system_program::ID,
    )]
    pub bank_vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = bank_vault
    )]
    pub bank_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        seeds = [
            USER_RESERVE_SEED,
            user.key().as_ref(),
            token_mint.key().as_ref()
        ],
        bump,
        payer = user,
        space = 8 + std::mem::size_of::<UserReserve>(),
    )]
    pub user_reserve: Box<Account<'info, UserReserve>>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

impl<'info> WithdrawToken<'info> {
    pub fn process(ctx: Context<WithdrawToken>, amount: u64) -> Result<()> {
        let bank_info = &ctx.accounts.bank_info;
        if bank_info.is_paused {
            return Err(BankAppError::BankAppPaused.into());
        }
        
        let user_reverse = &mut ctx.accounts.user_reserve;
        if user_reverse.deposited_amount < amount {
            return Err(BankAppError::NotEnoughBalance.into());
        }
        user_reverse.deposited_amount -= amount;

        let pda_seeds: &[&[&[u8]]] = &[&[BANK_VAULT_SEED, &[ctx.accounts.bank_info.bump]]];
        token_transfer_from_pda(
            ctx.accounts.bank_ata.to_account_info(), 
            ctx.accounts.bank_vault.to_account_info(), 
            ctx.accounts.user_ata.to_account_info(), 
            &ctx.accounts.token_program, 
            pda_seeds, 
            amount
        )?;

        Ok(())
    }
}