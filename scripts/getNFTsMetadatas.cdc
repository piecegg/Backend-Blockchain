import Pieces from "../contracts/Pieces.cdc"

pub fun main(): {UInt64: Pieces.NFTMetadata} {
  return Pieces.getNFTMetadatas()
}