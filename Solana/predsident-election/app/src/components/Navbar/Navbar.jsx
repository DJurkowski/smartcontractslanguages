import React from "react";
import { AppBar, Box, Container, Toolbar, Link } from "@material-ui/core";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import { navbarStyle } from './NavbarStyle';

const useStyles = navbarStyle;

export default function Navbar({ voteAccount }) {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.root}>
      <Container maxWidth="xl">
        <Toolbar className={classes.toolbar}>
          <img src="/images/voting-box.png" alt="President Election" height={40} />
          <Box display="flex" flexDirection="column">
            <WalletMultiButton />
            <Link
              className={classes.link}
              underline="always"
              href={`https://explorer.solana.com/address/${voteAccount?.toString()}?cluster=devnet`}
            >
              Show Transactions
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
