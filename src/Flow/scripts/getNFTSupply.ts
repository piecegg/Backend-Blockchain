/** @format */

export const getMintedNFTs = () => {
  return `
import Pieces from "../contracts/Pieces.cdc"

pub fun main(MetadataId: UInt64): UInt64? {
  return Pieces.getNFTMetadata(MetadataId)?.minted
}
  `;
};
