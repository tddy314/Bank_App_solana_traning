use anchor_lang::prelude::*;

pub mod constant;
pub mod error;
pub mod instructions;
pub mod state;
pub mod transfer_helper;

use instructions::*;

declare_id!("9UqpozB7nRkDimT3SN88hD58tnVqzeBQtT9bBsNn1hc7");

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

    pub fn pause(ctx: Context<Pause>) -> Result<()> {
        return Pause::process(ctx);
    }

    pub fn unpause(ctx: Context<UnPause>) -> Result<()> {
        return UnPause::process(ctx);
    }
}
