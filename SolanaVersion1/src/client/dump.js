
import {
    PublicKey,
  } from '@solana/web3.js';
  
  import {getNodeConnection} from './nodeConnection'
  
  async function main() {
  
    const pubkey = process.argv[2];
  
    if ( ! pubkey ) {
      console.log("No hash/pubKey was given!");
      process.exit(1);
    }
  
    console.log("Account public key [PubKey]:",pubkey);
  
    let pk = new PublicKey(pubkey);
  
    const getConnection = await getNodeConnection()
  
    let currentAccount = await getConnection.getAccountInfo(pk);
  
    if ( !currentAccount ) {
      console.log("404. NOT FOUND.");
      console.log("Given account was not found on blockchain!");
      process.exit(1);
    }
    let contractOwner = new PublicKey(currentAccount.owner._bn);
    console.log(currentAccount);
    console.log("Contract owner public key [PubKey]: ",contractOwner.toString());
  }
  
  main()
    .catch(err => {
      console.error(err);
    })
    .then(() => process.exit());
  