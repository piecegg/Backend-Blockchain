/** @format */

import WalletService from "../services/Wallet/walletAPI.service";
import FlowService from "../services/Flow/Flow.service";

export const FlowLogicHandler = async (TwitterId: number, Text: string) => {
  /* Check the account doesn't already exist
  - call the database with the TwitterID as param
  - if it returns an existing object, then
  - skip to create metadata
  */

  // Create a wallet for the Id
  const account = await WalletService.createAccount();
  console.log("Account Address", account.address);
  // Create metadataId
  const jobResponse = await FlowService.uploadMetadata(
    TwitterId,
    Text,
    "/Alex1.png",
    "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4"
  );
  console.log("Job NUMBER 1 responses", jobResponse);

  // Setup account
  const jobResponse2 = await FlowService.setupAccount(account.address);
  console.log("Job NUMBER 2 responses", jobResponse2);

  // Mint NFT into account
  const jobResponse3 = await FlowService.mintNFT(TwitterId, account.address);
  console.log("Job NUMBER 3 responses", jobResponse3);

  return jobResponse3;
};
