/** @format */

export const uploadMetadata = () => {
  return `
  import Pieces_2 from 0x1ad3c2a8a0bca093

  transaction(
    _twitterId: UInt64,
    _description: String,
    _image: String,
    _ipfsCID: String
  ) {
    let Administrator: &Pieces_2.Administrator
    prepare(deployer: AuthAccount) {
      self.Administrator = deployer.borrow<&Pieces_2.Administrator>(from: Pieces_2.AdministratorStoragePath)
                           ?? panic("This account is not the Administrator.")
   }

    execute {

        self.Administrator.createNFTMetadata(
          twitterId: _twitterId,
          description: _description,
          imagePath: _image,
          ipfsCID: _ipfsCID,
          extra: {"Id": "TwitterId"}
        )
    }
  }
  `;
};
