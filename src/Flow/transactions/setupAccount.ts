/** @format */

export const setupAccount = () => {
  return `
import NonFungibleToken from 0x631e88ae7f1d7c20
import Pieces from 0x1ad3c2a8a0bca093
import MetadataViews from 0x631e88ae7f1d7c20

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
