/** @format */

export const mintNFT = () => {
  return `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import Pieces from 0x1ad3c2a8a0bca093
  import MetadataViews from 0x631e88ae7f1d7c20



  transaction(_metadataId: UInt64, _serial: UInt64, _recipient: Address) {

    let Administrator: &Pieces.Administrator

    prepare(admin: AuthAccount) {
        // Confirm Admin
        self.Administrator = admin.borrow<&YoungApeDiaries.Administrator>(from: YoungApeDiaries.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
    }

    execute {
        self.Administrator.mintNFT(metadataId: _metadataId, serial: _serial, recipient: _recipient)
    }


  }
  `;
};
