/** @format */

export const mintNFT = () => {
  return `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import Pieces from "Address"
  import MetadataViews from 0x631e88ae7f1d7c20
  import FlowToken from 0x7e60df042a9c0868


  transaction(metadataId: UInt64) {

    let PaymentVault: &FlowToken.Vault
    let CollectionPublic: &Pieces.Collection{NonFungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        // Setup
        if signer.borrow<&Pieces.Collection>(from: Pieces.CollectionStoragePath) == nil {
            signer.save(<- Pieces.createEmptyCollection(), to: Pieces.CollectionStoragePath)
            signer.link<&Pieces.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces.CollectionPublicPath, target: Pieces.CollectionStoragePath)
        }

        var paymentPath: StoragePath = /storage/flowTokenVault

        self.PaymentVault = signer.borrow<&FlowToken.Vault>(from: paymentPath)!

        self.CollectionPublic = signer.getCapability(Pieces.CollectionPublicPath)
                              .borrow<&Pieces.Collection{NonFungibleToken.Receiver}>()
                              ?? panic("Did not properly set up the Pieces NFT Collection.")

    }

    execute {
        let payment: @FlowToken.Vault <- self.PaymentVault.withdraw(amount: 1.0) as! @FlowToken.Vault
        let nftId = Pieces.mintNFT(metadataId: metadataId, recipient: self.CollectionPublic, payment: <- payment)
        log("An NFT has been minted successfully!")
    }

  }
  `;
};
