import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/4VfMAVAyvAsRKKyEv8Ntx4wbs76q9ZmEARdxZSDW5TGY"

        const metadata = {
            name: "Crazy Jeff",
            symbol: "CJ",
            description: "The OG Jeff",
            image,
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image,
                    },
                ]
            },
            creators: [{
                address: signer.publicKey,
                verified: true,
                share: 5
            }]
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
        // Your metadata URI:  https://arweave.net/6LdJTLNcBpnXBovTuQ9e4somR4b8nCzBsYiMgjcxuhHp  angry-ai
        // Your metadata URI:  https://arweave.net/AW88jWAtNmYs8r5mC9ahb3EaRsr9oB3hqPNLYnWT55gd  crazy-jeff
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
