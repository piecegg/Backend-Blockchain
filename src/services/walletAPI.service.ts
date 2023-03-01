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

export const createAccount = async (IdempotencyKey: string) => {
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

export const mintNFT = async (metadataId, serial, address) => {
  const mintNFTCode = `
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
  var data = JSON.stringify({
    code: mintNFTCode,
    arguments: [
      {
        type: "UInt64",
        value: metadataId,
      },
      {
        type: "UInt64",
        value: serial,
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

const setupAccountCode = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import Pieces from 0x1ad3c2a8a0bca093
import MetadataViews from 0x631e88ae7f1d7c20

// This transaction configures an account to hold a Pieces NFT.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Pieces.Collection>(from: Pieces.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Pieces.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: Pieces.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Pieces.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces.CollectionPublicPath, target: Pieces.CollectionStoragePath)
        }
    }
}
  `;
