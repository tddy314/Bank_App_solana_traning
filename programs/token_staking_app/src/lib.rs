use anchor_lang::{prelude::*, system_program};
use anchor_spl::{
    token::Token,
    token_interface::{Mint, TokenAccount},
};
pub mod transfer_helper;

declare_id!("9bZdHwnp66yWMNCKET2Dxz1LfoVAvNHdPE5VdgHgh2JK");

#[program]
pub mod token_staking_app {

    pub const BANK_VAULT_SEED: &[u8] = b"BANK_VAULT";
    use super::*;
    use transfer_helper::*;

    const STAKING_APR: u64 = 5;
    const SECOND_PER_YEAR: u64 = 31_536_000;

    pub fn stake_token(ctx: Context<StakeToken >, amount: u64, is_stake: bool) -> Result<()> {
        let user_info = &mut ctx.accounts.user_info;
        let current_time: u64 = Clock::get()?.unix_timestamp.try_into().unwrap();
        let pass_time = if user_info.last_update_time == 0 {
            0
        } else {
            current_time - user_info.last_update_time
        };
        user_info.amount += user_info.amount * STAKING_APR * pass_time / 100 / SECOND_PER_YEAR;
        user_info.last_update_time = current_time;

        if amount !=0 {
            if is_stake {
                token_transfer_from_user(
                    ctx.accounts.user_ata.to_account_info(), 
                    &ctx.accounts.user, 
                    ctx.accounts.staking_ata.to_account_info(), 
                    &ctx.accounts.token_program, 
                    amount
                )?;

                user_info.amount += amount;
            }
            else {
                let pda_seeds: &[&[&[u8]]] = &[&[BANK_VAULT_SEED, &[ctx.bumps.staking_vault]]];
                token_transfer_from_pda(
                    ctx.accounts.staking_ata.to_account_info(), 
                    ctx.accounts.staking_vault.to_account_info(), 
                    ctx.accounts.user_ata.to_account_info(), 
                    &ctx.accounts.token_program, 
                    pda_seeds, 
                    amount
                )?;

                user_info.amount -= amount;
            }
        }

        Ok(())
    }

}

#[derive(Accounts)]
pub struct StakeToken<'info> {

    /// CHECK:
    #[account(
        init_if_needed,
        seeds = [b"BANK_VAULT"],
        bump,
        payer =  payer,
        space = 0,
        owner = system_program::ID,
    )]
    pub staking_vault: UncheckedAccount<'info>,

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
        associated_token::authority = staking_vault,
    )]
    pub staking_ata: Box<InterfaceAccount<'info, TokenAccount>>,  

    #[account(
        init_if_needed,
        seeds = [
            b"USER_INFO", 
            user.key().as_ref(),
            token_mint.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + std::mem::size_of::<UserInfo>(),
    )]
    pub user_info: Box<Account<'info, UserInfo>>,

    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct UserInfo {
    pub amount: u64,
    pub last_update_time: u64,
}

