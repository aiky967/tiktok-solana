use anchor_lang::prelude::*;
use solana_program::entrypoint::ProgramResult;
use std::mem::size_of;
use anchor_lang::solana_program::log::{
    sol_log_compute_units
};

declare_id!("996FV9fdyt2KiwE4RGeyNTa8jzbnqiA15yu2E2iYiR1T");

// Video and comment text length
const TEXT_LENGTH: usize = 1024;

const USER_NAME_LENGTH: usize = 100;

const USER_URL_LENGTH: usize = 255;
const VIDEO_URL_LENGTH: usize = 255;

const NUMBER_OF_ALLOWED_LIKES_SPACE: usize = 5;
const NUMBER_OF_ALLOWED_LIKES: usize = 5;

/// TikTok Clone program
#[program]
pub mod tiktok_clone {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateUser>,
        name: String,
        profile_url: String,
    ) -> ProgramResult {

        let user = &mut ctx.accounts.user;
        // Set authority
        user.user_wallet_address = ctx.accounts.authority.key();
        // Set name
        user.user_name = name;
        // Set profile
        user.user_profile_image_url = profile_url;

        msg!("User Added!");
        sol_log_compute_units();
        Ok(())
    }

    pub fn create_video (
        ctx: Context<CreateVideo>,
        descripiton: String,
        video_url: String,
        creator_name: String,
        creator_url: String,
    ) -> ProgramResult {
        msg!(&descripiton);

        let video: &mut Account<VideoAccount> = &mut &mut ctx.accounts.video;

        video.authority = ctx.accounts.authority.key();
        video.description = descripiton;
        video.video_url = video_url;

        video.creator_name = creator_name;
        video.creator_url = creator_url;
        video.comment_count = 0;
        video.creator_time = ctx.accounts.clock.unix_timestamp;
        video.likes = 0;

        msg!("Video Added!");
        sol_log_compute_units();
        Ok(())
    }

    pub fn create_comment (
        ctx: Context<CreateComment>,
        text: String,
        commenter_name: String,
        commenter_url: String,
    ) -> ProgramResult {
        
        let video: &mut Account<VideoAccount> = &mut ctx.accounts.video;

        let comment: &mut Account<CommentAccount> = &mut ctx.accounts.comment;

        comment.authority = ctx.accounts.authority.key();

        comment.text = text;

        comment.commenter_name = commenter_name;

        comment.commenter_url = commenter_url;

        comment.index = video.comment_count;

        comment.video_time = ctx.accounts.clock.unix_timestamp;

        video.comment_count += 1;

        Ok(())

    }

    pub fn like_video(ctx: Context<LikeVideo>) -> ProgramResult {

        let video: &mut Account<VideoAccount> = &mut ctx.accounts.video;

        let mut iter= video.people_who_liked.iter();
        let user_liking_video = ctx.accounts.authority.key();

        video.likes += 1;

        video.people_who_liked.push(user_liking_video);

        Ok(())
    }
}

////////////////////////////////// STRUCT /////////////////////

#[derive(Accounts)]
pub struct CreateUser<'info> {
    
    #[account(
        init,
        seeds = [b"user".as_ref(), authority.key().as_ref()],
        bump,
        payer = authority,
        space = size_of::<UserAccount>() + USER_NAME_LENGTH + VIDEO_URL_LENGTH + 8
    )]
    pub user: Account<'info, UserAccount>,

    // Authority (this is signer who paid transaction fee)
    #[account(mut)]
    pub authority: Signer<'info>,

    /// System program
    /// CHECK: Simple test account for tiktok
    pub system_program: UncheckedAccount<'info>,

    // Clock to save time
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct UserAccount {
    pub user_name: String,
    pub user_wallet_address: Pubkey,
    pub user_profile_image_url: String,
}

#[derive(Accounts)]
pub struct CreateVideo<'info> {
    #[account(
        init,
        seeds = [b"video".as_ref(), randomKey.key().as_ref()],
        bump,
        payer = authority,
        space = size_of::<VideoAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + 
        USER_URL_LENGTH + VIDEO_URL_LENGTH + 8 + 32 * NUMBER_OF_ALLOWED_LIKES
    )]

    pub video: Account<'info, VideoAccount>,

    #[account(mut)]
    pub randomKey: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: UncheckedAccount<'info>,

    pub clock: Sysvar<'info, Clock>
}

#[account]
pub struct VideoAccount {

    pub authority: Pubkey,

    pub description: String,

    pub video_url: String,

    pub creator_name: String,

    pub creator_url: String,

    pub comment_count: u64,

    pub index: u64,

    pub creator_time: i64,

    pub people_who_liked: Vec<Pubkey>,

    pub likes: u8,

    pub remove: i64,
}

#[derive(Accounts)]
pub struct CreateComment<'info> {
    #[account(mut)]
    pub video: Account<'info, VideoAccount>,

    #[account(
        init,
        seeds = [b"comment".as_ref(), video.key().as_ref(), video.comment_count.to_be_bytes().as_ref()],
        bump,
        payer = authority,
        space = size_of::<CommentAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + USER_URL_LENGTH + VIDEO_URL_LENGTH,
    )]
    pub comment: Account<'info, CommentAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub clock: Sysvar<'info, Clock>
}

#[account]
pub struct CommentAccount {
    pub authority: Pubkey,

    pub text: String,

    pub commenter_name: String,

    pub commenter_url: String,

    pub index: u64,

    pub video_time: i64,
}

#[derive(Accounts)]
pub struct LikeVideo<'info> {
    #[account(mut)]
    pub video: Account<'info, VideoAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: UncheckedAccount<'info>,

    pub clock: Sysvar<'info, Clock>
}