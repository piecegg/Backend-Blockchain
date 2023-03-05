/** @format */

const fcl = require("@onflow/fcl");
const { authorizationFunction } = require("./helpers/authorization");

fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org");

const uploadMetadataTx = require("./transactions/uploadMetadataTx.js");
// This is the function that pays for the transaction and fees
const proposer = authorizationFunction;
const payer = authorizationFunction;
const authorizations = [authorizationFunction];

const uploadMetadata = async (name, description, image, ipfsCID) => {
  // Args
  const args = (arg, t) => [
    arg(name, t.String),
    arg(description, t.String),
    arg(image, t.String),
    arg(ipfsCID, t.String),
  ];
  return new Promise(async (resolve, reject) => {
    try {
      const transactionId = await fcl.mutate({
        cadence: uploadMetadataTx.uploadMetadataTx,
        args,
        proposer: authorizationFunction,
        payer: authorizationFunction,
        authorizations: [authorizationFunction],
        limit: 999,
      });
      const transaction = validateTransaction(
        await fcl.tx(transactionId).onceSealed()
      );
      return transaction;
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
};

module.exports = { uploadMetadata };
