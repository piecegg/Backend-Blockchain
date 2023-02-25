/** @format */

export const setupAccount = () => {
  return `
import NonFungibleToken from "../contracts/standard/NonFungibleToken.cdc"
import Pieces from "../contracts/Pieces.cdc"
import MetadataViews from "../contracts/standard/MetadataViews.cdc"

// This transaction configures an account to hold a Pieces NFT.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Pieces.Collection>(from: Pieces.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Pieces.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: Pieces.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Pieces.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces.CollectionPublicPath, target: Pieces.CollectionStoragePath)
        }
    }
}

  `;
};
