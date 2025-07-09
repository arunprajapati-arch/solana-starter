import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/3S14h94T6ApNVQnsN4Ak23PxLdBYwKon3CYEmxzC4uc8"

        const metadata = {
            name: "Original Crazy Jeff",
            symbol: "OCJ",
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
                share: 100
            }]
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
        // Your metadata URI:  https://arweave.net/6LdJTLNcBpnXBovTuQ9e4somR4b8nCzBsYiMgjcxuhHp  angry-ai
        // Your metadata URI:  https://arweave.net/AW88jWAtNmYs8r5mC9ahb3EaRsr9oB3hqPNLYnWT55gd  crazy-jeff
        // Your metadata URI:  https://arweave.net/87x8uNoA6cUDG8AcCZ7HQjNZGdQwjANezydhQJjrmktG  original crazy-jeff
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
