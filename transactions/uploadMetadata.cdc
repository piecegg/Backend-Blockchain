import Pieces_1 from "../contracts/Pieces.cdc"

transaction(
  twitterId: UInt64,
  description: String,
  image: String,
  ipfsCID: String
) {
  let Administrator: &Pieces_1.Administrator
  prepare(deployer: AuthAccount) {
    self.Administrator = deployer.borrow<&Pieces_1.Administrator>(from: Pieces_1.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
  }

  execute {

      self.Administrator.createNFTMetadata(
        twitterId: twitterId,
        description: description,
        imagePath: image,
        ipfsCID: ipfsCID,
      )
  }
}
