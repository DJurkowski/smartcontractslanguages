
import {
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'

import {getOurAccount} from './ourAccount'
import {getNodeConnection} from './nodeConnection'


async function main() {

  const currentAccount = await getOurAccount();

  const getConnection = await getNodeConnection();

  let bal = await getConnection.getBalance( currentAccount.publicKey );
  
  console.log( "******************\nAccount hash: ", currentAccount.publicKey.toString());
  console.log( "Account balance: ", bal, "[", bal/LAMPORTS_PER_SOL, "]\n******************");
}

main()
  .catch(err => {
    console.error(err)
  })
  .then(() => process.exit())
