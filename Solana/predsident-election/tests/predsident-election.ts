import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PredsidentElection } from "../target/types/predsident_election";
import assert from "assert";
const { SystemProgram } = anchor.web3;

describe("predsident-election", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PredsidentElection as Program<PredsidentElection>;
  const voteAccount = anchor.web3.Keypair.generate();

  it("Initializes with 0 votes for crunchy and smooth", async () => {
    console.log("Testing Initialize...");
    /* The last element passed to RPC methods is always the transaction options. Because voteAccount is being created here, we are required to pass it as a signers array */
    await program.rpc.initialize({
      accounts: {
        voteAccount: voteAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [voteAccount],
    });
    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );
    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toString() == '0' && account.smooth.toString() == '0'
    );
  });
  it("Votes correctly for crunchy", async () => {
    console.log("Testing voteCrunchy...");
    await program.rpc.voteCrunchy({
      accounts: {
        voteAccount: voteAccount.publicKey,
      },
    });
    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );
    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toString() == '1' && account.smooth.toString() == '0'
    );
  });
  it("Votes correctly for smooth", async () => {
    console.log("Testing voteSmooth...");
    await program.rpc.voteSmooth({
      accounts: {
        voteAccount: voteAccount.publicKey,
      },
    });
    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );
    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toString() == '1' && account.smooth.toString() == '1'
    );
  });
});
