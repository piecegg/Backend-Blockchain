/** @format */

export const setupAccount = () => {
  return `
import NonFungibleToken from 0x631e88ae7f1d7c20
import Pieces_1 from 0x1ad3c2a8a0bca093
import MetadataViews from 0x631e88ae7f1d7c20

// This transaction configures an account to hold a Pieces_1 NFT.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Pieces_1.Collection>(from: Pieces_1.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Pieces_1.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: Pieces_1.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Pieces_1.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces_1.CollectionPublicPath, target: Pieces_1.CollectionStoragePath)
        }
    }
}
  `;
};
