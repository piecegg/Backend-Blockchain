/** @format */

export const getOwnedNFTs = () => {
  return `
import Pieces from "../contracts/Pieces.cdc"
import MetadataViews from "../contracts/standard/MetadataViews.cdc"

pub fun main(Account: Address): [Pieces.NFTMetadata] {
  let collection = getAccount(Account).getCapability(Pieces.CollectionPublicPath)
                      .borrow<&Pieces.Collection{MetadataViews.ResolverCollection}>()!
  let answer: [Pieces.NFTMetadata] = []

  let ids = collection.getIDs()

  for id in ids {
    let resolver = collection.borrowViewResolver(id: id)
    let serialView = resolver.resolveView(Type<MetadataViews.Serial>())! as! MetadataViews.Serial
    answer.append(Pieces.getNFTMetadata(serialView.number)!)
  }

  return answer
}
  `;
};
