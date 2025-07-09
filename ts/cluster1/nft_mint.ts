import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json"
import base58 from "bs58";

// const RPC_ENDPOINT = "https://api.devnet.solana.com";
const RPC_ENDPOINT = "https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "Original Crazy Jeff",
        symbol: "OCJ",
        uri:"  https://devnet.irys.xyz/87x8uNoA6cUDG8AcCZ7HQjNZGdQwjANezydhQJjrmktG",
        sellerFeeBasisPoints: percentAmount(5),
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();

// https://explorer.solana.com/tx/3U9mjHPsypZbrwMziQ7xD4voWSY3PdXqfBi67fUjit8krFZ8BqYgzxNUqFTNNt3CexASbSrDq78tjwGeMFhs1d6o?cluster=devnet
// Mint Address:  6nRdxGT6yfah7RQHtXTtyt6hbbMfMbXmcpfu7RBJozrz