/** @format */

const uploadMetadataTx = `
import Pieces from 0x1ad3c2a8a0bca093

transaction(
  name: String,
  description: String,
  image: String,
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
      )
  }
}
  `;

module.exports = { uploadMetadataTx };
