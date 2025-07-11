use anchor_lang::prelude::*;

pub mod constant;
pub mod error;
pub mod instructions;
pub mod state;
pub mod transfer_helper;

use instructions::*;

declare_id!("J7Kn4y5HtrjAwbK7mTwrko52mkPrVUgxw9R8M2HGJZDH");

#[program]
pub mod bank_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        return Initialize::process(ctx);
    }

    pub fn deposit(ctx: Context<Deposit>, deposit_amount: u64) -> Result<()> {
        return Deposit::process(ctx, deposit_amount);   
    }

    pub fn withdraw(ctx: Context<Withdraw>, withdraw_amount: u64) -> Result<()> {
        return Withdraw::process(ctx, withdraw_amount);
    }

    pub fn deposit_token(ctx: Context<DepositToken>, deposit_amount: u64) -> Result<()> {
        return DepositToken::process(ctx, deposit_amount);
    }

    pub fn withdraw_token(ctx: Context<WithdrawToken>, withdraw_amount: u64) -> Result<()> {
        return WithdrawToken::process(ctx, withdraw_amount);
    }

    pub fn pause(ctx: Context<Pause>) -> Result<()> {
        return Pause::process(ctx);
    }

    pub fn unpause(ctx: Context<UnPause>) -> Result<()> {
        return UnPause::process(ctx);
    }

    pub fn invest(ctx: Context<Invest>, amount: u64, is_stake: bool) -> Result<()> {
        return Invest::process(ctx, amount, is_stake);
    }

    pub fn investToken(ctx: Context<InvestToken>, amount: u64, is_stake: bool) -> Result<()> {
        return InvestToken::process(ctx, amount, is_stake);
    }
}
