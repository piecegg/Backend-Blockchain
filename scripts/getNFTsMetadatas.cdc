import Pieces_1 from "../contracts/Pieces_1.cdc"

pub fun main(): {UInt64: Pieces_1.NFTMetadata} {
  return Pieces_1.getNFTMetadatas()
}