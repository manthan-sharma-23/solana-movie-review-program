import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";
import { expect } from "chai";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

describe("anchor-movie-review-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorMovieReviewProgram as Program<AnchorMovieReviewProgram>;

  const movie = {
    title: "The Shawshank Redemption",
    description: "Wow what a good movie it was real great",
    rating: 5,
  };

  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.publicKey.toBuffer()],
    program.programId
  );

  it("initialize token mint", async () => {
    await program.methods.initializeTokenMint().rpc();
  });

  it("Movie review is added`", async () => {
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      provider.wallet.publicKey
    )
    
    const tx = await program.methods
      .addMovieReview(movie.title, movie.description, movie.rating)
      .accounts({
        tokenAccount: tokenAccount,
      })
      .rpc()
    
    const account = await program.account.movieAccountState.fetch(movie_pda)
    expect(account.title).to.equal(movie.title)
    expect(account.rating).to.equal(movie.rating)
    expect(account.description).to.equal(movie.description)
    expect(account.reviewer.toBase58()).to.equal(provider.wallet.publicKey.toBase58())
  
    const userAta = await getAccount(provider.connection, tokenAccount)
    expect(Number(userAta.amount)).to.equal((10 * 10) ^ 6)
  })

  it("update movie review", async () => {
    const newDescription = "Wow this is new";
    const newRating = 4;

    const tx = await program.methods
      .updateMovieReview(movie.title, newDescription, newRating)
      .rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);

    expect(movie.title === account.title);
    expect(newRating === account.rating);
    expect(newDescription === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });

  it("delete movie review", async () => {
    await program.methods.deleteMovieReview(movie.title).rpc();
  });
});
