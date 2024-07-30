use anchor_lang::prelude::*;

declare_id!("BZRT2WuQaBUkRJkFs8yWdph2PNdt7pKzjdyJt9Pd6KLR");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
