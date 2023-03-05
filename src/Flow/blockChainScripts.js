/** @format */

require("dotenv").config();

const { deployerTransactionCode } = require("../consts");
const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const Buffer = require("buffer/").Buffer;
const {
  authorizationFunction,
  // authorizationFunctionProposer,
} = require("./authorization");

fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org");

// This function validates the transaction
const validateTransaction = (transactionDetails) => {
  if (transactionDetails.status === 4 && transactionDetails.statusCode === 0) {
    console.log("Successful");
    return "Successful";
  } else {
    return transactionDetails;
  }
};

// const utf8ToHex = (utf8: string) => Buffer.from(utf8, 'utf8').toString('hex')

// This is the function that pays for the transaction and fees

const proposer = authorizationFunction;
const payer = authorizationFunction;
const authorizations = [authorizationFunction];

const uploadMetadataTransaction = () => {
  return `
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
};

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
        cadence: uploadMetadataTransaction(),
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

const deployCollection = async (
  collectionName,
  description,
  imageName,
  price,
  ipfs,
  socials,
  startMinting,
  royalty,
  royaltyAddress,
  royaltyNumber,
  code
) => {
  const hexCode = Buffer.from(code).toString("hex");
  const args = (arg, t) => [
    arg(collectionName, t.String),
    arg(collectionName, t.String),
    arg(description, t.String),
    arg(imageName, t.String),
    arg(imageName ? imageName : null, t.Optional(t.String)),
    arg(Number(price).toFixed(3), t.UFix64),
    arg(ipfs, t.String),
    // Socials
    arg(socials, t.Dictionary({ key: t.String, value: t.String })),
    // Contract Options
    arg(startMinting, t.Bool),
    arg(royalty, t.Bool),
    arg(royalty ? royaltyAddress : null, t.Optional(t.Address)),
    arg(royalty ? royaltyNumber : null, t.Optional(t.UFix64)),
    // Contract Code
    arg(hexCode, t.String),
  ];

  const txnId = await fcl.mutate({
    cadence: deployerTransactionCode,
    args,
    proposer: proposer,
    payer: payer,
    authorizations: authorizations,
    limit: 999,
  });

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());
  return response;
};

const upload_Metadata = async (
  collectionName,
  names,
  descriptions,
  images,
  thumbnails,
  prices,
  extras,
  supplies,
  ipfsCID
) => {
  const args = (arg, t) => [
    arg(names, t.Array(t.String)),
    arg(descriptions, t.Array(t.String)),
    arg(images, t.Array(t.String)),
    arg(thumbnails, t.Array(t.Optional(t.String))),
    arg(prices, t.Array(t.Optional(t.UFix64))),
    arg(extras, t.Array(t.Dictionary({ key: t.String, value: t.String }))),
    arg(supplies, t.Array(t.UInt64)),
    arg(ipfsCID, t.String),
  ];

  const transactionData = `
  import ${collectionName} from 0x5593df7d286bcdb8

  // Put a batch of up to 500 NFT Metadatas inside the contract
  transaction(
    names: [String],
    descriptions: [String],
    images: [String],
    thumbnails: [String?],
    prices: [UFix64?],
    extras: [{String: String}],
    supplies: [UInt64],
    ipfsCID: String
  ) {
    let Administrator: &${collectionName}.Administrator
    prepare(deployer: AuthAccount) {
      self.Administrator = deployer.borrow<&${collectionName}.Administrator>(from: ${collectionName}.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
    }

    pre {
      names.length <= 500:
        "There must be less than or equal to 500 NFTMetadata being added at a time."
      names.length == descriptions.length && descriptions.length == thumbnails.length && thumbnails.length == extras.length:
        "You must pass in a same amount of each parameter."
    }

    execute {
      var i = 0
      while i < names.length {
        self.Administrator.createNFTMetadata(
          name: names[i],
          description: descriptions[i],
          imagePath: images[i],
          thumbnailPath: thumbnails[i],
          ipfsCID: ipfsCID,
          price: prices[i],
          extra: extras[i],
          supply: supplies[i]
        )
        i = i + 1
      }
    }
  }
  `;
  const txnId = await fcl.mutate({
    cadence: transactionData,
    args,
    proposer: proposer,
    payer: payer,
    authorizations: authorizations,
    limit: 999,
  });

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());
  return response;
};

// Admin Batch Mint

const adminMint = async (collectionName, metadataIds, serials, recipient) => {
  const args = (arg, t) => [
    arg(metadataIds, t.Array(t.UInt64)),
    arg(serials, t.Array(t.UInt64)),
    arg(recipient, t.Array(t.Address)),
  ];

  const transactionData = `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import MetadataViews from 0x631e88ae7f1d7c20
  import ${collectionName} from 0x5593df7d286bcdb8


  transaction(_metadataIds: [UInt64], _serials: [UInt64], _recipients: [Address]) {

    let Administrator: &${collectionName}.Administrator


    prepare(admin: AuthAccount) {
        // Confirm Admin
        self.Administrator = admin.borrow<&${collectionName}.Administrator>(from: ${collectionName}.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
    }
        pre {
            _metadataIds.length == _serials.length && _serials.length == _recipients.length:
              "You must pass in a same amount of each parameter."
        }

    execute {
        self.Administrator.mintBatch(metadataIds: _metadataIds, serials: _serials, recipients: _recipients)
    }
  }
  `;
  const txnId = await fcl.mutate({
    cadence: transactionData,
    args,
    proposer: proposer,
    payer: payer,
    authorizations: authorizations,
    limit: 999,
  });

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());
  return response;
};

const mintNFT = async (collectionName, tokenID, metadata) => {
  const transactionData = `

  import NonFungibleToken from 0x631e88ae7f1d7c20
  import MetadataViews from 0x631e88ae7f1d7c20
  import ${collectionName} from 0x5593df7d286bcdb8


  transaction(_metadataIds: [UInt64], _serials: [UInt64], _recipients: [Address]) {

    let Administrator: &${collectionName}.Administrator


    prepare(admin: AuthAccount) {
        // Confirm Admin
        self.Administrator = admin.borrow<&${collectionName}.Administrator>(from: ${collectionName}.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
    }
        pre {
            _metadataIds.length == _serials.length && _serials.length == _recipients.length:
              "You must pass in a same amount of each parameter."
        }

    execute {
        self.Administrator.mintBatch(metadataIds: _metadataIds, serials: _serials, recipients: _recipients)
    }
}
   `;

  const transactionId = await fcl
    .send([
      fcl.transaction(transactionData),
      fcl.proposer(authorizationFunction),
      fcl.authorizations([authorizationFunction]),
      fcl.payer(authorizationFunction),
      fcl.limit(9999),
    ])
    .then(fcl.decode);

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());

  return response;
};

const toggle_minting = async (collectionName) => {
  const transactionData = `
    import ${collectionName} from 0x5593df7d286bcdb8

    transaction() {
      let Administrator: &${collectionName}.Administrator
      prepare(deployer: AuthAccount) {
        self.Administrator = deployer.borrow<&${collectionName}.Administrator>(from: ${collectionName}.AdministratorStoragePath)
                              ?? panic("This account has not deployed the contract.")
      }

      execute {
        self.Administrator.changeField(key: "minting", value: !(${collectionName}.getCollectionAttribute(key: "minting") as! Bool))
      }
    }
    `;
  const args = (arg, t) => [];

  const txnId = await fcl.mutate({
    cadence: transactionData,
    args,
    proposer: proposer,
    payer: payer,
    authorizations: authorizations,
    limit: 999,
  });

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());
  return response;
};

const getUserFlowBalance = async (account) => {
  const response = await fcl
    .send([
      fcl.script`
      import FungibleToken from ${process.env.FUNGIBLETOKEN_ADDRESS}
      import FlowToken from ${process.env.FLOWTOKEN_ADDRESS}
      pub fun main():UFix64 {
          let vaultRef = getAccount(${process.env.ACCOUNT_ADDRESS})
          // let vaultRef = getAccount(${account})
          .getCapability(/public/flowTokenBalance)
          .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow Balance reference to the Vault")
          return vaultRef.balance
      }
      `,
    ])
    .then(fcl.decode);
  return response;
};

module.exports = {
  deployCollection,
  upload_Metadata,
  adminMint,
  getUserFlowBalance,
  toggle_minting,
  uploadMetadata,
};
