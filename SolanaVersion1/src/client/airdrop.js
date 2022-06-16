
import {
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import fs from 'mz/fs'

import {getOurAccount} from './ourAccount'
import {getNodeConnection} from './nodeConnection'

import {airDrop} from './util/air-drop'


async function main() {

  const currentAccount = await getOurAccount();

  const getConnection = await getNodeConnection();

  await airDrop(currentAccount, getConnection);
  
  let bal = await getConnection.getBalance( currentAccount.publicKey );
  
  console.log( "******************\nAccount hash: ", currentAccount.publicKey.toString());
  console.log( "Account balance: ", bal, "[", bal/LAMPORTS_PER_SOL, "]\n******************");
}

main()
  .catch(err => {
    console.error(err)
  })
  .then(() => process.exit())
