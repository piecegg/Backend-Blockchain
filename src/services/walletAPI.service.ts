/** @format */
import axios from "axios";

export const fetchAccounts = async () => {
  let config = {
    method: "get",
    url: "https://piece.herokuapp.com/v1/accounts",
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const fetchAccount = async (accountAddress: string) => {
  let config = {
    method: "get",
    url: `https://piece.herokuapp.com/v1/accounts/${accountAddress}`,
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const createAccount = async () => {
  let config = {
    method: "post",
    url: "https://piece.herokuapp.com/v1/accounts?sync=nonez",
  };
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const setupAccount = async (address: string) => {
  let data = JSON.stringify({
    code: setupAccountCode,
  });

  let config = {
    method: "post",
    url: `https://piece.herokuapp.com/v1/accounts/${address}/transactions`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error.data);
      return error;
    });
};

export const mintNFT = async (metadataId: number, address: string) => {
  const mintNFTCode = `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import Pieces_1 from 0x1ad3c2a8a0bca093
  import MetadataViews from 0x631e88ae7f1d7c20



  transaction(_metadataId: UInt64, _recipient: Address) {

    let Administrator: &Pieces_1.Administrator

    prepare(admin: AuthAccount) {
        // Confirm Admin
        self.Administrator = admin.borrow<&Pieces_1.Administrator>(from: Pieces_1.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
    }

    execute {
        self.Administrator.mintNFT(metadataId: _metadataId, recipient: _recipient)
    }


  }
  `;
  var data = JSON.stringify({
    code: mintNFTCode,
    arguments: [
      {
        type: "UInt64",
        value: metadataId.toString(),
      },
      {
        type: "Address",
        value: address,
      },
    ],
  });
  let config = {
    method: "post",
    url: `https://piece.herokuapp.com/v1/accounts/0x1ad3c2a8a0bca093/transactions`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error.data);
      return error;
    });
};

export const uploadMetadata = async (
  _twitterId: number,
  _description: string,
  _image: string,
  _ipfsCID: string
) => {
  var data = JSON.stringify({
    code: uploadMetadataTx,
    arguments: [
      {
        type: "UInt64",
        value: _twitterId.toString(),
      },
      {
        type: "String",
        value: _description,
      },
      {
        type: "String",
        value: _image,
      },
      {
        type: "String",
        value: _ipfsCID,
      },
    ],
  });
  let config = {
    method: "post",
    url: `https://piece.herokuapp.com/v1/accounts/0x1ad3c2a8a0bca093/transactions`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error.data);
      return error.data;
    });
};

const setupAccountCode = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import Pieces_1 from 0x1ad3c2a8a0bca093
import MetadataViews from 0x631e88ae7f1d7c20

// This transaction configures an account to hold a Pieces_1 NFT.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Pieces_1.Collection>(from: Pieces_1.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Pieces_1.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: Pieces_1.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Pieces_1.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces_1.CollectionPublicPath, target: Pieces_1.CollectionStoragePath)
        }
    }
}
  `;

const uploadMetadataTx = `
import Pieces_1 from 0x1ad3c2a8a0bca093

transaction(
  _twitterId: UInt64,
  _description: String,
  _image: String,
  _ipfsCID: String
) {
  let Administrator: &Pieces_1.Administrator
  prepare(deployer: AuthAccount) {
    self.Administrator = deployer.borrow<&Pieces_1.Administrator>(from: Pieces_1.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
  }

  execute {

      self.Administrator.createNFTMetadata(
        twitterId: _twitterId,
        description: _description,
        imagePath: _image,
        ipfsCID: _ipfsCID,
      )
  }
}
  `;
