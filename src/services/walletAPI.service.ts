/** @format */
import axios from "axios";
import { setupAccount as setupAccountCode } from "../Flow/actions";

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
  let setupAccountCode = `
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

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error.data);
      return error;
    });
};
