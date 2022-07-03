import React from "react";
import { Box, Button, Link, Typography } from "@material-ui/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { introStyle } from './IntroStyle';

const useStyles = introStyle;

export default function Intro({
  votes,
  initializeVoting,
  programID,
  voteAccount,
}) {
  const wallet = useWallet();
  const classes = useStyles();
  return (
    <Box textAlign="center">
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        className={classes.title}
      >
        President Elections
      </Typography>
      <Typography variant="body1">
        Choose your candidate
      </Typography>
      <Box marginTop="8px">
        {wallet.connected ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box className={classes.connectedBubble} />
            <Typography variant="body1" className={classes.connected}>
              Connected
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">
            To get started, connect your wallet
          </Typography>
        )}
      </Box>
      {(typeof votes.candidateOneNumberOfVotes !== "number" ||
        typeof votes.candidateOneNumberOfVotes !== "number") &&
        wallet.connected && (
          <Box marginTop="8px">
            <Typography variant="body1">
              This{" "}
              <Link
                href={`https://explorer.solana.com/address/${programID.toString()}`}
                underline="always"
              >
                program
              </Link>
              {"'s "}
              <Link
                href={`https://explorer.solana.com/address/${voteAccount?.toString()}`}
                underline="always"
              >
                vote account
              </Link>{" "}
              has not been initialized yet:
            </Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={initializeVoting}
              className={classes.button}
            >
              Initialize Program
            </Button>
          </Box>
        )}
    </Box>
  );
}
