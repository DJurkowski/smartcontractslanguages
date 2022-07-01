use anchor_lang::prelude::*;

declare_id!("AfAEnKXzWJBsJr7sd7MTf7xCNnvC3hiXiYWjF5waf1Pg");

#[program]
pub mod predsident_election {

    use super::*;
    use anchor_lang::solana_program::entrypoint::ProgramResult;
    use core::option::Iter;

    pub fn initialize(ctx: Context<Initialize>, vote_account_bump: u8) -> ProgramResult {
        ctx.accounts.vote_account.bump = vote_account_bump;
        ctx.accounts.vote_account.validator = ctx.accounts.user.key();
        Ok(())
    }

    pub fn vote_crunchy(ctx: Context<Vote>, citizen_key: Pubkey) -> Result<()> {
        let election_vote: &mut Account<VotingState> = &mut ctx.accounts.vote_account;

        let mut iter = election_vote.citizens.iter();
        if iter.any(|&v: &anchor_lang::prelude::Pubkey| v == citizen_key) {
            return err!(CustomError::CitizenAlreadyVote);
        }

        election_vote.crunchy += 1;
        election_vote.citizens.push(citizen_key);
        
        Ok(())
    }

    pub fn vote_smooth(ctx: Context<Vote>, citizen_key: Pubkey) -> Result<()> {
        let election_vote: &mut Account<VotingState> = &mut ctx.accounts.vote_account;

        let mut iter = election_vote.citizens.iter();
        if iter.any(|&v: &anchor_lang::prelude::Pubkey| v == citizen_key) {
            return err!(CustomError::CitizenAlreadyVote);
        }

        election_vote.smooth += 1;
        election_vote.citizens.push(citizen_key);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(vote_account_bump: u8)]
pub struct Initialize<'info> {
    #[account(init, seeds = [b"vote_account".as_ref()], bump, payer = user, space=10240)]
    vote_account: Account<'info, VotingState>,
    #[account(mut)]
    user: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut, seeds = [b"vote_account".as_ref()], bump = vote_account.bump)]
    vote_account: Account<'info, VotingState>,
}

#[account]
#[derive(Default)]
pub struct VotingState {
    crunchy: u64,
    smooth: u64,
    bump: u8,
    validator: Pubkey,
    citizens: Vec<Pubkey>,
}

#[error_code]
pub enum CustomError {
    #[msg("Citizen already voted.")]
    CitizenAlreadyVote,
}