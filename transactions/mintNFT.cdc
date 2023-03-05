import NonFungibleToken from "../contracts/standard/NonFungibleToken.cdc"
import Pieces_1 from "../contracts/Pieces.cdc"
import MetadataViews from "../contracts/standard/MetadataViews.cdc"
import FlowToken from "../contracts/standard/FlowToken.cdc"


transaction(metadataId: UInt64) {

    let PaymentVault: &FlowToken.Vault
    let CollectionPublic: &Pieces_1.Collection{NonFungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        // Setup
        if signer.borrow<&Pieces_1.Collection>(from: Pieces_1.CollectionStoragePath) == nil {
            signer.save(<- Pieces_1.createEmptyCollection(), to: Pieces_1.CollectionStoragePath)
            signer.link<&Pieces_1.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces_1.CollectionPublicPath, target: Pieces_1.CollectionStoragePath)
        }

        var paymentPath: StoragePath = /storage/flowTokenVault

        self.PaymentVault = signer.borrow<&FlowToken.Vault>(from: paymentPath)!

        self.CollectionPublic = signer.getCapability(Pieces_1.CollectionPublicPath)
                              .borrow<&Pieces_1.Collection{NonFungibleToken.Receiver}>()
                              ?? panic("Did not properly set up the Pieces_1 NFT Collection.")

    }

    execute {
        let payment: @FlowToken.Vault <- self.PaymentVault.withdraw(amount: 1.0) as! @FlowToken.Vault
        let nftId = Pieces_1.mintNFT(metadataId: metadataId, recipient: self.CollectionPublic, payment: <- payment)
        log("An NFT has been minted successfully!")
    }

}
