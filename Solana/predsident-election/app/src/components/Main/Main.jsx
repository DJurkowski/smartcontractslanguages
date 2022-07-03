import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { Program, Provider, web3, BN } from "@project-serum/anchor";
import { Box, Container, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import idl from "../../idl.json";
import { preflightCommitment, programID } from "../../utils/config";
import { capitalize } from "../../utils/helpers";
import Navbar from "../Navbar/Navbar";
import VoteOption from "../VoteOption/VoteOption";
import ElectionProgress from "../ElectionProgress/ElectionProgress";
import Intro from "../Intro/Intro";
import VoteHistory from "../VoteHistory/VoteHistory";

const propTypes = {};

const defaultProps = {};

export default function Main({ voteAccount, voteAccountBump, network }) {
  const { enqueueSnackbar } = useSnackbar();
  const wallet = useWallet();

  const [votes, setVotes] = useState({
    candidateOneNumberOfVotes: null,
    candidateTwoNumberOfVotes: null,
  });
  const [voteTxHistory, setVoteTxHistory] = useState([]);

  useEffect(() => {
    console.log('VoteAccount', voteAccount);
    // Call Solana program for vote count
    async function getVotes() {
      const connection = new Connection(network, preflightCommitment);
      const provider = new Provider(connection, wallet, preflightCommitment);
      const program = new Program(idl, programID, provider);
      try {
        const account = await program.account.electionState.fetch(voteAccount);
        setVotes({
          candidateOneNumberOfVotes: account.candidateOneNumberOfVotes?.toNumber(),
          candidateTwoNumberOfVotes: account.candidateTwoNumberOfVotes?.toNumber(),
        });
        console.log(account.validator.toString());
      } catch (error) {
        console.log("could not getVotes: ", error);
      }
    }

    if (!!voteAccount) {
      getVotes();
    }
  }, [voteAccount, network, wallet]);

  async function getProvider() {
    const connection = new Connection(network, preflightCommitment);
    const provider = new Provider(connection, wallet, preflightCommitment);
    return provider;
  }

  // Initialize the program if this is the first time its launched
  async function initializeVoting() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.initialize(new BN(voteAccountBump), {
        accounts: {
          user: provider.wallet.publicKey,
          voteAccount: voteAccount,
          systemProgram: web3.SystemProgram.programId,
        },
      });
      console.log('User!!!: ', provider.wallet.publicKey.toString());
      const account = await program.account.electionState.fetch(voteAccount);
      console.log('User2!!!: ', provider.wallet.publicKey.toString());
      setVotes({
        candidateOneNumberOfVotes: account.candidateOneNumberOfVotes?.toNumber(),
        candidateTwoNumberOfVotes: account.candidateTwoNumberOfVotes?.toNumber(),
      });
      enqueueSnackbar("Vote account initialized", { variant: "success" });
    } catch (error) {
      console.log("Transaction error: ", error);
      console.log(error.toString());
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: "error" });
    }
  }

  async function handleVote(side) {
    const provider = await getProvider();
    console.log('User3!!!!', provider.wallet.publicKey.toString());
    const program = new Program(idl, programID, provider);
    try {
      const tx =
        side === "CandidateOne"
          ? await program.rpc.voteForCandidateOne(provider.wallet.publicKey, {
              accounts: {
                voteAccount,
              },
            })
          : await program.rpc.voteForCandidateTwo(provider.wallet.publicKey, {
              accounts: {
                voteAccount,
              },
            });

      const account = await program.account.electionState.fetch(voteAccount);
      setVotes({
        candidateOneNumberOfVotes: account.candidateOneNumberOfVotes?.toNumber(),
        candidateTwoNumberOfVotes: account.candidateTwoNumberOfVotes?.toNumber(),
      });
      enqueueSnackbar(`Voted for ${capitalize(side)}!`, { variant: "success" });
      setVoteTxHistory((oldVoteTxHistory) => [...oldVoteTxHistory, tx]);
    } catch (error) {
      console.log("Transaction error: ", error);
      console.log(error.toString());
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: "error" });
    }
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box flex="1 0 auto">
        <Navbar voteAccount={voteAccount}/>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Intro
                votes={votes}
                initializeVoting={initializeVoting}
                programID={programID}
                voteAccount={voteAccount}
              />
            </Grid>
            <Grid item xs={12}>
              <ElectionProgress votes={votes} />
            </Grid>
            <Grid item xs={6}>
              <VoteOption side="CandidateOne" isLeftSide={true} handleVote={handleVote} />
            </Grid>
            <Grid item xs={6}>
              <VoteOption side="CandidateTwo" isLeftSide={false} handleVote={handleVote} />
            </Grid>
            <Grid item xs={12}>
              <VoteHistory voteTxHistory={voteTxHistory} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;
