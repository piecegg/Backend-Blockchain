/** @format */

export const getNFTsMetadata = () => {
  return `
import Pieces from "address"

pub fun main(): {UInt64: Pieces.NFTMetadata} {
  return Pieces.getNFTMetadatas()
}
  `;
};
