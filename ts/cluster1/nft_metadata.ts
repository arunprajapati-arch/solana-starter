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

        const image = "https://devnet.irys.xyz/HvZNN3igHYKnewkpNzk5TaGhBmyfPvGd7EdcHTo12orA"

        const metadata = {
            name: "Angry AI",
            symbol: "AAI",
            description: "A visual representation of how my AI feels",
            image,
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "image"
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
        // Your metadata URI:  https://arweave.net/6LdJTLNcBpnXBovTuQ9e4somR4b8nCzBsYiMgjcxuhHp
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
