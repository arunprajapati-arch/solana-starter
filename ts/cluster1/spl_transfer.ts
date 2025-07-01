import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("GPKYGaZG1SVc5eeYBEqEsLbnA8HxqjutDdvAQEKi2dVH");

// Recipient address
const to = new PublicKey("Fk1UXk3WR1syysBFyLQfURFTXsAAcBcgTbbEyB3SmsXi");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(connection, keypair,mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(connection, keypair,mint, to);
        // Transfer the new token to the "toTokenAccount" we just created
        const txn = await transfer(connection, keypair, fromWallet.address, toWallet.address, keypair.publicKey, 10000,)
        console.log(`Txn is ${txn}`);
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();