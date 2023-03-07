/** @format */
//@ts-ignore
import flowScripts from "../Flow/FlowScripts.js";
import { uploadMetadata, fetchAccount } from "../services/walletAPI.service";
import { FlowLogicHandler } from "../utilities/FlowLogic";

export const uploadMetadataHandler = async (req: any, res: any) => {
  try {
    const response = await uploadMetadata(
      43246,
      "Testing metadata creation for Pieces NFTs",
      "/Alex1.png",
      "ipfs://bafybeihkurbbjxq5v7ag62ahvatrvizmv4tqebzzm26nz6ils4nxgh5ko4"
    );
    console.log("response", response);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const testHandler = async (req: any, res: any) => {
  try {
    const response = await FlowLogicHandler(1234567, "textTest for NFT");
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
