import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import { readFileSync } from "fs"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const image = await readFile("./crazy-jeff.png")
        //2. Convert image to generic file.
        const genericImage = createGenericFile(image,"angry-ai", {
            contentType: "image/png"
        })
        //3. Upload image

        const [myUri] = await umi.uploader.upload([genericImage])

       
        console.log("Your image URI: ", myUri);
        // Your image URI:  https://arweave.net/HvZNN3igHYKnewkpNzk5TaGhBmyfPvGd7EdcHTo12orA   angry-ai
        // Your image URI:  https://arweave.net/4VfMAVAyvAsRKKyEv8Ntx4wbs76q9ZmEARdxZSDW5TGY  crazy-jeff
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
