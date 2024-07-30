use anchor_lang::prelude::*;

declare_id!("BZRT2WuQaBUkRJkFs8yWdph2PNdt7pKzjdyJt9Pd6KLR");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

    pub fn add_movie_review_program(
        ctx: Context<AddMovieReview>,
        title: String,
        description: String,
        rating: u8,
    ) -> Result<()> {
        msg!("Movie Review Acccount Created");
        msg!("Title : {}", title);
        msg!("Description : {}", description);
        msg!("Rating : {}", rating);

        let movie_review = &mut ctx.accounts.movie_review;

        movie_review.title = title;
        movie_review.description = description;
        movie_review.rating = rating;
        movie_review.reviewer = ctx.accounts.initializer.key();

        Ok(())
    }

    pub fn update_movie_review(ctx: Context<UpdateMovieReview>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String,description:String)]
pub struct AddMovieReview<'info> {
    #[account(
        init,
        seeds=[title.as_bytes(),initializer.key().as_ref()],
        bump,
        payer=initializer,
        space=MovieAccountState::INIT_SPACE+title.len()+description.len()
    )]
    pub movie_review: Account<'info, MovieAccountState>,

    #[account(mut)]
    initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String,description:String)]
pub struct UpdateMovieReview {}

#[account]
pub struct MovieAccountState {
    pub reviewer: Pubkey,
    pub rating: u8,
    pub title: String,
    pub description: String,
}

impl Space for MovieAccountState {
    const INIT_SPACE: usize = 8 + 32 + 1 + 4 + 4;
}
