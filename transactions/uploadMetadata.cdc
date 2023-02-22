import Pieces from "../contracts/Pieces.cdc"

transaction(
  name: String,
  description: String,
  image: String,
  extra: {String: String},
  ipfsCID: String
) {
  let Administrator: &Pieces.Administrator
  prepare(deployer: AuthAccount) {
    self.Administrator = deployer.borrow<&Pieces.Administrator>(from: Pieces.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
  }

  execute {

      self.Administrator.createNFTMetadata(
        name: name,
        description: description,
        imagePath: image,
        ipfsCID: ipfsCID,
        extra: extra,
      )
  }
}
